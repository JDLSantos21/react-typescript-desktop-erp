import { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Sector } from "recharts";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface FuelGaugeProps {
  currentLevel: number;
  capacity: number;
  minLevel: number;
  unit?: string;
}

// Colores del gauge según nivel
const COLORS = {
  normal: "#22c55e",
  warning: "#f59e0b",
  critical: "#ef4444",
  empty: "#f3f4f6",
  needle: "#1f2937",
};

function getStatusColor(percent: number, minPercent: number) {
  if (percent <= minPercent) return COLORS.critical;
  if (percent <= minPercent + 15) return COLORS.warning;
  return COLORS.normal;
}

function getStatusLabel(percent: number, minPercent: number) {
  if (percent <= minPercent) return "Nivel Crítico";
  if (percent <= minPercent + 15) return "Nivel Bajo";
  return "Nivel Normal";
}

export function useGaugeScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1600) setScale(1.4);
      else if (width >= 1400) setScale(1.25);
      else setScale(1.15);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return scale;
}

export default function FuelGauge({
  currentLevel,
  capacity,
  minLevel,
  unit = "gal",
}: FuelGaugeProps) {
  const displayLevelRef = useRef(0);
  const [displayLevel, setDisplayLevel] = useState(0);

  useEffect(() => {
    let startTime: number;
    const duration = 1000; // 1s animation
    let animationFrameId: number;
    const startLevel = displayLevelRef.current;

    // Si ya estamos en el valor, no animar
    if (startLevel === currentLevel && displayLevel === currentLevel) {
      return;
    }

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);

      // easeOutCubic: menos drástico al final que expo
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = startLevel + (currentLevel - startLevel) * easeProgress;

      setDisplayLevel(currentVal);
      displayLevelRef.current = currentVal;

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayLevel(currentLevel);
        displayLevelRef.current = currentLevel;
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [currentLevel]);

  // Manejo de responsive scalation para pantallas mas grandes
  const scale = useGaugeScale();

  const percent = Math.min(Math.round((displayLevel / capacity) * 100), 100);

  const finalPercent = Math.min(
    Math.round((currentLevel / capacity) * 100),
    100,
  );
  const minPercent = Math.round((minLevel / capacity) * 100);

  const color = getStatusColor(finalPercent, minPercent);
  const statusLabel = getStatusLabel(finalPercent, minPercent);

  const data = [{ value: percent }, { value: Math.max(0, 100 - percent) }];

  const W = 240 * scale;
  const H = 140 * scale;
  const cx = W / 2;
  const cy = H - 10 * scale;
  const outerR = 95 * scale;
  const innerR = 65 * scale;

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm w-fit min-w-75">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Estado del Tanque
        </h3>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${color}18`, color }}
        >
          {statusLabel}
        </span>
      </div>

      <div className="relative flex justify-center" style={{ height: H }}>
        <PieChart width={W} height={H}>
          <Pie
            data={data}
            cx={cx}
            cy={cy}
            startAngle={180}
            endAngle={0}
            innerRadius={innerR}
            outerRadius={outerR}
            dataKey="value"
            stroke="none"
            cornerRadius={5}
            isAnimationActive={false}
            shape={(props: any) => (
              <Sector
                {...props}
                fill={props.index === 0 ? color : COLORS.empty}
              />
            )}
          />
        </PieChart>

        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: cy - 45 * scale }}
        >
          <p
            className="text-center font-bold text-gray-800 leading-none"
            style={{ fontSize: `${1.5 * scale}rem` }}
          >
            {percent}%
          </p>
          <p
            className="text-center text-gray-500 mt-1 whitespace-nowrap"
            style={{ fontSize: `${0.75 * Math.max(scale * 0.9, 1)}rem` }}
          >
            {Math.round(displayLevel).toLocaleString()} /{" "}
            {capacity.toLocaleString()} {unit}
          </p>
        </div>
      </div>

      <div className="mt-2 px-1">
        <div className="relative h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-red-400/60"
            style={{ width: `${minPercent}%` }}
          />
          <div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ width: `${percent}%`, backgroundColor: color }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-red-400 font-medium">
            Mín. {minLevel.toLocaleString()} {unit}
          </span>
          <span className="text-[10px] text-gray-400">
            {capacity.toLocaleString()} {unit}
          </span>
        </div>
      </div>
    </div>
  );
}

export function FuelGaugeSkeleton() {
  const scale = useGaugeScale();
  const H = 140 * scale;
  const outerR = 95 * scale;
  const innerR = 65 * scale;
  const cy = H - 10 * scale;

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm w-fit min-w-75">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-4 w-20 rounded-full" />
      </div>

      <div className="relative flex justify-center items-end" style={{ height: H }}>
        <div 
          className="relative overflow-hidden" 
          style={{ 
            width: outerR * 2, 
            height: outerR, 
            borderTopLeftRadius: outerR, 
            borderTopRightRadius: outerR,
            marginBottom: H - cy,
          }}
        >
          <Skeleton className="w-full h-full rounded-none" />
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white"
            style={{ 
              width: innerR * 2, 
              height: innerR, 
              borderTopLeftRadius: innerR, 
              borderTopRightRadius: innerR 
            }}
          />
        </div>

        <div
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
          style={{ top: cy - 45 * scale }}
        >
          <Skeleton className="h-7 w-16 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      <div className="mt-2 px-1">
        <Skeleton className="h-1.5 w-full rounded-full" />
        <div className="flex justify-between mt-1.5">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-2.5 w-16" />
        </div>
      </div>
    </div>
  );
}
