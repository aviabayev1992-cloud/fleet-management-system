import {
  DOCUMENT_TYPE_LABELS,
  EXPIRY_THRESHOLDS,
  daysUntil,
  getExpiryStatus,
  type ExpiryStatus,
  type FleetDocument,
} from "@fleet/shared";
import { documents, drivers, trucks } from "./mock-data";

export interface AttentionItem {
  id: string;
  documentLabel: string;
  ownerLabel: string;
  ownerDetail: string;
  ownerType: FleetDocument["ownerType"];
  expiresOn: string;
  days: number;
  status: ExpiryStatus;
}

function describeOwner(doc: FleetDocument): { label: string; detail: string } {
  if (doc.ownerType === "truck") {
    const truck = trucks.find((t) => t.id === doc.ownerId);
    return truck
      ? { label: `משאית ${truck.fleetNumber}`, detail: truck.licensePlate }
      : { label: "משאית לא ידועה", detail: "" };
  }
  const driver = drivers.find((d) => d.id === doc.ownerId);
  return driver
    ? { label: `${driver.firstName} ${driver.lastName}`, detail: "נהג" }
    : { label: "נהג לא ידוע", detail: "" };
}

export function getDashboardData(today: Date = new Date()) {
  const attention: AttentionItem[] = documents
    .map((doc) => {
      const owner = describeOwner(doc);
      return {
        id: doc.id,
        documentLabel: DOCUMENT_TYPE_LABELS[doc.type],
        ownerLabel: owner.label,
        ownerDetail: owner.detail,
        ownerType: doc.ownerType,
        expiresOn: doc.expiresOn,
        days: daysUntil(doc.expiresOn, today),
        status: getExpiryStatus(doc.expiresOn, today),
      };
    })
    .filter((item) => item.status !== "valid")
    .sort((a, b) => a.days - b.days);

  const truckCounts = {
    active: trucks.filter((t) => t.status === "active").length,
    maintenance: trucks.filter((t) => t.status === "maintenance").length,
    inactive: trucks.filter((t) => t.status === "inactive").length,
  };

  return {
    totals: {
      trucks: trucks.length,
      activeTrucks: truckCounts.active,
      drivers: drivers.length,
      activeDrivers: drivers.filter((d) => d.status === "active").length,
      documents: documents.length,
      expired: attention.filter((a) => a.status === "expired").length,
      expiringSoon: attention.filter((a) => a.status !== "expired").length,
    },
    truckCounts,
    attention,
    warningDays: EXPIRY_THRESHOLDS.warning,
  };
}
