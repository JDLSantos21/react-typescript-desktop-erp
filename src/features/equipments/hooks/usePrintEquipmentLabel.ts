import { useCallback } from "react";
import { printerService } from "@/shared/services/printer.service";
import { Equipment } from "@/shared/types/entities/equipment.types";
import { sileo } from "sileo";

export function usePrintEquipmentLabel(equipment: Equipment | undefined) {
  const printLabel = useCallback(() => {
    if (!equipment) return;

    const printPromise = printerService
      .printEquipmentLabel(equipment)
      .then((res) => {
        if (!res.success) throw new Error(res.message);
        return res;
      });

    sileo.promise(printPromise, {
      loading: { title: "Enviando impresión..." },
      success: {
        title: "Impresión enviada",
        description: "La etiqueta ha sido enviada a la impresora",
      },
      error: (err) => ({
        title: "Error al enviar impresión",
        description:
          err instanceof Error ? err.message : "No se pudo enviar la impresión",
      }),
    });
  }, [equipment]);

  return { printLabel };
}
