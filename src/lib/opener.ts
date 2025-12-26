import { Order } from "@/shared/types/entities/order.types";
import { openUrl } from "@tauri-apps/plugin-opener";

export const handleOpenWhatsapp = async (order: Order) => {
  const phoneNumber = order.phone.phoneNumber;
  const text = encodeURIComponent(
    `Hola, sobre su pedido #${order.trackingCode}...`
  );

  try {
    await openUrl(`whatsapp://send?phone=${phoneNumber}&text=${text}`);
  } catch (error) {
    console.warn("No se pudo abrir la app nativa, intentando web...", error);

    await openUrl(`https://wa.me/${phoneNumber}?text=${text}`);
  }
};
