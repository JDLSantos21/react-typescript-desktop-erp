# Componentes UI (shadcn/ui)

Esta carpeta contiene los componentes base de **shadcn/ui** basados en **Radix UI**.

## 📁 Estructura

```
src/shared/components/
├── ui/              # Componentes primitivos de shadcn (NO MODIFICAR)
│   └── select.tsx
├── core/            # Componentes personalizados de la app
│   └── Select.tsx   # Wrapper del select.tsx
└── ...
```

## ⚠️ Importante

- **NO modifiques directamente** los archivos en esta carpeta `ui/`
- Estos son los componentes **base** instalados por shadcn CLI
- Para personalizar, crea un **wrapper** en `core/` que use estos componentes

## 🔧 Configuración

Los componentes de shadcn se instalan automáticamente en esta carpeta mediante:

```bash
npx shadcn@latest add select
```

La configuración está en `components.json`:

```json
{
  "aliases": {
    "ui": "@/shared/components/ui"
  }
}
```

## 📚 Componentes Disponibles

- `select.tsx` - Select/Dropdown base de Radix UI

## 💡 Uso

**❌ NO hacer esto:**

```tsx
import { Select } from "@/shared/components/ui/select";
```

**✅ Hacer esto:**

```tsx
import { Select } from "@/shared/components"; // Usa el wrapper de core/
```

## 🔄 Actualización

Para actualizar un componente de shadcn:

```bash
npx shadcn@latest add select --overwrite
```

---

Consulta la [documentación de shadcn/ui](https://ui.shadcn.com) para más información.
