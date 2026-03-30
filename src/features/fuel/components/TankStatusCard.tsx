import { useEffect, useState } from "react";
import { FuelTank } from "@/shared/types/entities/fuel.types";
import { FuelTankIcon } from "@/shared/components/icons";
import { Button } from "@/shared/components/core/Button";
import { getFuelLevelColor } from "@/shared/utils/fuel.utils";

interface TankStatusCardProps {
  tank: FuelTank;
  isModalOpen: boolean;
  onResetClick: () => void;
}

export default function TankStatusCard({
  tank,
  isModalOpen,
  onResetClick,
}: TankStatusCardProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  const percentage =
    tank.capacity > 0 ? (tank.currentLevel / tank.capacity) * 100 : 0;

  const availableSpace = tank.capacity - tank.currentLevel;

  // Animación: reinicia a 0 y luego anima al porcentaje real
  useEffect(() => {
    if (!isModalOpen) {
      setAnimatedPercentage(0);
      return;
    }

    setAnimatedPercentage(0);
    const timer = setTimeout(() => setAnimatedPercentage(percentage), 100);
    return () => clearTimeout(timer);
  }, [isModalOpen, percentage]);

  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 space-y-4">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FuelTankIcon className="w-5 h-5 text-text-secondary" />
          <span className="text-sm font-semibold text-text-secondary tracking-wide uppercase">
            Estado del tanque
          </span>
        </div>
        <Button variant="link" size="xs" onClick={onResetClick}>
          Reiniciar tanque
        </Button>
      </div>

      {/* Barra de progreso */}
      <div>
        <div className="flex justify-between items-baseline mb-1.5">
          <span className="text-2xl font-bold text-text-primary tracking-tight">
            {percentage.toFixed(1)}%
          </span>
          <span className="text-xs text-text-secondary">
            {tank.currentLevel.toLocaleString()} /{" "}
            {tank.capacity.toLocaleString()} gal
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full ${getFuelLevelColor(percentage)}`}
            style={{
              width: `${animatedPercentage}%`,
              transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-xs text-text-secondary mb-0.5">Nivel actual</p>
          <p className="text-sm font-semibold text-text-primary">
            {tank.currentLevel.toLocaleString()} gal
          </p>
        </div>
        <div className="text-center border-x border-gray-200">
          <p className="text-xs text-text-secondary mb-0.5">Capacidad</p>
          <p className="text-sm font-semibold text-text-primary">
            {tank.capacity.toLocaleString()} gal
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-text-secondary mb-0.5">
            Espacio disponible
          </p>
          <p className="text-sm font-semibold text-emerald-600">
            {availableSpace.toLocaleString()} gal
          </p>
        </div>
      </div>
    </div>
  );
}
