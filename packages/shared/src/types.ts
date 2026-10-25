/**
 * Core domain types shared by the manager website and the future driver app.
 */

export type TruckStatus = "active" | "maintenance" | "inactive";

export interface Truck {
  id: string;
  /** Internal fleet number, e.g. "12". */
  fleetNumber: string;
  licensePlate: string;
  manufacturer: string;
  model: string;
  year: number;
  status: TruckStatus;
  assignedDriverId?: string;
}

export type DriverStatus = "active" | "vacation" | "inactive";

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: DriverStatus;
}

export type DocumentOwnerType = "truck" | "driver";

export type DocumentType =
  | "vehicle_license"
  | "insurance_mandatory"
  | "insurance_comprehensive"
  | "annual_inspection"
  | "driving_license"
  | "medical_certificate"
  | "hazmat_permit"
  | "other";

export interface FleetDocument {
  id: string;
  type: DocumentType;
  ownerType: DocumentOwnerType;
  ownerId: string;
  /** ISO date (YYYY-MM-DD). */
  expiresOn: string;
}

export type ExpiryStatus = "expired" | "critical" | "warning" | "valid";
