export const API_ROUTES = {
  ORDERS: {
    APP: "/orders",
    BY_CUSTOMER: (id: string) => `/customers/${id}/orders`,
    CREATE: "/orders",
  },
};
