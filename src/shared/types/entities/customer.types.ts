export interface Customer {
  id: string;
  businessName: string;
  representativeName: string;
  rnc?: string | null;
  email?: string | null;
  receivesOrderEmails: boolean;
  orderEmailsUnsubscribedAt: string | null;
  phones: CustomerPhone[];
  addresses: CustomerAddress[];
  notes?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PhoneType = "MOVIL" | "FIJO" | "TRABAJO" | "OTROS";

export interface CustomerEntity extends Omit<Customer, "phones" | "addreses"> {}

export interface CustomerPhone {
  id: number;
  description: string | null;
  phoneNumber: string;
  type: PhoneType;
  hasWhatsapp: boolean;
  isPrimary: boolean;
}

export interface CustomerAddress {
  id: number;
  branchName: string | null;
  direction: string;
  city: string;
  coords: {
    latitude: number;
    longitude: number;
  } | null;
  isPrimary: boolean;
  locationSource: "MANUAL" | "MAP" | "MOBILE_GPS";
}
