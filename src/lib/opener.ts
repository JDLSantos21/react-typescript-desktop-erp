import { Order } from "@/shared/types/entities/order.types";
import { openUrl } from "@tauri-apps/plugin-opener";

export const handleOpenWhatsapp = async (order: Order) => {
  const phoneNumber = order.phone.phoneNumber;
  const text = encodeURIComponent(
    `Hola, sobre su pedido #${order.trackingCode} `,
  );

  try {
    await openUrl(`whatsapp://send?phone=${phoneNumber}&text=${text}`);
  } catch (error) {
    console.warn("No se pudo abrir la app nativa, intentando web...", error);

    await openUrl(`https://wa.me/${phoneNumber}?text=${text}`);
  }
};

export const handleOpenGoogleMaps = async (lat: number, lng: number) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  try {
    await openUrl(googleMapsUrl);
  } catch (error) {
    console.error("Error al abrir Google Maps:", error);
  }
};

export const handleOpenUrl = async (url: string) => {
  try {
    await openUrl(url);
  } catch (error) {
    console.error("Error al abrir la URL:", error);
  }
};
