"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetBrandQuery,
  useGetColorQuery,
  useGetSubCatQuery,
} from "@/rtk/adminSl";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/rtk/product";
import {
  AlertCircle,
  ArrowLeft,
  Edit,
  Loader2,
  MoveLeft,
  Plus,
  Save,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

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

interface DescriptionOption {
  name: string;
  value: string;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useNavigate();
  const productId = Number.parseInt(params.id as string);

  // New states for additional functionality
  const [descriptionOptions, setDescriptionOptions] = useState<
    DescriptionOption[]
  >([]);
  const [newOptionName, setNewOptionName] = useState("");
  const [newOptionValue, setNewOptionValue] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(
    null
  );
  const [editingOption, setEditingOption] = useState<DescriptionOption>({
    name: "",
    value: "",
  });

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

  const { register, handleSubmit, setValue, watch } =
    useForm<EditProductForm>();

  const hasDiscount = watch("hasDiscount");

  useEffect(() => {
    if (productData?.data) {
      const product = productData.data;
      setValue("productName", product.productName);
      setValue("code", product.code);
      setValue("brandId", product.brandId);
      setValue("colorId", product.colorId);
      setValue("subCategoryId", product.subCategoryId);
      setValue("quantity", product.quantity);
      setValue("price", product.price);
      setValue("discountPrice", product.discountPrice);
      setValue("hasDiscount", product.hasDiscount);
      setValue("weight", product.weight);
      setValue("size", product.size);

      // Parse JSON description and extract data
      try {
        if (product.description) {
          const descData = JSON.parse(product.description);

          if (Array.isArray(descData) && descData.length > 0) {
            // First element is main description
            const mainDescription = descData[0]?.value || "";
            setValue("description", mainDescription);

            // Rest are additional options
            const options = descData.slice(1);
            setDescriptionOptions(options);
          } else {
            // If it's not an array, use the whole description as main
            setValue("description", product.description);
          }
        }
      } catch (e) {
        // If parsing fails, use the raw description
        console.log("Description parsing failed, using raw value:", e);
        setValue("description", product.description);
      }
    }
  }, [productData, setValue]);

  // Auto-resize for textarea
  const autoResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  // Add new description option
  const addDescriptionOption = () => {
    if (newOptionName.trim() && newOptionValue.trim()) {
      const newOption = {
        name: newOptionName.trim(),
        value: newOptionValue.trim(),
      };
      setDescriptionOptions([...descriptionOptions, newOption]);
      setNewOptionName("");
      setNewOptionValue("");
    }
  };

  // Remove description option
  const removeDescriptionOption = (index: number) => {
    setDescriptionOptions(descriptionOptions.filter((_, i) => i !== index));
  };

  // Start editing an option
  const startEditingOption = (index: number) => {
    setEditingOptionIndex(index);
    setEditingOption(descriptionOptions[index]);
  };

  // Save edited option
  const saveEditedOption = () => {
    if (
      editingOptionIndex !== null &&
      editingOption.name.trim() &&
      editingOption.value.trim()
    ) {
      const updatedOptions = [...descriptionOptions];
      updatedOptions[editingOptionIndex] = { ...editingOption };
      setDescriptionOptions(updatedOptions);
      setEditingOptionIndex(null);
      setEditingOption({ name: "", value: "" });
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingOptionIndex(null);
    setEditingOption({ name: "", value: "" });
  };

  const validateForm = (data: any) => {
    const newErrors: Record<string, string> = {};

    if (!data.productName?.trim()) {
      newErrors.productName = "Product name is required";
    }
    if (!data.description?.trim()) {
      newErrors.description = "Description is required";
    }
    if (!data.brandId) {
      newErrors.brandId = "Please select a brand";
    }
    if (!data.colorId) {
      newErrors.colorId = "Please select a color";
    }
    if (!data.subCategoryId) {
      newErrors.subCategoryId = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (data: EditProductForm) => {
    if (!validateForm(data)) {
      return;
    }

    try {
      // Combine main description with additional options in JSON format
      const fullDescription = [
        { name: "Description", value: data.description },
        ...descriptionOptions,
      ];

      await updateProduct({
        Id: productId,
        BrandId: data.brandId,
        ColorId: data.colorId,
        ProductName: data.productName,
        Description: JSON.stringify(fullDescription),
        Quantity: 999,
        Weight: "...",
        Size: "..",
        Code: Date.now().toString(),
        Price: 20,
        HasDiscount: false,
        DiscountPrice: 0,
        SubCategoryId: data.subCategoryId,
      }).unwrap();

      toast.success("Product updated successfully!");
      router("/products");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update product. Please try again.");
    }
  };

  const inputClass =
    "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg";

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
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
        <div className="max-w-7xl mx-auto">
          <Card className="border-0 shadow-lg rounded-xl bg-white dark:bg-gray-800">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Product Loading Error
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Failed to load product data. Please try again.
              </p>
              <Button
                onClick={() => router("/products")}
                variant="outline"
                className="gap-2 border-gray-300 dark:border-gray-600"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Products
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <button
            type="button"
            onClick={() => router(-1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
          >
            <MoveLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router("/products")}
              className="px-6 bg-transparent border-gray-300 dark:border-gray-600"
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 w-full">
          {/* Left Column - Product Information */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              Product Information
            </h2>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="flex-1">
                  <Label
                    htmlFor="productName"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
                  >
                    Product Name
                  </Label>
                  <Input
                    id="productName"
                    {...register("productName", {
                      required: "Product name is required",
                    })}
                    type="text"
                    placeholder="Enter product name"
                    className={`${inputClass} w-full ${
                      errors.productName
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }`}
                  />
                  {errors.productName && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.productName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
                >
                  Main Description
                </Label>
                <Textarea
                  id="description"
                  {...register("description", {
                    required: "Description is required",
                  })}
                  placeholder="Main product description"
                  rows={4}
                  className={`${inputClass} resize-none w-full ${
                    errors.description
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                  onInput={autoResize}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Description Options Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Additional Options
                  </Label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {descriptionOptions.length} options
                  </span>
                </div>

                {/* Add new option inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="sm:col-span-1">
                    <Input
                      placeholder="Option name"
                      value={newOptionName}
                      onChange={(e) => setNewOptionName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Input
                      placeholder="Option value"
                      value={newOptionValue}
                      onChange={(e) => setNewOptionValue(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Button
                      type="button"
                      onClick={addDescriptionOption}
                      disabled={!newOptionName.trim() || !newOptionValue.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Display description options as editable inputs */}
                {descriptionOptions.length > 0 && (
                  <div className="space-y-3">
                    {descriptionOptions.map((option, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 group hover:border-blue-300 dark:hover:border-blue-400 transition-colors"
                      >
                        {editingOptionIndex === index ? (
                          // Edit mode
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                                  Option Name
                                </Label>
                                <Input
                                  value={editingOption.name}
                                  onChange={(e) =>
                                    setEditingOption((prev) => ({
                                      ...prev,
                                      name: e.target.value,
                                    }))
                                  }
                                  className={inputClass}
                                  placeholder="Option name"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                                  Option Value
                                </Label>
                                <Input
                                  value={editingOption.value}
                                  onChange={(e) =>
                                    setEditingOption((prev) => ({
                                      ...prev,
                                      value: e.target.value,
                                    }))
                                  }
                                  className={inputClass}
                                  placeholder="Option value"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={cancelEditing}
                                className="border-gray-300 dark:border-gray-600"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                onClick={saveEditedOption}
                                disabled={
                                  !editingOption.name.trim() ||
                                  !editingOption.value.trim()
                                }
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // View mode
                          <div className="flex items-start gap-3">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                                  Option Name
                                </Label>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {option.name}
                                </p>
                              </div>
                              <div>
                                <Label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                                  Option Value
                                </Label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {option.value}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditingOption(index)}
                                className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                                title="Edit"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDescriptionOption(index)}
                                className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
                                title="Delete"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Категории и атрибуты */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Brand *
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
                              ? "Loading brands..."
                              : "Select a brand"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {brands?.data?.map((brand: any) => (
                          <SelectItem
                            key={brand.id}
                            value={brand.id.toString()}
                          >
                            {brand.brandName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.brandId && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Brand is required
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Color *
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
                            colorsLoading
                              ? "Loading colors..."
                              : "Select a color"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {colors?.data?.map((color: any) => (
                          <SelectItem
                            key={color.id}
                            value={color.id.toString()}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{
                                  backgroundColor:
                                    color.colorName?.toLowerCase(),
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
                        Color is required
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category *
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
                              ? "Loading categories..."
                              : "Select a category"
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
                        Category is required
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {hasDiscount && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Discount Price
                    </Label>
                    <Input
                      {...register("discountPrice", { valueAsNumber: true })}
                      type="number"
                      placeholder="Discount price"
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
