import { describe, expect, it } from "vitest";
import { daysUntil, describeDaysUntil, getExpiryStatus } from "./documents";

const today = new Date(2026, 9, 25); // 25 Oct 2026, local time

describe("daysUntil", () => {
  it("returns 0 for today", () => {
    expect(daysUntil("2026-10-25", today)).toBe(0);
  });

  it("counts future and past days", () => {
    expect(daysUntil("2026-11-01", today)).toBe(7);
    expect(daysUntil("2026-10-20", today)).toBe(-5);
  });

  it("handles month and year boundaries", () => {
    expect(daysUntil("2027-01-01", today)).toBe(68);
  });

  it("rejects malformed dates", () => {
    expect(() => daysUntil("25/10/2026", today)).toThrow();
  });
});

describe("getExpiryStatus", () => {
  it.each([
    ["2026-10-24", "expired"],
    ["2026-10-25", "critical"],
    ["2026-11-01", "critical"],
    ["2026-11-02", "warning"],
    ["2026-11-24", "warning"],
    ["2026-11-25", "valid"],
  ] as const)("%s -> %s", (date, status) => {
    expect(getExpiryStatus(date, today)).toBe(status);
  });
});

describe("describeDaysUntil", () => {
  it("uses natural Hebrew phrasing", () => {
    expect(describeDaysUntil(0)).toBe("יפוג היום");
    expect(describeDaysUntil(1)).toBe("בעוד יום אחד");
    expect(describeDaysUntil(2)).toBe("בעוד יומיים");
    expect(describeDaysUntil(12)).toBe("בעוד 12 ימים");
    expect(describeDaysUntil(-3)).toBe("פג לפני 3 ימים");
  });
});
