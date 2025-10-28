export interface CreateCustomerAddressDto {
  branch_name?: string;
  direction: string;
  city: string;
  is_primary: boolean;
}

export interface CreateCustomerPhoneDto {
  description: string;
  phone_number: string;
  type: "MOVIL" | "FIJO" | "TRABAJO" | "OTROS";
  has_whatsapp: boolean;
  is_primary: boolean;
}
