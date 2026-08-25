import { useMutation, useQuery } from "@tanstack/react-query";
import { sileo } from "sileo";
import { queryClient } from "@/shared/lib/query-client";
import { extractApiError } from "@/shared/utils/error-handler";
import { InventoryKeys } from "../api/inventory.keys";
import { InventoryService } from "../api/inventory.service";
import type {
  MaterialInput,
  MaterialQuery,
  StockMoveInput,
  StockMoveQuery,
} from "../types/inventory";

const invalidateInventory = () =>
  queryClient.invalidateQueries({ queryKey: InventoryKeys.all });

const notifyFailure = (title: string, error: unknown) =>
  sileo.error({ title, description: extractApiError(error).message });

export const useInventoryDashboard = () =>
  useQuery({
    queryKey: InventoryKeys.dashboard(),
    queryFn: InventoryService.getDashboard,
    staleTime: 60_000,
  });

export const useMaterials = (params: MaterialQuery) =>
  useQuery({
    queryKey: InventoryKeys.materials(params),
    queryFn: () => InventoryService.getMaterials(params),
  });

export const useMaterial = (id?: number) =>
  useQuery({
    queryKey: InventoryKeys.material(id ?? 0),
    queryFn: () => InventoryService.getMaterial(id ?? 0),
    enabled: Boolean(id),
  });

export const useStockMoves = (params: StockMoveQuery) =>
  useQuery({
    queryKey: InventoryKeys.moves(params),
    queryFn: () => InventoryService.getMoves(params),
  });

export const useInventoryCategories = () =>
  useQuery({
    queryKey: InventoryKeys.categories(),
    queryFn: InventoryService.getCategories,
    staleTime: 5 * 60_000,
  });

export const useInventoryUnits = () =>
  useQuery({
    queryKey: InventoryKeys.units(),
    queryFn: InventoryService.getUnits,
    staleTime: 5 * 60_000,
  });

export const useCreateMaterial = () =>
  useMutation({
    mutationFn: (input: MaterialInput) => InventoryService.createMaterial(input),
    onSuccess: () => {
      sileo.success({ title: "Material creado" });
      invalidateInventory();
    },
    onError: (error) => notifyFailure("No se pudo crear el material", error),
  });

export const useUpdateMaterial = () =>
  useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<MaterialInput> }) =>
      InventoryService.updateMaterial(id, input),
    onSuccess: () => {
      sileo.success({ title: "Material actualizado" });
      invalidateInventory();
    },
    onError: (error) => notifyFailure("No se pudo actualizar el material", error),
  });

export const useDeleteMaterial = () =>
  useMutation({
    mutationFn: InventoryService.deleteMaterial,
    onSuccess: () => {
      sileo.success({ title: "Material eliminado" });
      invalidateInventory();
    },
    onError: (error) => notifyFailure("No se pudo eliminar el material", error),
  });

export const useCreateStockMove = () =>
  useMutation({
    mutationFn: (input: StockMoveInput) => InventoryService.createMove(input),
    onSuccess: () => {
      sileo.success({ title: "Movimiento registrado" });
      invalidateInventory();
    },
    onError: (error) => notifyFailure("No se pudo registrar el movimiento", error),
  });

export const useCreateCategory = () =>
  useMutation({
    mutationFn: InventoryService.createCategory,
    onSuccess: () => invalidateInventory(),
    onError: (error) => notifyFailure("No se pudo crear la categoría", error),
  });

export const useDeleteCategory = () =>
  useMutation({
    mutationFn: InventoryService.deleteCategory,
    onSuccess: () => invalidateInventory(),
    onError: (error) => notifyFailure("No se pudo eliminar la categoría", error),
  });

export const useCreateUnit = () =>
  useMutation({
    mutationFn: InventoryService.createUnit,
    onSuccess: () => invalidateInventory(),
    onError: (error) => notifyFailure("No se pudo crear la unidad", error),
  });

export const useDeleteUnit = () =>
  useMutation({
    mutationFn: InventoryService.deleteUnit,
    onSuccess: () => invalidateInventory(),
    onError: (error) => notifyFailure("No se pudo eliminar la unidad", error),
  });
