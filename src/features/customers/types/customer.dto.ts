// ============================================
// REQUEST DTOs - Lo que enviamos al backend
// ============================================

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

// ============================================
// RESPONSE DTOs - Lo que recibimos del backend
// ============================================

export interface CustomerPhoneResponse extends CreateCustomerPhoneDto {
  id: string;
  customer_id: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerAddressResponse extends CreateCustomerAddressDto {
  id: string;
  customer_id: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerResponse {
  id: string;
  business_name: string;
  representative_name: string;
  rnc?: string;
  email?: string;
  note?: string;
  phones: CustomerPhoneResponse[];
  addresses: CustomerAddressResponse[];
  created_at: string;
  updated_at: string;
}
