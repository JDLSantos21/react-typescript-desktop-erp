export interface CreateCustomerPhoneDto {
  description: string;
  phoneNumber: string;
  type: "MOVIL" | "FIJO" | "TRABAJO" | "OTROS";
  hasWhatsapp: boolean;
  isPrimary: boolean;
}

export interface CreateCustomerAddressDto {
  branchName?: string;
  direction: string;
  city: string;
  isPrimary: boolean;
}

export interface CreateCustomerDto {
  businessName: string;
  representativeName: string;
  rnc?: string;
  email?: string;
  notes?: string;
  phones: CreateCustomerPhoneDto[];
  addresses: CreateCustomerAddressDto[];
}

export interface UpdateCustomerDto {
  businessName: string;
  representativeName: string;
  rnc?: string;
  email?: string;
  notes?: string;
}

export interface UpdateCustomerPhoneDto extends CreateCustomerPhoneDto {}
export interface UpdateCustomerAddressDto extends CreateCustomerAddressDto {}
