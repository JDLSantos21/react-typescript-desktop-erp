import { Order } from "@/shared/types/entities/order.types";
import { openUrl } from "@tauri-apps/plugin-opener";

export const handleOpenWhatsapp = async (order: Order) => {
  if (!order.phone) {
    return;
  }

  await handleOpenWhatsappPhone(
    order.phone.phoneNumber,
    `Hola, sobre su pedido #${order.trackingCode} `,
  );
};

export const handleOpenWhatsappPhone = async (
  phoneNumber: string,
  message = "Hola",
) => {
  const normalizedPhoneNumber = phoneNumber.replace(/\D/g, "");
  const text = encodeURIComponent(
    message,
  );

  try {
    await openUrl(`whatsapp://send?phone=${normalizedPhoneNumber}&text=${text}`);
  } catch (error) {
    console.warn("No se pudo abrir la app nativa, intentando web...", error);

    await openUrl(`https://wa.me/${normalizedPhoneNumber}?text=${text}`);
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
