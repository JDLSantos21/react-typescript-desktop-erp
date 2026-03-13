import { useRef, useState } from "react";
import { Input } from "@/shared/components/core/Input";
import { Button } from "@/shared/components/core/Button";
import { Textarea } from "@/shared/components/core/Textarea";
import { ShoppingCartPlusIcon } from "@/shared/components/icons";
import { SearchOffIcon } from "@/shared/components/icons";
import { WarningIcon } from "@/shared/components/icons";
import { SearchIcon, TrashIcon } from "lucide-react";
import { OrderStepData } from "../../hooks/useOrderSteps";
import { useGetAllProducts } from "../../hooks/useOrder";
import { useDebounce } from "@/shared/hooks/useDebounce";
import SectionLoader from "@/shared/components/SectionLoader";

import { cn } from "@/shared/utils/cn";

interface Step2ProductsProps {
  orderData: OrderStepData;
  updateOrderData: (data: Partial<OrderStepData>) => void;
  className?: string;
}

export default function Step2Products({
  orderData,
  updateOrderData,
  className,
}: Step2ProductsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const quantityInputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);
  const { data: productsData, isLoading: isLoadingProducts } =
    useGetAllProducts();

  const filteredProducts =
    productsData?.data?.filter((product) =>
      product.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    ) || productsData?.data;

  // Temporary form state for adding a product
  const [newProduct, setNewProduct] = useState({
    productId: 0,
    productName: "",
    requestedQuantity: 1,
    notes: "",
  });

  const resetNewProduct = () => {
    setNewProduct({
      productId: 0,
      productName: "",
      requestedQuantity: 1,
      notes: "",
    });
    setSelectedProductId(null);
  };

  const handleAddProduct = () => {
    if (
      orderData.orderItems
        .map((item) => item.productId)
        .includes(newProduct.productId)
    ) {
      const updatedOrderItems = orderData.orderItems.map((item) => {
        if (item.productId === newProduct.productId) {
          return {
            ...item,
            requestedQuantity:
              item.requestedQuantity + newProduct.requestedQuantity,
          };
        }
        return item;
      });
      updateOrderData({ orderItems: updatedOrderItems });
      resetNewProduct();
      return;
    }

    if (newProduct.productId > 0 && newProduct.requestedQuantity > 0) {
      const updatedOrderItems = [...orderData.orderItems, { ...newProduct }];
      updateOrderData({ orderItems: updatedOrderItems });
      // Reset form
      resetNewProduct();
    }
  };

  const handleRemoveProduct = (index: number) => {
    const updatedOrderItems = orderData.orderItems.filter(
      (_, i) => i !== index
    );
    updateOrderData({ orderItems: updatedOrderItems });
  };

  const handleUpdateProduct = (
    index: number,
    field: keyof typeof newProduct,
    value: string | number
  ) => {
    const updatedOrderItems = [...orderData.orderItems];
    updatedOrderItems[index] = {
      ...updatedOrderItems[index],
      [field]: value,
    };
    updateOrderData({ orderItems: updatedOrderItems });
  };

  return (
    <div
      className={cn(
        "space-y-2 max-h-[calc(100vh-285px)] h-screen overflow-hidden max-w-7xl",
        className
      )}
    >
      {/* Product Search */}

      <Input
        label="Buscar producto"
        placeholder="Buscar por nombre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        startIcon={<SearchIcon className="w-5 h-5" />}
      />
      <div className="grid grid-cols-3 h-[calc(100%-63px)] gap-4">
        <div className="overflow-y-hidden show-scrollbar border border-border rounded-md space-y-3 mb-3">
          {isLoadingProducts ? (
            <div className="flex justify-center items-center h-full">
              <SectionLoader placeholder="Cargando productos" />
            </div>
          ) : productsData?.data ? (
            <div className="overflow-y-scroll show-scrollbar h-full space-y-2 p-3">
              {filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => {
                      setSelectedProductId(product.id);
                      setNewProduct({
                        productId: product.id,
                        productName: product.name,
                        requestedQuantity: newProduct.requestedQuantity,
                        notes: "",
                      });
                      setSearchTerm("");
                      quantityInputRef.current?.focus();
                    }}
                    className={`w-full text-left p-3 bg-white border rounded-lg transition-all duration-200 cursor-pointer ${
                      selectedProductId === product.id
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-border hover:border-blue-400 hover:shadow-sm"
                    }`}
                  >
                    <p className="font-semibold text-gray-900">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ID: {product.id} | {product.size} {product.unit}
                    </p>
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-sm text-gray-500">
                  <SearchOffIcon className="w-6 h-6 my-2" />
                  <span>No hay productos que coincidan con la búsqueda</span>
                </div>
              )}
            </div>
          ) : searchTerm && !isLoadingProducts ? (
            <p className="text-sm text-gray-500">No se encontraron productos</p>
          ) : null}
        </div>

        {/* Add Product Form */}

        {selectedProductId !== null ? (
          <div className="bg-background-secondary border border-border rounded-lg p-4 space-y-4 h-75">
            <h4 className="font-semibold text-gray-900">
              {newProduct.productName}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Cantidad Solicitada *"
                ref={quantityInputRef}
                type="number"
                value={newProduct.requestedQuantity}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    requestedQuantity: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <Textarea
              label="Notas del producto (opcional)"
              value={newProduct.notes}
              onChange={(e) =>
                setNewProduct({ ...newProduct, notes: e.target.value })
              }
              placeholder="Instrucciones especiales para este producto..."
              rows={2}
            />

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => resetNewProduct()}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleAddProduct}
                disabled={
                  newProduct.productId === 0 ||
                  newProduct.requestedQuantity === 0
                }
              >
                Agregar
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 bg-white border border-border rounded-lg p-4 text-center text-gray-500">
            <ShoppingCartPlusIcon className="text-gray-300 w-8 h-8 mb-2" />
            <p className="text-gray-500 text-sm">
              Selecciona un producto para agregarlo al pedido
            </p>
          </div>
        )}

        {/* Products List */}

        <div className="overflow-y-scroll show-scrollbar space-y-2 p-3 mb-3 border border-border rounded-md">
          {orderData.orderItems.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center text-sm text-gray-500">
              <WarningIcon className="w-6 h-6 my-2" />
              <span>
                No hay productos agregados al pedido, seleccione al menos uno.
              </span>
            </div>
          )}

          {orderData.orderItems.map((product, index) => (
            <div
              key={product.productId}
              className="bg-white border border-border rounded-lg p-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">
                    {product.productName || `Producto ID: ${product.productId}`}
                  </p>
                  {product.notes && (
                    <p className="text-xs text-gray-500">
                      Notas: {product.notes}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => handleRemoveProduct(index)}
                >
                  <TrashIcon className="w-4 h-4 hover:text-danger" />
                </button>
              </div>

              {/* Quick Edit */}
              <div className="grid grid-cols-1 gap-2 pt-2 border-t border-gray-200">
                <Input
                  label="Cantidad Solicitada"
                  inputSize="sm"
                  value={product.requestedQuantity}
                  onChange={(e) =>
                    handleUpdateProduct(
                      index,
                      "requestedQuantity",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
