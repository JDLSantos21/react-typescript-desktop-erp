export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params?: any) => [...productKeys.lists(), params] as const,
  detail: (id: string) => [...productKeys.lists(), id] as const,
} as const;
