import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-3 py-24 text-center">
      <h1 className="text-2xl font-bold text-slate-900">הדף לא נמצא</h1>
      <p className="text-slate-500">ייתכן שהקישור שגוי או שהדף הוסר.</p>
      <Link href="/" className="mt-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
        חזרה למסך הראשי
      </Link>
    </div>
  );
}
