import { TrendingUp } from "lucide-react";

interface FuelImpactCardProps {
  previousLevel: number;
  newLevel: number;
  increment: number;
  capacity: number;
}

export function FuelImpactCard({
  previousLevel,
  newLevel,
  increment,
  capacity,
}: FuelImpactCardProps) {
  const previousPercentage = Math.min((previousLevel / capacity) * 100, 100);
  const newPercentage = Math.min((newLevel / capacity) * 100, 100);
  const incrementPercentage = Math.max(0, newPercentage - previousPercentage);

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Impacto en el tanque
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
        {/* Left Section - Data */}
        <div className="flex-1 w-full">
          <div className="flex items-center gap-6 mb-6">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 mb-1 tracking-wider uppercase">
                Nivel anterior
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-800">
                  {previousLevel.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-gray-400">
                  Gal.
                </span>
              </div>
            </div>

            <div className="bg-blue-50 p-2.5 rounded-xl shrink-0 mt-2">
              <TrendingUp className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
            </div>

            <div>
              <p className="text-[10px] font-semibold text-gray-400 mb-1 tracking-wider uppercase">
                Nuevo nivel
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-blue-600">
                  {newLevel.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-gray-400">
                  Gal.
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-semibold text-gray-400 tracking-wider">
              <span className="uppercase">
                Capacidad Actual: {newPercentage.toFixed(1)}%
              </span>
              <span className="uppercase">
                Capacidad Total: {capacity.toLocaleString()} Gal.
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-4 w-full bg-slate-100 rounded-full flex overflow-hidden">
              <div
                className="bg-slate-300 h-full transition-all duration-1000 ease-in-out"
                style={{ width: `${previousPercentage}%` }}
              />
              <div
                className="bg-blue-600 h-full transition-all duration-1000 ease-in-out border-l border-white/20"
                style={{ width: `${incrementPercentage}%` }}
              />
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="text-[11px] font-medium text-gray-500">
                  Anterior
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="text-[11px] font-medium text-gray-500">
                  Incremento (+{increment.toLocaleString()})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Tank Visual */}
        <div className="w-48 shrink-0 flex justify-center py-2">
          <div className="relative w-36 h-48 border-[3px] border-slate-200 rounded-t-3xl rounded-b overflow-hidden bg-white shadow-sm">
            {/* Empty space lines */}
            <div className="absolute top-8 left-4 right-4 border-b border-gray-200" />
            <div className="absolute top-1/2 left-4 right-4 border-b border-gray-200" />

            {/* Fill Level */}
            <div
              className="absolute bottom-0 left-0 right-0 bg-blue-600 transition-all duration-1000 ease-in-out flex items-center justify-center overflow-hidden"
              style={{ height: `${newPercentage}%` }}
            >
              {/* Inner lines in filled space container */}
              <div
                className="absolute top-0 bottom-0 left-0 w-full"
                style={{
                  height: "12rem",
                  transform: `translateY(-${100 - newPercentage}%)`,
                }}
              >
                <div className="absolute top-8 left-4 right-4 border-b border-blue-500" />
                <div className="absolute top-1/2 left-4 right-4 border-b border-blue-500" />
              </div>

              <span className="text-white text-xl font-bold tracking-tight z-10">
                {newPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
