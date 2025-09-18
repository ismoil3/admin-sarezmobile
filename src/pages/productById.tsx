"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/rtk/product";
import {
  useGetBrandQuery,
  useGetSubCatQuery,
  useGetColorQuery,
} from "@/rtk/adminSl";

interface EditProductForm {
  productName: string;
  description: string;
  quantity: number;
  weight: string;
  size: string;
  code: string;
  price: number;
  hasDiscount: boolean;
  discountPrice: number;
  brandId: number;
  colorId: number;
  subCategoryId: number;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useNavigate();
  const productId = Number.parseInt(params.id as string);

  const {
    data: productData,
    isLoading: isLoadingProduct,
    error,
  } = useGetProductByIdQuery(productId);

  const { data: subCategories, isLoading: categoriesLoading } =
    useGetSubCatQuery({});

  const { data: brands, isLoading: brandsLoading } = useGetBrandQuery({});

  const { data: colors, isLoading: colorsLoading } = useGetColorQuery({});

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<EditProductForm>();

  const hasDiscount = watch("hasDiscount");

  useEffect(() => {
    if (productData?.data) {
      const product = productData.data;
      setValue("productName", product.productName);
      setValue("description", product.description);
      setValue("quantity", product.quantity);
      setValue("weight", product.weight);
      setValue("size", product.size);
      setValue("code", product.code);
      setValue("price", product.price);
      setValue("hasDiscount", product.hasDiscount);
      setValue("discountPrice", product.discountPrice);
      setValue("brandId", product.brandId);
      setValue("colorId", product.colorId);
      setValue("subCategoryId", product.subCategoryId);
    }
  }, [productData, setValue]);

