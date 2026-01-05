import { useNavigate, useParams } from "react-router-dom";
import { useFindEquipmentById } from "../hooks/useEquipments";
import { ErrorState, FeatureErrorBoundary } from "@/shared/components";
import SectionLoader from "@/shared/components/SectionLoader";
import { formatDate } from "@/shared/utils";
import { useHeaderConfig, useModal } from "@/shared/hooks";
import { useMemo, useState } from "react";
import { Badge, Button } from "@/shared/components";
import { motion } from "motion/react";
import {
  EquipmentStatus,
  EquipmentAssignment,
} from "@/features/equipments/types/equipment.types";
import AssignEquipmentModal from "../components/AssignEquipmentModal";
import UnassignEquipmentModal from "../components/UnassignEquipmentModal";

// Sub-componente para Info Cards
const InfoCard = ({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string | React.ReactNode;
  subtext?: string;
}) => (
  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
      {label}
    </p>
    <div className="text-slate-900 font-semibold text-sm">{value}</div>
    {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
  </div>
);

export default function EquipmentDetailPage() {
  const { equipmentId } = useParams();
  const navigate = useNavigate();
  const [selectedAssignment, setSelectedAssignment] = useState<
    EquipmentAssignment | undefined
  >();

  const { data, isLoading, error, refetch, isError } = useFindEquipmentById(
    equipmentId ?? ""
  );
  const assignModal = useModal();
  const unassignModal = useModal();

  const getStatusConfig = (status: EquipmentStatus) => {
    const config = {
      DISPONIBLE: {
        variant: "success",
        label: "Disponible",
        bg: "bg-emerald-100 text-emerald-700",
      },
      ASIGNADO: {
        variant: "primary",
        label: "Asignado",
        bg: "bg-blue-100 text-blue-700",
      },
      MANTENIMIENTO: {
        variant: "warning",
        label: "Mantenimiento",
        bg: "bg-amber-100 text-amber-700",
      },
      DAÑADO: {
        variant: "danger",
        label: "Dañado",
        bg: "bg-rose-100 text-rose-700",
      },
      INHABILITADO: {
        variant: "secondary",
        label: "Inhabilitado",
        bg: "bg-slate-100 text-slate-600",
      },
    };
    return config[status] || config.DISPONIBLE;
  };

  const headerConfig = useMemo(
    () => ({
      title: "",
      showBackButton: true,
      customContent: data?.data ? (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {data.data.serialNumber}
              </h2>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  getStatusConfig(data.data.status).bg
                }`}
              >
                {getStatusConfig(data.data.status).label}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {data.data.model.name} • Registrado el{" "}
              {formatDate(data.data.createdAt)}
            </p>
          </div>

          {data.data.status === "DISPONIBLE" && (
            <div className="sm:ml-auto">
              <Button
                onClick={assignModal.open}
                className="rounded-xl bg-slate-900 shadow-lg shadow-slate-200 hover:bg-slate-800 text-white"
              >
                Asignar a Cliente
              </Button>
            </div>
          )}
        </div>
      ) : undefined,
    }),
    [data?.data, navigate]
  );

  useHeaderConfig(headerConfig);

  if (isLoading)
    return (
      <SectionLoader className="h-full" placeholder="Cargando detalles..." />
    );
  if (isError || !equipmentId)
    return (
      <ErrorState
        title="Error"
        message="No se pudo cargar el equipo"
        onRetry={refetch}
      />
    );

  const equipment = data!.data;

  return (
    <div className="h-full bg-white overflow-y-auto custom-scrollbar">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto p-6 md:p-8 space-y-8"
      >
        {/* Sección: Detalles Técnicos (Grid) */}
        <section>
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Especificaciones
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoCard
              label="Modelo"
              value={equipment.model.name}
              subtext={equipment.model.type}
            />
            <InfoCard label="Marca" value={equipment.model.brand || "N/A"} />
            <InfoCard
              label="Capacidad"
              value={equipment.model.capacity || "N/A"}
            />
            <InfoCard label="ID Sistema" value={`#${equipment.id}`} />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda: Historial (Timeline Style) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Historial de Asignaciones
              </h3>
            </div>

            <FeatureErrorBoundary featureName="Historial">
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {equipment.assignments?.length > 0 ? (
                  equipment.assignments.map((assignment) => (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      key={assignment.id}
                      className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                    >
                      {/* Icono Timeline */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-1">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            assignment.status === "ACTIVO"
                              ? "bg-blue-500 animate-pulse"
                              : "bg-slate-300"
                          }`}
                        />
                      </div>

                      {/* Card */}
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <Badge
                            size="sm"
                            variant={
                              assignment.status === "ACTIVO"
                                ? "success"
                                : "secondary"
                            }
                          >
                            {assignment.status}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            #{assignment.id}
                          </span>
                        </div>

                        <div className="text-sm space-y-1 text-slate-600">
                          <p>
                            <span className="font-medium text-slate-900">
                              Asignado:
                            </span>{" "}
                            {formatDate(assignment.assignedAt)}
                          </p>
                          {assignment.unassignedAt && (
                            <p>
                              <span className="font-medium text-slate-900">
                                Retirado:
                              </span>{" "}
                              {formatDate(assignment.unassignedAt)}
                            </p>
                          )}
                          {assignment.notes && (
                            <p className="italic text-slate-500 bg-slate-50 p-2 rounded-lg mt-2 text-xs">
                              "{assignment.notes}"
                            </p>
                          )}
                        </div>

                        {assignment.status === "ACTIVO" && (
                          <div className="mt-3 pt-3 border-t border-slate-50 flex justify-end">
                            <Button
                              size="sm"
                              variant="danger"
                              className="text-xs h-8"
                              onClick={() => {
                                setSelectedAssignment(assignment);
                                unassignModal.open();
                              }}
                            >
                              Terminar Asignación
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="pl-12 py-8 text-slate-400 italic">
                    No hay historial disponible.
                  </div>
                )}
              </div>
            </FeatureErrorBoundary>
          </div>

          {/* Columna Derecha: Ubicaciones / Datos Extra */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Rastreo GPS</h3>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 h-fit">
              {equipment.locations?.length > 0 ? (
                <div className="space-y-4">
                  {equipment.locations.map((loc, i) => (
                    <div
                      key={loc.id}
                      className="flex gap-3 relative pb-4 last:pb-0 border-l border-slate-200 ml-2 pl-4 last:border-0"
                    >
                      <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-slate-50" />
                      <div>
                        <p className="text-xs text-slate-400 font-mono mb-1">
                          {formatDate(loc.createdAt)}
                        </p>
                        <p className="text-sm text-slate-700 font-medium">
                          {loc.address || "Dirección no registrada"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 font-mono">
                          {loc.coordinates.latitude},{" "}
                          {loc.coordinates.longitude}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Sin ubicaciones registradas
                </div>
              )}
            </div>
          </div>
        </div>

        <AssignEquipmentModal
          equipmentId={equipmentId!}
          isOpen={assignModal.isOpen}
          onClose={assignModal.close}
        />

        {selectedAssignment && (
          <UnassignEquipmentModal
            assignment={selectedAssignment}
            isOpen={unassignModal.isOpen}
            onClose={() => {
              setSelectedAssignment(undefined);
              unassignModal.close();
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
