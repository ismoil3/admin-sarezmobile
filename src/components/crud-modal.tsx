"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: "category" | "brand" | "subcategory";
  mode: "add" | "edit";
  initialData?: any;
  onSubmit: (data: any) => void;
  categories?: any[];
}

export default function CrudModal({
  isOpen,
  onClose,
  title,
  type,
  mode,
  initialData,
  onSubmit,
  categories = [],
}: CrudModalProps) {
  const [formData, setFormData] = useState(() => {
    if (mode === "edit" && initialData) {
      return {
        id: initialData.id,
        name:
          type.trim() == "category"
            ? initialData.categoryName
            : type === "brand"
            ? initialData.brandName
            : initialData.subCategoryName,
        categoryId:
          type.trim() === "subcategory" ? initialData.categoryId : undefined,
        image: null as File | null,
      };
    }
    return {
      name: "",
      categoryId: type === "subcategory" ? "" : undefined,
      image: null as File | null,
    };
  });
  console.log(formData, "initialDatanew");
  console.log(initialData, "initialData");
  console.log(categories, "categories");
  console.log(type, "type");

  useEffect(() => {
    setFormData({
      id: initialData?.id,
      name:
        type.trim() == "category"
          ? initialData?.categoryName || ""
          : type === "brand"
          ? initialData?.brandName || ""
          : initialData?.subCategoryName || "",
      categoryId:
        type === "subcategory" ? initialData?.categoryId || "" : undefined,
      image: null,
    });
  }, [initialData, type]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = `${
        type === "category"
          ? "Название категории"
          : type === "brand"
          ? "Название бренда"
          : "Название подкатегории"
      } обязательно для заполнения`;
    }

    if (type === "subcategory" && !formData.categoryId) {
      newErrors.categoryId = "Выбор категории обязателен";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        name: "",
        categoryId: type === "subcategory" ? "" : undefined,
        image: null,
      });
      setErrors({});
    } catch (error) {
      console.error("Ошибка отправки формы:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Пожалуйста, выберите корректный файл изображения",
        }));
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Размер изображения должен быть меньше 5MB",
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">
              {type === "category"
                ? "Название категории"
                : type === "brand"
                ? "Название бренда"
                : "Название подкатегории"}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={errors.name ? "border-red-500" : ""}
              disabled={isSubmitting}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {type === "subcategory" && (
            <div>
              <Label htmlFor="categoryId">Категория</Label>
              <select
                id="categoryId"
                value={formData.categoryId}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    categoryId: e.target.value,
                  }));
                  if (errors.categoryId)
                    setErrors((prev) => ({ ...prev, categoryId: "" }));
                }}
                className={`w-full px-3 py-2 border rounded-md bg-background ${
                  errors.categoryId ? "border-red-500" : "border-input"
                }`}
                disabled={isSubmitting}
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
              )}
            </div>
          )}

          {type === "category" && (
            <div>
              <Label htmlFor="image">Изображение категории</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image")?.click()}
                  className="w-full"
                  disabled={isSubmitting}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {formData.image
                    ? formData.image.name
                    : "Выберите изображение"}
                </Button>
              </div>
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {mode === "add" ? "Добавление..." : "Обновление..."}
                </>
              ) : mode === "add" ? (
                "Добавить"
              ) : (
                "Обновить"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
