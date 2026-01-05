export const EquipmentKeys = {
  all: ["equipments"] as const,
  lists: () => [...EquipmentKeys.all, "list"] as const,
  list: (params?: any) => [...EquipmentKeys.lists(), params] as const,
  details: () => [...EquipmentKeys.all, "detail"] as const,
  detail: (id: string) => [...EquipmentKeys.details(), id] as const,
  models: () => [...EquipmentKeys.all, "models"] as const,
  alerts: () => [...EquipmentKeys.all, "alerts"] as const,
  alert: (params?: any) => [...EquipmentKeys.alerts(), params] as const,
};
