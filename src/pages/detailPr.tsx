"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetBrandQuery,
  useGetColorQuery,
  useGetSubCatQuery,
  usePostProdMutation,
} from "@/rtk/adminSl";
import { File, Loader2, MoveLeft, Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const DetailPr = () => {
  const [selectedColors, setSelectedColors] = useState<number>();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showColorModal, setShowColorModal] = useState(false);
  const [newColorName, setNewColorName] = useState("");
  const [newColorValue, setNewColorValue] = useState("#000000");
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New state for description options
  const [descriptionOptions, setDescriptionOptions] = useState<any[]>([]);
  const [newOptionName, setNewOptionName] = useState("");
  const [newOptionValue, setNewOptionValue] = useState("");

  const { data, isLoading: categoriesLoading } = useGetSubCatQuery({});
  const { data: catBran, isLoading: brandsLoading } = useGetBrandQuery({});
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
      newErrors.ProductName = "Product name is required";
    }
    if (!data.Description?.trim()) {
      newErrors.Description = "Description is required";
    }

    if (!data.SubCategoryId) {
      newErrors.SubCategoryId = "Please select a category";
    }
    if (!data.BrandId) {
      newErrors.BrandId = "Please select a brand";
    }
    if (!selectedColors) {
      newErrors.colors = "Please select at least one color";
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

  const onSubmit = async (data: any) => {
    if (!validateForm(data)) {
      return;
    }

    setIsSubmitting(true);
    const fd = new FormData();
    fd.append("ProductName", data.ProductName);
    fd.append("Code", Date.now().toString());

    const desc = [
      { name: "Description", value: data.Description },
      ...descriptionOptions,
    ];

    fd.append(`Description`, JSON.stringify(desc));

    fd.append("SubCategoryId", String(data.SubCategoryId || ""));
    fd.append("BrandId", String(data.BrandId || ""));
    fd.append("ColorId", String(selectedColors));
    fd.append("Quantity", "999");
    fd.append("Price", "20");
    fd.append("DiscountPrice", "0");
    fd.append("Weight", "1");
    fd.append("Size", "1");
    fd.append("HasDiscount", "false");

    if (data.Images?.length) {
      const files = Array.from(data.Images as FileList);
      files.forEach((file) => fd.append("Images", file));
    }

    try {
      await addProd(fd).unwrap();
      reset();
      setSelectedImages([]);
      setDescriptionOptions([]);
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
      alert("Please enter a color name or select a color");
      return;
    }

    setIsAddingColor(true);
    try {
      const response = await fetch(
        `https://api.sarezmobile.com/Color/add-color?ColorName=${encodeURIComponent(
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
        alert("Color added successfully!");
      } else {
        throw new Error("Failed to add color");
      }
    } catch (error) {
      console.error("Error adding color:", error);
      alert("Error adding color");
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
            <span>Back</span>
          </button>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="px-6 bg-transparent"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 w-full">
          <div className="flex-1 bg-card rounded-xl border shadow-sm p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              Product Information
            </h2>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="flex-1">
                  <Label
                    htmlFor="productName"
                    className="text-sm font-medium text-foreground mb-2 block"
                  >
                    Product Name
                  </Label>
                  <input
                    id="productName"
                    {...register("ProductName")}
                    type="text"
                    placeholder="Enter product name"
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
                    placeholder="Code"
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
                  Main Description
                </Label>
                <textarea
                  id="description"
                  {...register("Description")}
                  placeholder="Main product description"
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

              {/* Description Options Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-foreground">
                    Additional Options
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {descriptionOptions.length} options
                  </span>
                </div>

                {/* Add new option inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-secondary/5 rounded-lg border">
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
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Display description options */}
                {descriptionOptions.length > 0 && (
                  <div className="space-y-2">
                    {descriptionOptions.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-card rounded-lg border group hover:border-primary/30 transition-colors"
                      >
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <span className="text-sm font-medium text-foreground">
                              {option.name}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">
                              {option.value}
                            </span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDescriptionOption(index)}
                          className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive transition-all"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Subcategory
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
                        <SelectValue placeholder="Select subcategory" />
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
                    Brand
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
                        <SelectValue placeholder="Select brand" />
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
              </div>
            </div>
          </div>

          <div className="w-full xl:w-[400px] space-y-6">
            <div className="bg-card rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground">Colors</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowColorModal(true)}
                    className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Create
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
                Images
              </h3>
              <div className="relative border-2 border-dashed border-border hover:border-primary/50 rounded-lg p-8 flex flex-col items-center justify-center transition-colors cursor-pointer group">
                <File className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
                <p className="text-muted-foreground text-sm text-center mb-1">
                  Click to upload or drag files
                </p>
                <p className="text-muted-foreground text-xs text-center">
                  PNG, JPG, GIF up to 10MB
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
                    Selected images ({selectedImages.length}):
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
            <DialogTitle className="text-foreground">Add New Color</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-3">
              <Label
                htmlFor="color-picker"
                className="text-sm font-medium text-foreground"
              >
                Select Color
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
                    placeholder="Or enter color name"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    disabled={isAddingColor}
                    className={inputClass}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Select color from palette or enter color name
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
              Cancel
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
                  Adding...
                </>
              ) : (
                "Add"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailPr;
