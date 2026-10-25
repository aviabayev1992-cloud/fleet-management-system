/**
 * Sample data for the first version of the dashboard.
 * Will be replaced by real data from the database in the next stage.
 * Expiry dates are relative to "today" so the dashboard always looks realistic.
 */
import type { DocumentType, Driver, FleetDocument, Truck, TruckStatus } from "@fleet/shared";

const FIRST_NAMES = ["יוסי", "משה", "אבי", "דני", "רונן", "איתן", "עומר", "שרון", "גיל", "אלון", "יעקב", "חיים", "נועם", "אמיר", "ליאור", "רפי", "עידו", "שי", "מוטי", "בני", "קובי", "תומר"];
const LAST_NAMES = ["כהן", "לוי", "מזרחי", "פרץ", "ביטון", "אברהם", "פרידמן", "דהן", "אזולאי", "חדד", "גבאי", "שלום"];
const MODELS: Array<[string, string]> = [
  ["וולוו", "FH 500"],
  ["מרצדס", "Actros 1845"],
  ["סקניה", "R450"],
  ["דאף", "XF 480"],
  ["מאן", "TGX 18.470"],
  ["איווקו", "S-Way"],
];

const TRUCK_COUNT = 24;
const DRIVER_COUNT = 22;

function isoDateFromToday(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function truckStatus(i: number): TruckStatus {
  if (i === 6 || i === 17) return "maintenance";
  if (i === 21) return "inactive";
  return "active";
}

export const drivers: Driver[] = Array.from({ length: DRIVER_COUNT }, (_, i) => ({
  id: `d${i + 1}`,
  firstName: FIRST_NAMES[i % FIRST_NAMES.length]!,
  lastName: LAST_NAMES[(i * 5) % LAST_NAMES.length]!,
  phone: `05${(i % 8) + 0}-${String(1000000 + i * 37421).slice(0, 7)}`,
  status: i === 9 ? "vacation" : i === 19 ? "inactive" : "active",
}));

export const trucks: Truck[] = Array.from({ length: TRUCK_COUNT }, (_, i) => {
  const [manufacturer, model] = MODELS[i % MODELS.length]!;
  return {
    id: `t${i + 1}`,
    fleetNumber: String(i + 1),
    licensePlate: `${String(10 + ((i * 7) % 89)).padStart(2, "0")}-${String(100 + ((i * 53) % 899))}-${String(10 + ((i * 31) % 89))}`,
    manufacturer,
    model,
    year: 2016 + (i % 9),
    status: truckStatus(i),
    assignedDriverId: i < DRIVER_COUNT ? `d${i + 1}` : undefined,
  };
});

/** Hand-picked documents that need attention, so the dashboard shows each status. */
const ATTENTION: Array<[DocumentType, "truck" | "driver", number, number]> = [
  // [type, ownerType, ownerIndex, daysFromToday]
  ["insurance_mandatory", "truck", 11, -4],
  ["driving_license", "driver", 4, -1],
  ["annual_inspection", "truck", 2, 0],
  ["vehicle_license", "truck", 7, 3],
  ["medical_certificate", "driver", 13, 6],
  ["insurance_comprehensive", "truck", 11, 12],
  ["hazmat_permit", "driver", 2, 19],
  ["vehicle_license", "truck", 15, 24],
  ["annual_inspection", "truck", 20, 28],
];

function buildDocuments(): FleetDocument[] {
  const docs: FleetDocument[] = [];
  const overridden = new Set(ATTENTION.map(([type, owner, idx]) => `${owner}:${idx}:${type}`));
  let n = 0;
  const add = (type: DocumentType, ownerType: "truck" | "driver", idx: number, offset: number) => {
    docs.push({
      id: `doc${++n}`,
      type,
      ownerType,
      ownerId: `${ownerType === "truck" ? "t" : "d"}${idx + 1}`,
      expiresOn: isoDateFromToday(offset),
    });
  };

  for (const [type, ownerType, idx, offset] of ATTENTION) add(type, ownerType, idx, offset);

  const truckTypes: DocumentType[] = ["vehicle_license", "insurance_mandatory", "insurance_comprehensive", "annual_inspection"];
  trucks.forEach((_, idx) =>
    truckTypes.forEach((type, k) => {
      if (!overridden.has(`truck:${idx}:${type}`)) add(type, "truck", idx, 45 + ((idx * 37 + k * 71) % 300));
    }),
  );

  const driverTypes: DocumentType[] = ["driving_license", "medical_certificate"];
  drivers.forEach((_, idx) =>
    driverTypes.forEach((type, k) => {
      if (!overridden.has(`driver:${idx}:${type}`)) add(type, "driver", idx, 60 + ((idx * 43 + k * 89) % 600));
    }),
  );

  return docs;
}

export const documents: FleetDocument[] = buildDocuments();

export interface ActivityItem {
  id: string;
  text: string;
  when: string;
}

export const recentActivity: ActivityItem[] = [
  { id: "a1", text: "הועלה ביטוח מקיף חדש למשאית 5", when: "לפני שעה" },
  { id: "a2", text: "משאית 7 נכנסה לטיפול במוסך", when: "לפני 3 שעות" },
  { id: "a3", text: "עודכן רישיון נהיגה של עומר דהן", when: "אתמול" },
  { id: "a4", text: "נוסף נהג חדש: קובי גבאי", when: "לפני יומיים" },
  { id: "a5", text: "טסט שנתי עבר בהצלחה – משאית 14", when: "לפני 4 ימים" },
];