  const onSubmit = async (data: EditProductForm) => {
    try {
      await updateProduct({
        Id: productId,
        BrandId: data.brandId,
        ColorId: data.colorId,
        ProductName: data.productName,
        Description: data.description,
        Quantity: data.quantity,
        Weight: data.weight,
        Size: data.size,
        Code: Date.now().toString(),
        Price: data.price,
        HasDiscount: data.hasDiscount,
        DiscountPrice: data.discountPrice,
        SubCategoryId: data.subCategoryId,
      }).unwrap();

      toast.success("Товар успешно обновлен!");
      router("/products");
    } catch {
      toast.error("Не удалось обновить товар. Пожалуйста, попробуйте снова.");
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 mb-6"></div>
            <Card className="border-0 shadow-lg rounded-xl bg-white dark:bg-gray-800">
              <CardHeader className="pb-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-32"></div>
              </CardHeader>
              <CardContent className="space-y-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg rounded-xl bg-white dark:bg-gray-800">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Ошибка загрузки товара
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Не удалось загрузить данные товара. Пожалуйста, попробуйте
                снова.
              </p>
              <Button
                onClick={() => router("/products")}
                variant="outline"
                className="gap-2 border-gray-300 dark:border-gray-600"
              >
                <ArrowLeft className="w-4 h-4" />
                Назад к товарам
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router("/products")}
            variant="ghost"
            size="sm"
            className="gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Редактирование товара
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="border-0 shadow-lg rounded-xl bg-white dark:bg-gray-800">
            <CardHeader className="pb-6 border-b border-gray-100 dark:border-gray-700">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Информация о товаре
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Основная информация */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="productName"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Название товара *
                  </Label>
                  <Input
                    id="productName"
                    {...register("productName", {
                      required: "Название товара обязательно",
                      minLength: {
                        value: 2,
                        message: "Название должно содержать минимум 2 символа",
                      },
                    })}
                    className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    placeholder="Введите название товара"
                  />
                  {errors.productName && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.productName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="code"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Артикул
                  </Label>
                  <Input
                    id="code"
                    {...register("code")}
                    className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg bg-gray-50 dark:bg-gray-700"
                    placeholder="Артикул товара"
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Описание
                </Label>
                <Textarea
                  id="description"
                  {...register("description", {
                    maxLength: {
                      value: 500,
                      message: "Описание должно быть не более 500 символов",
                    },
                  })}
                  className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg min-h-[100px] resize-none"
                  placeholder="Введите описание товара"
                />
                {errors.description && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Физические свойства */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="quantity"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Количество *
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    {...register("quantity", {
                      required: "Количество обязательно",
                      min: {
                        value: 0,
                        message: "Количество должно быть 0 или больше",
                      },
                      max: {
                        value: 999999,
                        message: "Количество должно быть меньше 1,000,000",
                      },
                    })}
                    className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    placeholder="0"
                  />
                  {errors.quantity && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.quantity.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="weight"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Вес
                  </Label>
                  <Input
                    id="weight"
                    {...register("weight")}
                    className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    placeholder="например, 1.5кг"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="size"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Размер
                  </Label>
                  <Input
                    id="size"
                    {...register("size")}
                    className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    placeholder="например, L, XL"
                  />
                </div>
              </div>

              {/* Ценообразование */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="price"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Цена *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register("price", {
                      required: "Цена обязательна",
                      min: {
                        value: 0.01,
                        message: "Цена должна быть больше 0",
                      },
                      max: {
                        value: 999999.99,
                        message: "Цена должна быть меньше 1,000,000",
                      },
                    })}
                    className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="discountPrice"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Цена со скидкой
                  </Label>
                  <Input
                    id="discountPrice"
                    type="number"
                    step="0.01"
                    {...register("discountPrice", {
                      min: {
                        value: 0,
                        message: "Цена со скидкой должна быть 0 или больше",
                      },
                      validate: (value) => {
                        const price = watch("price");
                        if (hasDiscount && value && price && value >= price) {
                          return "Цена со скидкой должна быть меньше обычной цены";
                        }
                        return true;
                      },
                    })}
                    className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg disabled:bg-gray-50 dark:disabled:bg-gray-700"
                    placeholder="0.00"
                    disabled={!hasDiscount}
                  />
                  {errors.discountPrice && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.discountPrice.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Checkbox
                  id="hasDiscount"
                  checked={watch("hasDiscount")}
                  onCheckedChange={(value) =>
                    setValue("hasDiscount", Boolean(value))
                  }
                  className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label
                  htmlFor="hasDiscount"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Включить скидку
                </Label>
              </div>

              {/* Категории и атрибуты */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Бренд *
                  </Label>
                  <Select
                    defaultValue={productData?.data.brandId.toString()}
                    value={watch("brandId")?.toString()}
                    onValueChange={(value) =>
                      setValue("brandId", Number.parseInt(value), {
                        shouldDirty: true,
                      })
                    }
                  >
                    <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                      <SelectValue
                        placeholder={
                          brandsLoading
                            ? "Загрузка брендов..."
                            : "Выберите бренд"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {brands?.data?.map((brand: any) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.brandName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.brandId && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Бренд обязателен
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Цвет *
                  </Label>
                  <Select
                    defaultValue={productData?.data.colorId.toString()}
                    value={watch("colorId")?.toString()}
                    onValueChange={(value) =>
                      setValue("colorId", Number.parseInt(value), {
                        shouldDirty: true,
                      })
                    }
                  >
                    <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                      <SelectValue
                        placeholder={
                          colorsLoading ? "Загрузка цветов..." : "Выберите цвет"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {colors?.data?.map((color: any) => (
                        <SelectItem key={color.id} value={color.id.toString()}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{
                                backgroundColor: color.colorName?.toLowerCase(),
                              }}
                            />
                            {color.colorName}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.colorId && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Цвет обязателен
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Категория *
                  </Label>
                  <Select
                    defaultValue={productData?.data.subCategoryId.toString()}
                    value={watch("subCategoryId")?.toString()}
                    onValueChange={(value) =>
                      setValue("subCategoryId", Number.parseInt(value), {
                        shouldDirty: true,
                      })
                    }
                  >
                    <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                      <SelectValue
                        placeholder={
                          categoriesLoading
                            ? "Загрузка категорий..."
                            : "Выберите категорию"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategories?.data?.map((category: any) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.subCategoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subCategoryId && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Категория обязательна
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router("/products")}
                  disabled={isUpdating}
                  className="border-gray-300 dark:border-gray-600 rounded-lg"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={!isDirty || isUpdating}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Обновление...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Обновить товар
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
