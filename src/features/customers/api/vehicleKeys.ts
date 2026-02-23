export const vehicleKeys = {
  all: ["nearbyVehicles"] as const,
  nearby: (lat: number, lng: number, radiusKm: number) =>
    [...vehicleKeys.all, lat, lng, radiusKm] as const,
};
