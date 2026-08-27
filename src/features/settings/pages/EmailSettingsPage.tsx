import { useEffect, useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import { sileo } from "sileo";
import { useEmailSettings, useUpdateEmailSettings } from "@/features/email/hooks/useEmail";
import { ErrorState } from "@/shared/components/ErrorState";
import SectionLoader from "@/shared/components/SectionLoader";
import { Button } from "@/shared/components/core/Button";
import { Checkbox } from "@/shared/components/core/Checkbox";
import { Input } from "@/shared/components/core/Input";
import { extractApiError } from "@/shared/utils/error-handler";
import { SettingsPageHeader } from "../components/SettingsPageHeader";

type EmailSettingsDraft = {
  orderCreatedEmailEnabled: boolean;
  fromName: string;
  fromEmail: string;
  replyToEmail: string;
  publicApiUrl: string;
};

const emptyDraft: EmailSettingsDraft = {
  orderCreatedEmailEnabled: true,
  fromName: "",
  fromEmail: "",
  replyToEmail: "",
  publicApiUrl: "",
};

export default function EmailSettingsPage() {
  const settings = useEmailSettings();
  const update = useUpdateEmailSettings();
  const [draft, setDraft] = useState<EmailSettingsDraft>(emptyDraft);

  useEffect(() => {
    const value = settings.data?.data;
    if (!value) return;
    setDraft({
      orderCreatedEmailEnabled: value.orderCreatedEmailEnabled,
      fromName: value.fromName ?? "",
      fromEmail: value.fromEmail ?? "",
      replyToEmail: value.replyToEmail ?? "",
      publicApiUrl: value.publicApiUrl ?? "",
    });
  }, [settings.data]);

  const setField = <K extends keyof EmailSettingsDraft>(field: K, value: EmailSettingsDraft[K]) =>
    setDraft((current) => ({ ...current, [field]: value }));

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await update.mutateAsync({
        orderCreatedEmailEnabled: draft.orderCreatedEmailEnabled,
        fromName: draft.fromName.trim() || undefined,
        fromEmail: draft.fromEmail.trim() || undefined,
        replyToEmail: draft.replyToEmail.trim() || undefined,
        publicApiUrl: draft.publicApiUrl.trim() || undefined,
      });
      sileo.success({ title: "Configuración de correo guardada" });
    } catch (error) {
      sileo.error({
        title: "No se pudo guardar la configuración",
        description: extractApiError(error).message,
      });
    }
  };

  return (
    <>
      <SettingsPageHeader
        title="Correo electrónico"
        description="Notificaciones de pedidos y datos de envío para el cliente"
        actions={
          <Button type="submit" form="email-settings-form" size="sm" icon={Save} isLoading={update.isPending}>
            Guardar cambios
          </Button>
        }
      />
      <div className="p-8">
        <div className="max-w-3xl">
          {settings.isLoading ? (
            <SectionLoader placeholder="Cargando configuración de correo" />
          ) : settings.isError ? (
            <ErrorState title="No se pudo cargar la configuración" error={settings.error} onRetry={settings.refetch} />
          ) : (
            <form id="email-settings-form" onSubmit={save} className="space-y-8">
              <section className="border-b border-slate-200 pb-7">
                <h2 className="text-sm font-semibold text-slate-900">Notificación automática</h2>
                <p className="mt-1 text-sm text-slate-500">El usuario puede desmarcarla al crear un pedido; también respeta la preferencia individual de cada cliente.</p>
                <div className="mt-4">
                  <Checkbox
                    checked={draft.orderCreatedEmailEnabled}
                    onChange={(event) => setField("orderCreatedEmailEnabled", event.target.checked)}
                    label="Activar el envío automático al crear pedidos"
                  />
                </div>
              </section>

              <section className="border-b border-slate-200 pb-7">
                <h2 className="text-sm font-semibold text-slate-900">Remitente</h2>
                <p className="mt-1 text-sm text-slate-500">Usa una dirección de un dominio verificado en Resend.</p>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <Input label="Nombre del remitente" value={draft.fromName} placeholder="Agua & Hielo Lily" onChange={(event) => setField("fromName", event.target.value)} />
                  <Input label="Correo del remitente" type="email" value={draft.fromEmail} placeholder="pedidos@tudominio.com" onChange={(event) => setField("fromEmail", event.target.value)} />
                  <div className="sm:col-span-2">
                    <Input label="Responder a" type="email" value={draft.replyToEmail} placeholder="servicio@tudominio.com" onChange={(event) => setField("replyToEmail", event.target.value)} />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-slate-900">Enlaces públicos</h2>
                <p className="mt-1 text-sm text-slate-500">Esta URL permite que el cliente use el enlace para darse de baja desde el correo.</p>
                <div className="mt-5">
                  <Input label="URL pública de la API" type="url" value={draft.publicApiUrl} placeholder="https://api.tudominio.com" onChange={(event) => setField("publicApiUrl", event.target.value)} />
                </div>
              </section>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
