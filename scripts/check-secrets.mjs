// Fails if a file tracked by Git (or staged) contains a Supabase secret key
// or a service_role JWT. Run with: npm run check:secrets
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean)
  .filter((f) => !/\.(png|jpe?g|gif|webp|ico|woff2?|pdf)$/i.test(f) && f !== "package-lock.json");

const JWT = /eyJ[A-Za-z0-9_-]{10,}\.(eyJ[A-Za-z0-9_-]{10,})\.[A-Za-z0-9_-]+/g;
const problems = [];

for (const file of files) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  if (/sb_secret_[A-Za-z0-9_-]{10,}/.test(text)) problems.push(`${file}: Supabase secret key (sb_secret_...)`);
  for (const [, payload] of text.matchAll(JWT)) {
    try {
      const role = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")).role;
      if (role === "service_role") problems.push(`${file}: service_role JWT`);
    } catch {
      // not a JWT we can read
    }
  }
}

if (problems.length > 0) {
  console.error("Secret keys found – remove them before committing:\n" + problems.map((p) => `  - ${p}`).join("\n"));
  process.exit(1);
}
console.log(`No secret keys found (${files.length} files checked).`);
