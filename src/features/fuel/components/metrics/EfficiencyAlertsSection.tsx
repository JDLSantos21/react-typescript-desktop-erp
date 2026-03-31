import { AlertIcon, WarningIcon } from "@/shared/components/icons";
import { EfficiencyAlert } from "@/shared/types/entities/fuel.types";
import { ShieldCheck } from "lucide-react";

interface EfficiencyAlertsSectionProps {
  alerts?: EfficiencyAlert[];
}

export default function EfficiencyAlertsSection({
  alerts,
}: EfficiencyAlertsSectionProps) {
  if (!alerts || alerts.length === 0) {
    return (
      <section className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col justify-center items-center h-48">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-text-primary text-lg">
          Flota Eficiente
        </h3>
        <p className="text-sm text-text-secondary mt-1">
          No hay alertas de eficiencia registradas en este período.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col">
      <h3 className="font-bold tracking-wider text-text-secondary text-sm uppercase mb-4">
        Alertas de Eficiencia ({alerts.length})
      </h3>

      <div className="space-y-3">
        {alerts.map((alert, index) => {
          const isCritical = alert.severity === "CRITICAL";

          return (
            <div
              key={`${alert.vehicleId}-${index}`}
              className={`flex items-start gap-4 p-4 rounded-lg border ${
                isCritical
                  ? "bg-red-50/50 border-red-100"
                  : "bg-amber-50/50 border-amber-100"
              }`}
            >
              <div
                className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  isCritical
                    ? "bg-red-100 text-red-600"
                    : "bg-amber-100 text-amber-600"
                }`}
              >
                {isCritical ? (
                  <WarningIcon className="w-5 h-5" />
                ) : (
                  <AlertIcon className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4
                    className={`font-semibold ${
                      isCritical ? "text-red-900" : "text-amber-900"
                    }`}
                  >
                    {alert.vehicleName}
                    <span className="font-normal opacity-75 ml-2 text-sm">
                      ({alert.licensePlate})
                    </span>
                  </h4>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isCritical
                        ? "bg-red-200 text-red-800"
                        : "bg-amber-200 text-amber-800"
                    }`}
                  >
                    {alert.alertType === "HIGH_CONSUMPTION"
                      ? "ALTO CONSUMO"
                      : "PICO DE CONSUMO"}
                  </span>
                </div>

                <p
                  className={`text-sm ${
                    isCritical ? "text-red-800" : "text-amber-800"
                  } mb-2`}
                >
                  {alert.message}
                </p>

                <div className="flex gap-4 mt-2">
                  <div className="flex flex-col">
                    <span
                      className={`text-xs uppercase font-semibold ${
                        isCritical ? "text-red-700" : "text-amber-700"
                      } opacity-80`}
                    >
                      Actual
                    </span>
                    <span
                      className={`font-bold ${
                        isCritical ? "text-red-900" : "text-amber-900"
                      }`}
                    >
                      {alert.currentValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-xs uppercase font-semibold ${
                        isCritical ? "text-red-700" : "text-amber-700"
                      } opacity-80`}
                    >
                      Referencia
                    </span>
                    <span
                      className={`font-bold ${
                        isCritical ? "text-red-900" : "text-amber-900"
                      }`}
                    >
                      {alert.referenceValue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
