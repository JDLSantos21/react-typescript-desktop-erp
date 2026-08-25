import { useEffect, useState, type FormEvent } from "react";
import { Download, Printer, UserRound } from "lucide-react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { toast } from "sonner";
import { Button } from "@/shared/components/core/Button";
import { Checkbox } from "@/shared/components/core/Checkbox";
import { Input } from "@/shared/components/core/Input";
import { InputPassword } from "@/shared/components/core/InputPassword";
import { Modal } from "@/shared/components/core/Modal";
import { Select } from "@/shared/components/core/Select";
import SectionLoader from "@/shared/components/SectionLoader";
import { ErrorState } from "@/shared/components/ErrorState";
import { extractApiError } from "@/shared/utils/error-handler";
import { formatDateTime, formatLongDate } from "@/shared/utils/formatters";
import { MaintenanceAuthorizationPdf } from "./MaintenanceAuthorizationPdf";
import type { MaintenanceDetail } from "../types/maintenance";
import {
  useAuthorizeMaintenance,
  useMaintenanceDetail,
  useMaintenanceDrivers,
  useProcessMaintenance,
} from "../hooks/useMaintenance";

interface Props {
  maintenanceId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const triggerLabels = {
  MANUAL: "Generado manualmente",
  TIME: "Tiempo alcanzado",
  MILEAGE: "Kilometraje alcanzado",
  TIME_AND_MILEAGE: "Tiempo y kilometraje alcanzados",
} as const;

const categoryLabels: Record<string, string> = {
  MOTOR: "Motor",
  DIFERENCIAL: "Diferencial",
  FRENOS: "Frenos",
  FILTROS: "Filtros",
  ACEITE: "Aceite",
  LLANTAS: "Llantas y neumáticos",
  ELECTRICO: "Eléctrico",
  CARROCERIA: "Carrocería",
  PREVENTIVO: "Preventivo",
};

export function MaintenanceDetailModal({ maintenanceId, isOpen, onClose }: Props) {
  const detail = useMaintenanceDetail(isOpen ? maintenanceId ?? undefined : undefined);
  const drivers = useMaintenanceDrivers();
  const authorize = useAuthorizeMaintenance();
  const process = useProcessMaintenance();
  const maintenance = detail.data?.data;
  const [driverId, setDriverId] = useState("");
  const [performedBy, setPerformedBy] = useState("");
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isAuthorizationOpen, setIsAuthorizationOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);
  const [isPdfProcedureOpen, setIsPdfProcedureOpen] = useState(false);
  const [pdfProcedureIds, setPdfProcedureIds] = useState<number[]>([]);

  useEffect(() => {
    if (!maintenance) return;
    setDriverId(maintenance.driverId ?? "");
    setPerformedBy(maintenance.performedBy ?? "");
    setCompleted(
      Object.fromEntries(
        (maintenance.maintenanceItems ?? []).map((item) => [
          item.procedureId,
          item.isCompleted,
        ]),
      ),
    );
  }, [maintenance]);

  useEffect(() => {
    setPdfProcedureIds([]);
  }, [maintenanceId]);

  const procedures = maintenance?.maintenanceItems ?? [];
  const selectedDriver = (drivers.data?.data ?? []).find(
    (driver) => driver.id === driverId,
  );
  const isAuthorized = Boolean(maintenance?.authorizedAt);
  const isClosed = maintenance?.status === "COMPLETADO" || maintenance?.status === "CANCELADO";
  const hasSelectedProcedures = procedures.some(
    (item) => completed[item.procedureId],
  );

  const confirmAuthorization = async (password: string) => {
    if (!maintenance) return;
    try {
      await authorize.mutateAsync({
        id: maintenance.id,
        data: { driverId: driverId || null, password },
      });
      setIsPasswordOpen(false);
      toast.success("Salida a mantenimiento autorizada");
    } catch (error) {
      toast.error(extractApiError(error).message);
    }
  };

  const saveWork = async (completeMaintenance = false) => {
    if (!maintenance) return;
    const selectedProcedures = procedures
      .filter((item) => completed[item.procedureId])
      .map((item) => ({ procedureId: item.procedureId, isCompleted: true }));
    if (!selectedProcedures.length) {
      toast.error("Marca al menos un procedimiento realizado.");
      return;
    }

    try {
      await process.mutateAsync({
        maintenanceId: maintenance.id,
        performedDate: new Date().toISOString(),
        completeMaintenance,
        performedBy: performedBy || undefined,
        completedProcedures: selectedProcedures,
      });
      setIsCompletionOpen(false);
      toast.success(
        completeMaintenance
          ? "Mantenimiento completado"
          : "Progreso del mantenimiento guardado",
      );
    } catch (error) {
      toast.error(extractApiError(error).message);
    }
  };

