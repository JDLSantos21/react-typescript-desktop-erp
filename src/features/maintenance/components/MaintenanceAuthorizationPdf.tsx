import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { formatLongDate } from "@/shared/utils/formatters";
import type { MaintenanceDetail } from "../types/maintenance";

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingHorizontal: 38,
    paddingBottom: 38,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#182230",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#D0D5DD",
    paddingBottom: 16,
  },
  logo: { width: 72, height: 46, objectFit: "contain" },
  company: { alignItems: "flex-end", maxWidth: 350 },
  companyName: { fontSize: 13, fontFamily: "Helvetica-Bold" },
  companyInfo: { marginTop: 3, color: "#475467", textAlign: "right", lineHeight: 1.45 },
  title: { fontSize: 17, fontFamily: "Helvetica-Bold", marginTop: 24 },
  subtitle: { marginTop: 4, color: "#667085" },
  facts: { flexDirection: "row", flexWrap: "wrap", marginTop: 18, borderTopWidth: 1, borderTopColor: "#EAECF0" },
  fact: { width: "50%", paddingVertical: 10, paddingRight: 14, borderBottomWidth: 1, borderBottomColor: "#EAECF0" },
  label: { color: "#667085", fontSize: 7, textTransform: "uppercase" },
  value: { marginTop: 4, fontFamily: "Helvetica-Bold", fontSize: 9 },
  sectionTitle: { marginTop: 20, fontSize: 10, fontFamily: "Helvetica-Bold" },
  table: { marginTop: 8, borderTopWidth: 1, borderTopColor: "#D0D5DD" },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#EAECF0", paddingVertical: 7 },
  procedure: { width: "72%" },
  category: { width: "28%", color: "#475467" },
  empty: { paddingVertical: 10, color: "#667085" },
  notes: { marginTop: 18, color: "#475467", lineHeight: 1.5 },
  spacer: { flexGrow: 1 },
  signature: { marginTop: 36, width: "48%" },
  signatureSpace: { height: 56 },
  signatureLine: { borderTopWidth: 1, borderTopColor: "#344054", paddingTop: 7 },
  signatureName: { fontFamily: "Helvetica-Bold" },
  signatureLabel: { marginTop: 3, color: "#667085" },
});

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

export function MaintenanceAuthorizationPdf({
  maintenance,
  driverName,
  procedureIds = [],
}: {
  maintenance: MaintenanceDetail;
  driverName: string;
  procedureIds?: number[];
}) {
  const logoUrl =
    typeof window === "undefined"
      ? "/logo.png"
      : `${window.location.origin}/logo.png`;
  const vehicleName = [maintenance.vehicle?.brand, maintenance.vehicle?.model]
    .filter(Boolean)
    .join(" ");
  const authorizer = maintenance.authorizationSignature || "—";
  const procedures = (maintenance.maintenanceItems ?? []).filter((item) =>
    procedureIds.includes(item.procedureId),
  );

  return (
    <Document
      title={`Autorización de mantenimiento · ${maintenance.vehicle?.licensePlate ?? "vehículo"}`}
      author="Agua & Hielo Lily S.R.L"
      subject="Autorización de salida a mantenimiento"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={logoUrl} style={styles.logo} />
          <View style={styles.company}>
            <Text style={styles.companyName}>Agua & Hielo Lily S.R.L</Text>
            <Text style={styles.companyInfo}>
              Av. Hermanas Mirabal #1, Esq. Colonia de los doctores,{"\n"}
              Santo Domingo Norte, Rep. Dom.{"\n"}
              809-568-5757 · 809-568-5657 · RNC: 101-85657-2
            </Text>
          </View>
        </View>

        <Text style={styles.title}>Autorización de salida a mantenimiento</Text>
        <Text style={styles.subtitle}>
          Documento de control para el traslado de la unidad al centro de mantenimiento.
        </Text>

        <View style={styles.facts}>
          <Fact label="Vehículo" value={vehicleName || "—"} />
          <Fact label="Placa" value={maintenance.vehicle?.licensePlate ?? "—"} />
          <Fact label="Fecha programada" value={maintenance.scheduledDate ? formatLongDate(maintenance.scheduledDate) : "—"} />
          <Fact label="Disparador" value={triggerLabels[maintenance.triggerReason ?? "MANUAL"]} />
          <Fact label="Kilometraje" value={maintenance.currentMileage != null ? `${maintenance.currentMileage.toLocaleString("es-DO")} km` : "—"} />
          <Fact label="Conductor" value={driverName} />
        </View>

        {procedures.length ? (
          <>
            <Text style={styles.sectionTitle}>Procedimientos autorizados</Text>
            <View style={styles.table}>
              {procedures.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={styles.procedure}>{item.procedure?.name ?? `Procedimiento #${item.procedureId}`}</Text>
                <Text style={styles.category}>{categoryLabels[item.procedure?.category ?? ""] ?? item.procedure?.category ?? "—"}</Text>
              </View>
              ))}
            </View>
          </>
        ) : null}

        {maintenance.notes ? <Text style={styles.notes}>Observaciones: {maintenance.notes}</Text> : null}

        <View style={styles.spacer} />
        <View style={styles.signature}>
          <View style={styles.signatureSpace} />
          <View style={styles.signatureLine}>
            <Text style={styles.signatureName}>{authorizer}</Text>
            <Text style={styles.signatureLabel}>Usuario que autoriza</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}
