import { useCallback, useState } from "react";
import { printerService } from "@/shared/services/printer.service";
import { Equipment } from "@/shared/types/entities/equipment.types";
import { sileo } from "sileo";
import { EquipmentService } from "../api/equipment.service";

export function usePrintEquipmentLabel(equipment: Equipment | undefined) {
  const [isPrinting, setIsPrinting] = useState(false);
  const printLabel = useCallback((reason?: string) => {
    if (!equipment) return;

    const printPromise = (async () => {
      setIsPrinting(true);
      const authorization = await EquipmentService.authorizeLabelPrint(equipment.id, reason);
      try {
        const res = await printerService.printEquipmentLabel(equipment);
        if (!res.success) throw new Error(res.message);
        await EquipmentService.completeLabelPrint(authorization.data.id, "IMPRESO");
        return res;
      } catch (error) {
        await EquipmentService.completeLabelPrint(authorization.data.id, "FALLIDO").catch(() => undefined);
        throw error;
      } finally {
        setIsPrinting(false);
      }
    })();

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

  return { printLabel, isPrinting };
}