  const driverName = selectedDriver
    ? `${selectedDriver.name} ${selectedDriver.lastName}`
    : maintenance?.driver
      ? `${maintenance.driver.name} ${maintenance.driver.lastName}`
      : "Sin conductor asignado";

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Detalle de mantenimiento" size="xl">
        <Modal.Body>
          {detail.isLoading ? (
            <SectionLoader placeholder="Cargando mantenimiento" />
          ) : detail.isError ? (
            <ErrorState
              title="No se pudo cargar el mantenimiento"
              error={detail.error}
              onRetry={detail.refetch}
            />
          ) : !maintenance ? (
            <SectionLoader placeholder="Cargando mantenimiento" />
          ) : (
            <div className="space-y-7">
              <section className="grid gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
                <Fact label="Vehículo" value={maintenance.vehicle ? `${maintenance.vehicle.licensePlate} · ${maintenance.vehicle.brand}` : "—"} />
                <Fact label="Disparador" value={triggerLabels[maintenance.triggerReason ?? "MANUAL"]} />
                <Fact label="Programado" value={maintenance.scheduledDate ? formatLongDate(maintenance.scheduledDate) : "—"} />
                <Fact label="Último mantenimiento" value={maintenance.lastCompletedMaintenance?.performedDate ? formatDateTime(maintenance.lastCompletedMaintenance.performedDate) : "Sin registro previo"} />
                {maintenance.notes ? (
                  <div className="border-t border-gray-200 pt-4 sm:col-span-2 lg:col-span-4">
                    <p className="text-xs font-medium text-text-muted">Observaciones</p>
                    <p className="mt-1 text-sm text-text-secondary">{maintenance.notes}</p>
                  </div>
                ) : null}
              </section>

              <section>
                <h3 className="text-sm font-semibold text-text-primary">Autorización de salida</h3>
                <p className="mt-1 text-sm text-text-secondary">Confirma tu contraseña para autorizar la salida de la unidad.</p>
                <div className="mt-4 max-w-md">
                  <Select
                    label="Conductor"
                    placeholder="Sin conductor asignado"
                    value={driverId}
                    onValueChange={setDriverId}
                    options={(drivers.data?.data ?? []).map((driver) => ({
                      value: driver.id,
                      label: `${driver.name} ${driver.lastName}`,
                    }))}
                  />
                </div>
              </section>

              <section className="border-t border-border pt-6">
                <h3 className="text-sm font-semibold text-text-primary">Procedimientos realizados</h3>
                <p className="mt-1 text-sm text-text-secondary">Marca los procedimientos realizados. Puedes guardar el progreso y completar el trabajo cuando esté listo.</p>
                {procedures.length === 0 ? (
                  <p className="mt-4 border-y border-border py-5 text-sm text-text-muted">
                    No hay procedimientos activos configurados para este mantenimiento.
                  </p>
                ) : (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {procedures.map((item) => (
                      <div key={item.id} className="min-w-0 border border-border bg-white px-3 py-3">
                        <Checkbox
                          label={item.procedure?.name ?? `Procedimiento #${item.procedureId}`}
                          checked={Boolean(completed[item.procedureId])}
                          onChange={(event) =>
                            setCompleted((state) => ({
                              ...state,
                              [item.procedureId]: event.target.checked,
                            }))
                          }
                          disabled={!isAuthorized || isClosed || item.isCompleted}
                        />
                        <p className="mt-1 pl-6 text-xs text-text-muted">
                          {categoryLabels[item.procedure?.category ?? ""] ?? item.procedure?.category}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-5 max-w-md">
                  <Input
                    label="Técnico / taller responsable"
                    value={performedBy}
                    onChange={(event) => setPerformedBy(event.target.value)}
                    placeholder="Opcional"
                    disabled={!isAuthorized || isClosed}
                  />
                </div>
              </section>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={onClose} disabled={process.isPending || authorize.isPending}>
            Cerrar
          </Button>
          {maintenance && !isClosed ? (
            <Button icon={UserRound} onClick={() => setIsPasswordOpen(true)} disabled={authorize.isPending}>
              {isAuthorized ? "Actualizar autorización" : "Autorizar salida"}
            </Button>
          ) : null}
          {maintenance && isAuthorized ? (
            <>
              <Button variant="outline" onClick={() => setIsPdfProcedureOpen(true)}>
                Establecer procedimientos del PDF
              </Button>
              <Button variant="outline" icon={Printer} onClick={() => setIsAuthorizationOpen(true)}>
                Imprimir autorización
              </Button>
            </>
          ) : null}
          {maintenance && isAuthorized && !isClosed ? (
            <>
              <Button variant="outline" onClick={() => saveWork()} isLoading={process.isPending} disabled={!hasSelectedProcedures}>
                Guardar progreso
              </Button>
              <Button onClick={() => setIsCompletionOpen(true)} disabled={!hasSelectedProcedures || process.isPending}>
                Completar mantenimiento
              </Button>
            </>
          ) : null}
        </Modal.Footer>
      </Modal>

      <AuthorizationPasswordModal
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
        onConfirm={confirmAuthorization}
        isLoading={authorize.isPending}
      />

      {maintenance ? (
        <MaintenanceAuthorizationModal
          isOpen={isAuthorizationOpen}
          onClose={() => setIsAuthorizationOpen(false)}
          maintenance={maintenance}
          driverName={driverName}
          procedureIds={pdfProcedureIds}
        />
      ) : null}

      {maintenance ? (
        <PdfProcedureSelectionModal
          isOpen={isPdfProcedureOpen}
          onClose={() => setIsPdfProcedureOpen(false)}
          procedures={procedures}
          selectedIds={pdfProcedureIds}
          onSave={setPdfProcedureIds}
        />
      ) : null}

      <CompletionConfirmationModal
        isOpen={isCompletionOpen}
        onClose={() => setIsCompletionOpen(false)}
        onConfirm={() => saveWork(true)}
        isLoading={process.isPending}
        completedCount={procedures.filter((item) => completed[item.procedureId]).length}
      />
    </>
  );
}

function AuthorizationPasswordModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
  isLoading: boolean;
}) {
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isOpen) setPassword("");
  }, [isOpen]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password) return;
    await onConfirm(password);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar autorización"
      size="sm"
      closeOnOverlayClick={!isLoading}
    >
      <Modal.Body>
        <form id="maintenance-authorization-form" onSubmit={submit} className="space-y-4">
          <p className="text-sm text-text-secondary">
            Ingresa tu contraseña para registrar la autorización. Solo un supervisor o un rol superior puede confirmarla.
          </p>
          <InputPassword
            label="Contraseña"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            autoFocus
          />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          type="submit"
          form="maintenance-authorization-form"
          icon={UserRound}
          isLoading={isLoading}
          disabled={!password}
        >
          Confirmar autorización
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function MaintenanceAuthorizationModal({
  isOpen,
  onClose,
  maintenance,
  driverName,
  procedureIds,
}: {
  isOpen: boolean;
  onClose: () => void;
  maintenance: MaintenanceDetail;
  driverName: string;
  procedureIds: number[];
}) {
  const fileName = `autorizacion-mantenimiento-${maintenance.vehicle?.licensePlate ?? maintenance.id}.pdf`;
  const document = <MaintenanceAuthorizationPdf maintenance={maintenance} driverName={driverName} procedureIds={procedureIds} />;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Autorización de salida" size="xl">
      <Modal.Body className="h-[68vh] bg-slate-100 p-0">
        <PDFViewer width="100%" height="100%" showToolbar>
          {document}
        </PDFViewer>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
        <PDFDownloadLink
          document={document}
          fileName={fileName}
          className="flex h-10 items-center justify-center gap-2 rounded-sm border border-primary bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          {({ loading }) => <><Download className="h-4 w-4" />{loading ? "Generando PDF" : "Descargar PDF"}</>}
        </PDFDownloadLink>
      </Modal.Footer>
    </Modal>
  );
}

function PdfProcedureSelectionModal({
  isOpen,
  onClose,
  procedures,
  selectedIds,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  procedures: NonNullable<MaintenanceDetail["maintenanceItems"]>;
  selectedIds: number[];
  onSave: (ids: number[]) => void;
}) {
  const [draftIds, setDraftIds] = useState<number[]>(selectedIds);

  useEffect(() => {
    if (isOpen) setDraftIds(selectedIds);
  }, [isOpen, selectedIds]);

  const toggleProcedure = (procedureId: number, checked: boolean) => {
    setDraftIds((ids) =>
      checked
        ? [...new Set([...ids, procedureId])]
        : ids.filter((id) => id !== procedureId),
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Procedimientos para la autorización" size="lg">
      <Modal.Body>
        <p className="text-sm text-text-secondary">
          Selecciona solo los procedimientos que deseas mostrar en la hoja de autorización. Esta selección no cambia el avance del mantenimiento.
        </p>
        {procedures.length ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {procedures.map((item) => (
              <div key={item.id} className="min-w-0 border border-border bg-white px-3 py-3">
                <Checkbox
                  label={item.procedure?.name ?? `Procedimiento #${item.procedureId}`}
                  checked={draftIds.includes(item.procedureId)}
                  onChange={(event) => toggleProcedure(item.procedureId, event.target.checked)}
                />
                <p className="mt-1 pl-6 text-xs text-text-muted">
                  {categoryLabels[item.procedure?.category ?? ""] ?? item.procedure?.category}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm text-text-muted">No hay procedimientos configurados para este mantenimiento.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={() => { onSave(draftIds); onClose(); }}>
          Aplicar selección
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function CompletionConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  completedCount,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  completedCount: number;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Completar mantenimiento" size="sm" closeOnOverlayClick={!isLoading}>
      <Modal.Body>
        <p className="text-sm text-text-secondary">
          Se cerrará este mantenimiento con {completedCount} procedimiento{completedCount === 1 ? "" : "s"} marcado{completedCount === 1 ? "" : "s"} como realizado{completedCount === 1 ? "" : "s"}. Los demás procedimientos no necesitan marcarse.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancelar</Button>
        <Button onClick={onConfirm} isLoading={isLoading}>Completar mantenimiento</Button>
      </Modal.Footer>
    </Modal>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs text-text-muted">{label}</p><p className="mt-1 text-sm font-semibold text-text-primary">{value}</p></div>;
}
