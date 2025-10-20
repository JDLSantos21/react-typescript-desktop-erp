import { useGetCustomers } from "../hooks/useCustomer";

export function CustomerPage() {
  const { data: customers, isLoading } = useGetCustomers();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Clientes</h1>
      {customers?.map((customer) => (
        <div key={customer.id}>
          <p>
            {customer.businessName} --- {customer.representativeName}
          </p>
        </div>
      ))}
    </div>
  );
}
