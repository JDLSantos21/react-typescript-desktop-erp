import { useRef, useState } from "react";
import { Input, Button, Textarea } from "@/shared/components";
import { SearchIcon, TrashIcon, PlusIcon, PackageIcon } from "lucide-react";
import { OrderStepData } from "../../hooks/useOrderSteps";
import { useGetAllProducts } from "../../hooks/useOrder";
import { useDebounce } from "@/shared/hooks";
import SectionLoader from "@/shared/components/SectionLoader";
import { cn } from "@/shared/utils";
import { motion, AnimatePresence } from "motion/react";

interface Step2ProductsProps {
  orderData: OrderStepData;
  updateOrderData: (data: Partial<OrderStepData>) => void;
}

export default function Step2Products({
  orderData,
  updateOrderData,
}: Step2ProductsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const quantityInputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);
  const { data: productsData, isLoading } = useGetAllProducts();

  // Filtrado simple (idealmente esto se hace en backend si hay muchos productos)
  const filteredProducts =
    productsData?.data?.filter((p) =>
      p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    ) || [];

  const [newItem, setNewItem] = useState({
    productId: 0,
    productName: "",
    requestedQuantity: 1,
    notes: "",
  });

  const handleSelectProduct = (product: any) => {
    setSelectedProductId(product.id);
    setNewItem({
      productId: product.id,
      productName: product.name,
      requestedQuantity: 1,
      notes: "",
    });
    setSearchTerm(""); // Opcional: limpiar búsqueda
    setTimeout(() => quantityInputRef.current?.focus(), 100);
  };

  const handleAdd = () => {
    if (newItem.productId === 0 || newItem.requestedQuantity <= 0) return;

    const existingIndex = orderData.orderItems.findIndex(
      (i) => i.productId === newItem.productId
    );
    let updatedItems = [...orderData.orderItems];

    if (existingIndex >= 0) {
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        requestedQuantity:
          updatedItems[existingIndex].requestedQuantity +
          newItem.requestedQuantity,
      };
    } else {
      updatedItems.push(newItem);
    }

    updateOrderData({ orderItems: updatedItems });
    setSelectedProductId(null); // Resetear selección
    setNewItem({
      productId: 0,
      productName: "",
      requestedQuantity: 1,
      notes: "",
    });
  };

  const handleRemove = (index: number) => {
    const updated = orderData.orderItems.filter((_, i) => i !== index);
    updateOrderData({ orderItems: updated });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px] max-h-[70vh]">
      {/* Columna 1: Catálogo (5 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-4 h-full">
        <div className="relative">
          <Input
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startIcon={<SearchIcon className="w-4 h-4 text-slate-400" />}
            className="bg-slate-50 border-slate-200"
          />
        </div>

        <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">
            Catálogo
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
            {isLoading ? (
              <SectionLoader />
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                Sin resultados
              </div>
            ) : (
              filteredProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectProduct(p)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg text-sm transition-all duration-200 hover:bg-slate-50 border border-transparent",
                    selectedProductId === p.id
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-700"
                  )}
                >
                  <div className="font-semibold">{p.name}</div>
                  <div
                    className={cn(
                      "text-xs mt-0.5",
                      selectedProductId === p.id
                        ? "text-slate-400"
                        : "text-slate-400"
                    )}
                  >
                    {p.size} {p.unit}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Columna 2: Configuración (4 cols) */}
      <div className="lg:col-span-4 flex flex-col h-full">
        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-inner">
          {!selectedProductId ? (
            <div className="text-slate-400">
              <PackageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">
                Selecciona un producto
                <br />
                del catálogo
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full space-y-6"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {newItem.productName}
                </h3>
                <p className="text-sm text-slate-500">Configura la cantidad</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                  Cantidad
                </label>
                <Input
                  ref={quantityInputRef}
                  type="number"
                  min={1}
                  value={newItem.requestedQuantity}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      requestedQuantity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="text-center text-2xl font-bold h-14"
                />
              </div>

              <Textarea
                placeholder="Nota (Ej: Sin etiqueta, urgente...)"
                value={newItem.notes}
                onChange={(e) =>
                  setNewItem({ ...newItem, notes: e.target.value })
                }
                className="bg-white"
                rows={2}
              />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedProductId(null)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAdd}
                  disabled={newItem.requestedQuantity < 1}
                  className="flex-1 bg-slate-900 text-white"
                >
                  <PlusIcon className="w-4 h-4 mr-2" /> Agregar
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Columna 3: Carrito (3 cols) */}
      <div className="lg:col-span-4 h-full flex flex-col">
        <div className="bg-white border border-slate-200 rounded-xl h-full flex flex-col shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-900 uppercase">
              Orden Actual
            </span>
            <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
              {orderData.orderItems.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
            <AnimatePresence>
              {orderData.orderItems.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
                  Carrito vacío
                </div>
              ) : (
                orderData.orderItems.map((item, idx) => (
                  <motion.div
                    key={`${item.productId}-${idx}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="group flex justify-between items-start p-3 bg-white border border-slate-100 rounded-lg hover:border-slate-300 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {item.productName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-slate-100 px-1.5 rounded text-slate-600">
                          x{item.requestedQuantity}
                        </span>
                        {item.notes && (
                          <span className="text-[10px] text-amber-600 bg-amber-50 px-1 rounded truncate max-w-[100px]">
                            {item.notes}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(idx)}
                      className="text-slate-300 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
            <div className="flex justify-between items-center text-sm font-bold text-slate-900">
              <span>Total Unidades</span>
              <span>
                {orderData.orderItems.reduce(
                  (acc, i) => acc + i.requestedQuantity,
                  0
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
