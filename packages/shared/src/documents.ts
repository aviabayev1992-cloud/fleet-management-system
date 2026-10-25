import type { DocumentType, ExpiryStatus } from "./types";

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  vehicle_license: "רישיון רכב",
  insurance_mandatory: "ביטוח חובה",
  insurance_comprehensive: "ביטוח מקיף",
  annual_inspection: "טסט שנתי",
  driving_license: "רישיון נהיגה",
  medical_certificate: "אישור רפואי",
  hazmat_permit: "היתר חומרים מסוכנים",
  other: "מסמך אחר",
};

/** Days before expiry at which a document becomes "critical" / "warning". */
export const EXPIRY_THRESHOLDS = {
  critical: 7,
  warning: 30,
} as const;

export const EXPIRY_STATUS_LABELS: Record<ExpiryStatus, string> = {
  expired: "פג תוקף",
  critical: "דחוף",
  warning: "בקרוב",
  valid: "בתוקף",
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toUtcMidnight(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseIsoDate(iso: string): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) {
    throw new Error(`Invalid ISO date: ${iso}`);
  }
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

/**
 * Whole calendar days from `today` until `expiresOn`.
 * Negative when already expired, 0 when it expires today.
 */
export function daysUntil(expiresOn: string, today: Date = new Date()): number {
  return Math.round((parseIsoDate(expiresOn) - toUtcMidnight(today)) / MS_PER_DAY);
}

export function getExpiryStatus(expiresOn: string, today: Date = new Date()): ExpiryStatus {
  const days = daysUntil(expiresOn, today);
  if (days < 0) return "expired";
  if (days <= EXPIRY_THRESHOLDS.critical) return "critical";
  if (days <= EXPIRY_THRESHOLDS.warning) return "warning";
  return "valid";
}

/** Short Hebrew description such as "בעוד 5 ימים" or "פג לפני יומיים". */
export function describeDaysUntil(days: number): string {
  if (days === 0) return "יפוג היום";
  const abs = Math.abs(days);
  const amount = abs === 1 ? "יום אחד" : abs === 2 ? "יומיים" : `${abs} ימים`;
  return days > 0 ? `בעוד ${amount}` : `פג לפני ${amount}`;
}
