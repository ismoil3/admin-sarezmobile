"use client";

import type React from "react";

import { File, MoveLeft, X, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetBrandQuery,
  useGetColorQuery,
  useGetSubCatQuery,
  usePostProdMutation,
} from "@/rtk/adminSl";
import { useState } from "react";
import { useForm } from "react-hook-form";

const DetailPr = () => {
  const [selectedColors, setSelectedColors] = useState<number>();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showColorModal, setShowColorModal] = useState(false);
  const [newColorName, setNewColorName] = useState("");
  const [newColorValue, setNewColorValue] = useState("#000000");
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data,
    isLoading: categoriesLoading,

  } = useGetSubCatQuery({});
  const {
    data: catBran,
    isLoading: brandsLoading,
  } = useGetBrandQuery({});
  const {
    data: dataCol,
    isLoading: colorsLoading,
    refetch: refetchColors,
  } = useGetColorQuery({});
  const [addProd] = usePostProdMutation();

  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue } = useForm();

  const inputClass =
    "bg-card border-border hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 px-4 py-3 rounded-lg text-foreground placeholder:text-muted-foreground shadow-sm hover:shadow-md";

  const autoResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const validateForm = (data: any) => {
    const newErrors: Record<string, string> = {};

    if (!data.ProductName?.trim()) {
      newErrors.ProductName = "Название товара обязательно";
    }
    if (!data.Description?.trim()) {
      newErrors.Description = "Описание обязательно";
    }
    if (!data.Price || data.Price <= 0) {
      newErrors.Price = "Цена должна быть больше 0";
    }
    if (!data.Quantity || data.Quantity <= 0) {
      newErrors.Quantity = "Количество должно быть больше 0";
    }
    if (!data.SubCategoryId) {
      newErrors.SubCategoryId = "Выберите категорию";
    }
    if (!data.BrandId) {
      newErrors.BrandId = "Выберите бренд";
    }
    if (!selectedColors) {
      newErrors.colors = "Выберите хотя бы один цвет";
    }
    if (!data.Size?.trim()) {
      newErrors.Size = "Введите размер";
    }
    if (!data.Weight?.trim()) {
      newErrors.Weight = "Введите вес";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const toggleColorSelection = (colorId: number) => {
    setSelectedColors(colorId);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const base64Promises = fileArray.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(base64Promises).then((base64Images) => {
        setSelectedImages((prev) => [...prev, ...base64Images]);
      });
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    if (!validateForm(data)) {
      return;
    }

    setIsSubmitting(true);
    const fd = new FormData();
    fd.append("ProductName", data.ProductName);
    fd.append("Code", Date.now().toString());
    fd.append("Description", data.Description);
    fd.append("SubCategoryId", String(data.SubCategoryId || ""));
    fd.append("BrandId", String(data.BrandId || ""));
    fd.append("ColorId", String(selectedColors));
    fd.append("Quantity", String(data.Quantity));
    fd.append("Price", String(data.Price));
    fd.append("DiscountPrice", String(data.DiscountPrice || 0));
    fd.append("Weight", data.Weight);
    fd.append("Size", data.Size);
    fd.append("HasDiscount", data.HasDiscount);

    if (data.Images?.length) {
      const files = Array.from(data.Images as FileList);
      files.forEach((file) => fd.append("Images", file));
    }

    try {
      await addProd(fd).unwrap();
      reset();
      setSelectedImages([]);
      setErrors({});
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addNewColor = async () => {
    const colorToUse = newColorValue || newColorName;

    if (!colorToUse.trim()) {
      alert("Введите название цвета или выберите цвет");
      return;
    }

    setIsAddingColor(true);
    try {
      const response = await fetch(
        `http://37.27.29.18:8007/Color/add-color?ColorName=${encodeURIComponent(
          colorToUse
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        await refetchColors();
        setNewColorName("");
        setNewColorValue("#000000");
        setShowColorModal(false);
        alert("Цвет успешно добавлен!");
      } else {
        throw new Error("Failed to add color");
      }
    } catch (error) {
      console.error("Error adding color:", error);
      alert("Ошибка при добавлении цвета");
    } finally {
      setIsAddingColor(false);
    }
  };

  const LoadingSkeleton = ({ className }: { className?: string }) => (
    <Skeleton className={`animate-pulse bg-muted ${className}`} />
  );

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 xl:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-6 bg-card rounded-xl border shadow-sm">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary-foreground border border-secondary/20 hover:border-secondary/40 transition-all duration-200"
          >
            <MoveLeft className="w-4 h-4" />
            <span>Назад</span>
          </button>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="px-6 bg-transparent"
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="px-6 bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                "Сохранить"
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 w-full">
          <div className="flex-1 bg-card rounded-xl border shadow-sm p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              Информация о товаре
            </h2>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="flex-1">
                  <Label
                    htmlFor="productName"
                    className="text-sm font-medium text-foreground mb-2 block"
                  >
                    Название товара
                  </Label>
                  <input
                    id="productName"
                    {...register("ProductName")}
                    type="text"
                    placeholder="Введите название товара"
                    className={`${inputClass} w-full ${
                      errors.ProductName
                        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                        : ""
                    }`}
                  />
                  {errors.ProductName && (
                    <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                      {errors.ProductName}
                    </p>
                  )}
                </div>
                <div className="sm:w-[200px]">
                  <input
                    hidden
                    id="code"
                    {...register("Code")}
                    type="text"
                    placeholder="Код"
                    className={`${inputClass} w-full ${
                      errors.Code
                        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                        : ""
                    }`}
                  />
                  {errors.Code && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.Code}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-foreground mb-2 block"
                >
                  Описание
                </Label>
                <textarea
                  id="description"
                  {...register("Description")}
                  placeholder="Подробное описание товара"
                  rows={4}
                  className={`${inputClass} resize-none w-full ${
                    errors.Description
                      ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                      : ""
                  }`}
                  onInput={autoResize}
                />
                {errors.Description && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.Description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Подкатегория
                  </Label>
                  {categoriesLoading ? (
                    <LoadingSkeleton className="h-11 w-full rounded-lg" />
                  ) : (
                    <Select
                      onValueChange={(val) => setValue("SubCategoryId", val)}
                    >
                      <SelectTrigger
                        className={`${inputClass} ${
                          errors.SubCategoryId ? "border-destructive" : ""
                        }`}
                      >
                        <SelectValue placeholder="Выберите подкатегорию" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border shadow-lg rounded-lg">
                        {data?.data?.map((e: any) => (
                          <SelectItem key={e.id} value={e.id.toString()}>
                            {e.id} – {e.subCategoryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {errors.SubCategoryId && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.SubCategoryId}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Бренд
                  </Label>
                  {brandsLoading ? (
                    <LoadingSkeleton className="h-11 w-full rounded-lg" />
                  ) : (
                    <Select onValueChange={(val) => setValue("BrandId", val)}>
                      <SelectTrigger
                        className={`${inputClass} ${
                          errors.BrandId ? "border-destructive" : ""
                        }`}
                      >
                        <SelectValue placeholder="Выберите бренд" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border shadow-lg rounded-lg">
                        {catBran?.data?.map((e: any) => (
                          <SelectItem key={e.id} value={e.id.toString()}>
                            {e.id} – {e.brandName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {errors.BrandId && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.BrandId}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Скидка
                  </Label>
                  <Select defaultValue="false" onValueChange={(val) => setValue("HasDiscount", val)}>
                    <SelectTrigger className={inputClass}>
                      <SelectValue placeholder="Есть скидка?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Да</SelectItem>
                      <SelectItem value="false">Нет</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-medium text-foreground">
                  Цена и количество
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label
                      htmlFor="price"
                      className="text-sm font-medium text-foreground mb-2 block"
                    >
                      Цена товара
                    </Label>
                    <input
                      id="price"
                      {...register("Price")}
                      type="number"
                      placeholder="0.00"
                      className={`${inputClass} w-full ${
                        errors.Price
                          ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                          : ""
                      }`}
                    />
                    {errors.Price && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.Price}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="discountPrice"
                      className="text-sm font-medium text-foreground mb-2 block"
                    >
                      Цена со скидкой
                    </Label>
                    <input
                      id="discountPrice"
                      {...register("DiscountPrice")}
                      type="number"
                      placeholder="0.00"
                      className={`${inputClass} w-full`}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="quantity"
                      className="text-sm font-medium text-foreground mb-2 block"
                    >
                      Количество
                    </Label>
                    <input
                      id="quantity"
                      {...register("Quantity")}
                      type="number"
                      placeholder="0"
                      className={`${inputClass} w-full ${
                        errors.Quantity
                          ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                          : ""
                      }`}
                    />
                    {errors.Quantity && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.Quantity}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-medium text-foreground">
                  Характеристики
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="size"
                      className="text-sm font-medium text-foreground mb-2 block"
                    >
                      Размер
                    </Label>
                    <input
                      id="size"
                      {...register("Size")}
                      type="text"
                      placeholder="S, M, L, XL"
                      className={`${inputClass} w-full ${
                        errors.Size
                          ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                          : ""
                      }`}
                    />
                    {errors.Size && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.Size}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="weight"
                      className="text-sm font-medium text-foreground mb-2 block"
                    >
                      Вес
                    </Label>
                    <input
                      id="weight"
                      {...register("Weight")}
                      type="text"
                      placeholder="10кг, 20кг, 30кг"
                      className={`${inputClass} w-full ${
                        errors.Weight
                          ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                          : ""
                      }`}
                    />
                    {errors.Weight && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.Weight}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full xl:w-[400px] space-y-6">
            <div className="bg-card rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground">Цвета</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowColorModal(true)}
                    className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Создать
                  </button>
                </div>
              </div>
              {errors.colors && (
                <p className="text-destructive text-sm mb-3">{errors.colors}</p>
              )}

              {colorsLoading ? (
                <div className="flex gap-2">
                  {[...Array(6)].map((_, i) => (
                    <LoadingSkeleton
                      key={i}
                      className="w-10 h-10 rounded-full"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {dataCol?.data.map((e: any) => (
                    <div
                      key={e.id}
                      onClick={() => toggleColorSelection(e.id)}
                      className={`relative border-2 rounded-full p-1 cursor-pointer transition-all duration-200 hover:scale-110 ${
                        selectedColors == e.id
                          ? "border-primary shadow-lg shadow-primary/25"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full shadow-inner"
                        style={{ backgroundColor: e.colorName }}
                      />
                      {selectedColors == Number(e.id) && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-card rounded-xl border shadow-sm p-6">
              <h3 className="text-lg font-medium text-foreground mb-4">
                Изображения
              </h3>
              <div className="relative border-2 border-dashed border-border hover:border-primary/50 rounded-lg p-8 flex flex-col items-center justify-center transition-colors cursor-pointer group">
                <File className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
                <p className="text-muted-foreground text-sm text-center mb-1">
                  Нажмите для загрузки или перетащите файлы
                </p>
                <p className="text-muted-foreground text-xs text-center">
                  PNG, JPG, GIF до 10MB
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  {...register("Images")}
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {selectedImages.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-foreground mb-3">
                    Выбранные изображения ({selectedImages.length}):
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-destructive/90 transition-all duration-200 shadow-lg"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      <Dialog open={showColorModal} onOpenChange={setShowColorModal}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Добавить новый цвет
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-3">
              <Label
                htmlFor="color-picker"
                className="text-sm font-medium text-foreground"
              >
                Выберите цвет
              </Label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    id="color-picker"
                    type="color"
                    value={newColorValue}
                    onChange={(e) => setNewColorValue(e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer disabled:cursor-not-allowed"
                    disabled={isAddingColor}
                  />
                  {isAddingColor && (
                    <div className="absolute inset-0 bg-background/50 rounded-lg flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Или введите название цвета"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    disabled={isAddingColor}
                    className={inputClass}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Выберите цвет из палитры или введите название цвета
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowColorModal(false);
                setNewColorName("");
                setNewColorValue("#000000");
              }}
              disabled={isAddingColor}
            >
              Отмена
            </Button>
            <Button
              type="button"
              onClick={addNewColor}
              disabled={
                isAddingColor || (!newColorName.trim() && !newColorValue)
              }
              className="bg-primary hover:bg-primary/90"
            >
              {isAddingColor ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Добавление...
                </>
              ) : (
                "Добавить"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailPr;
