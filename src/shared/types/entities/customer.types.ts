export interface Customer {
  id: string;
  businessName: string;
  representativeName: string;
  rnc?: string | null;
  email?: string | null;
  phones: CustomerPhone[];
  addresses: CustomerAddress[];
  notes?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PhoneType = "MOVIL" | "FIJO" | "TRABAJO" | "OTROS";

export interface CustomerPhone {
  id: number;
  description: string;
  phoneNumber: string;
  type: PhoneType;
  hasWhatsapp: boolean;
  isPrimary: boolean;
}

export interface CustomerAddress {
  id: number;
  direction: string;
  city: string;
  isPrimary: boolean;
}
