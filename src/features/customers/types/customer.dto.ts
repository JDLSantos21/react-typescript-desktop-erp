export interface CreateCustomerPhoneDto {
  description: string;
  phone_number: string;
  type: "MOVIL" | "FIJO" | "TRABAJO" | "OTROS";
  has_whatsapp: boolean;
  is_primary: boolean;
}

export interface CreateCustomerAddressDto {
  branch_name?: string;
  direction: string;
  city: string;
  is_primary: boolean;
}

export interface CreateCustomerDto {
  business_name: string;
  representative_name: string;
  rnc?: string;
  email?: string;
  note?: string;
  phones: CreateCustomerPhoneDto[];
  addresses: CreateCustomerAddressDto[];
}

export interface UpdateCustomerDto {
  business_name: string;
  representative_name: string;
  rnc?: string;
  email?: string;
  note?: string;
}

export interface UpdateCustomerPhoneDto extends CreateCustomerPhoneDto {}
export interface UpdateCustomerAddressDto extends CreateCustomerAddressDto {}
