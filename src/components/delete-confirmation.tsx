"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: string;
}

export default function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
}: DeleteConfirmationProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-semibold">Подтвердите удаление</h2>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Вы уверены, что хотите удалить{" "}
          {itemType === "category"
            ? "категорию"
            : itemType === "brand"
            ? "бренд"
            : itemType === "subcategory"
            ? "подкатегорию"
            : itemType}{" "}
          "{itemName}"? Это действие нельзя отменить.
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-transparent"
          >
            Отмена
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="flex-1">
            Удалить
          </Button>
        </div>
      </div>
    </div>
  );
}
