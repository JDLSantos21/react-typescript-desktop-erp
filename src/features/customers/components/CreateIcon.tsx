import { divIcon } from "leaflet";
import { renderToString } from "react-dom/server";

export const createIcon = (
  IconComponent: any,
  color: string,
  label?: string
) => {
  return divIcon({
    html: renderToString(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "28px",
            height: "28px",
            backgroundColor: color,
            borderRadius: "50%",
            border: "2px solid white",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          <IconComponent size={16} color="white" strokeWidth={1} />
        </div>
        {label && (
          <div
            style={{
              backgroundColor: "white",
              padding: "3px 8px",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: "600",
              color: "#1f2937",
              boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
              whiteSpace: "nowrap",
              border: "1px solid #e5e7eb",
            }}
          >
            {label}
          </div>
        )}
      </div>
    ),
    className: "",
    iconSize: label ? [120, 60] : [28, 28],
    iconAnchor: label ? [60, 32] : [14, 14],
  });
};
