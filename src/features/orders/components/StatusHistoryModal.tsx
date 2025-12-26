import { Badge, Modal } from "@/shared/components";
import { useGetOrderStatusHistory } from "../hooks/useOrder";
import SectionLoader from "@/shared/components/SectionLoader";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { cn } from "@/lib/utils";
import { UserIcon } from "@/shared/components/icons";
import { getStatusColor, getStatusDotColor } from "@/shared/utils";

interface StatusHistoryModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function StatusHistoryModal({
  orderId,
  isOpen,
  onClose,
}: StatusHistoryModalProps) {
  const { isLoading, data, isError } = useGetOrderStatusHistory(
    orderId,
    isOpen
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Historial de estados">
      <div className="p-6 max-h-[600px] overflow-y-auto">
        {isLoading && <SectionLoader placeholder="Cargando Historial" />}
        {isError && (
          <div className="flex flex-col items-center justify-center py-8 text-red-500">
            <p>Error al cargar el historial.</p>
          </div>
        )}
        {data && (
          <>
            {data.data.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No hay historial de estados para este pedido.</p>
              </div>
            ) : (
              <div className="relative pl-4 border-l-2 border-gray-100 space-y-8 ml-2 my-2">
                {data.data.map((statusField, index) => (
                  <div key={index} className="relative">
                    {/* Dot on the timeline */}
                    <div
                      className={cn(
                        "absolute -left-[22.5px] top-1.5 h-3 w-3 rounded-full ring-4 ring-white",
                        getStatusDotColor(statusField.status)
                      )}
                    />

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <Badge
                          size="sm"
                          className={cn(
                            "border tracking-wide uppercase",
                            getStatusColor(statusField.status)
                          )}
                        >
                          {statusField.status}
                        </Badge>
                        <span className="text-xs text-gray-400 font-medium">
                          {dayjs(statusField.changedAt)
                            .locale("es")
                            .format("D MMM YYYY, h:mm A")}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 leading-relaxed">
                        {statusField.description || "Sin descripción"}
                      </p>

                      <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                        <UserIcon className="w-3.5 h-3.5" />
                        <span className="font-medium">
                          {statusField.changedBy.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
