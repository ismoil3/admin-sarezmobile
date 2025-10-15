// components/AddImageModal.tsx
import { useState, useRef, useEffect } from "react";
import {
  useAddImageToProductMutation,
  useProdGetByIdQuery,
  useDeleteImageMutation,
} from "@/rtk/adminSl";
import { X, Upload, Image as ImageIcon, Package, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AddImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
}

interface ProductImage {
  id: number;
  images: string;
}

const AddImageModal = ({ isOpen, onClose, productId }: AddImageModalProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [
    addImageToProduct,
    {
      isLoading: isUploading,
      isError: isUploadError,
      isSuccess: isUploadSuccess,
    },
  ] = useAddImageToProductMutation();

  const [deleteImage, { isLoading: isDeleting }] = useDeleteImageMutation();

  // Fetch product data by ID
  const {
    data: productData,
    isLoading: isLoadingProduct,
    error,
    refetch: refetchProduct,
  } = useProdGetByIdQuery(productId, {
    skip: !productId || !isOpen,
  });

  const product = productData?.data;

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).filter(
      (file) =>
        file.type.startsWith("image/") &&
        !selectedFiles.some((f) => f.name === file.name && f.size === file.size)
    );

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteImage = async () => {
    if (!imageToDelete) return;

    try {
      await deleteImage(imageToDelete.id).unwrap();
      // Refetch product data to update the images list
      refetchProduct();
      setImageToDelete(null);
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    formData.append("ProductId", productId.toString());

    selectedFiles.forEach((file) => {
      formData.append("Files", file);
    });

    try {
      await addImageToProduct(formData).unwrap();
      // Refetch product data to show newly added images
      refetchProduct();
      setSelectedFiles([]);
    } catch (error) {
      console.error("Failed to upload images:", error);
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    onClose();
  };

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFiles([]);
    }
  }, [isOpen]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-4xl overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Управление изображениями товара
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 overflow-auto max-h-[80vh]"
          >
            {/* Product Info */}
            <Card>
              <CardContent className="p-4">
                {isLoadingProduct ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ) : error ? (
                  <Alert variant="destructive">
                    <AlertDescription>
                      Ошибка загрузки данных товара
                    </AlertDescription>
                  </Alert>
                ) : product ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {product.productName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        ID: {product.id}
                      </p>
                    </div>

                    {/* Existing Images */}
                    <div className="space-y-3">
                      <Label>
                        Существующие изображения ({product.images?.length || 0})
                      </Label>
                      {product.images && product.images.length > 0 ? (
                        <ScrollArea className="h-40">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pr-4">
                            {product.images.map(
                              (image: ProductImage, index: number) => (
                                <div key={image.id} className="relative group">
                                  <div className="aspect-square bg-muted rounded-lg overflow-hidden border">
                                    <img
                                      src={`https://api.sarezmobile.com/images/${image.images}`}
                                      alt={`${product.productName} ${
                                        index + 1
                                      }`}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.src =
                                          "https://th.bing.com/th/id/OIP.okPmaCJSAMclNwPBnDIfNQHaJb?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3";
                                      }}
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() =>
                                      setImageToDelete({
                                        id: image.id,
                                        name: image.images,
                                      })
                                    }
                                    disabled={isDeleting}
                                  >
                                    {isDeleting ? (
                                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <Trash2 className="w-3 h-3" />
                                    )}
                                  </Button>
                                  <p className="text-xs text-muted-foreground truncate mt-1">
                                    Изображение {index + 1}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="text-center py-8 border-2 border-dashed rounded-lg">
                          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">
                            Нет изображений
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <AlertDescription>Товар не найден</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* File Upload Area */}
            <div className="space-y-2">
              <Label>Добавить новые изображения</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />

                <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">
                  Перетащите изображения сюда
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  или нажмите для выбора файлов
                </p>
                <Button type="button" variant="outline">
                  Выбрать файлы
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  Поддерживаемые форматы: JPEG, PNG, WebP
                </p>
              </div>
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="space-y-3">
                <Label>Новые файлы для загрузки ({selectedFiles.length})</Label>
                <ScrollArea className="h-60">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pr-4">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden border">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Status Messages */}
            {isUploadError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Ошибка при загрузке изображений. Попробуйте еще раз.
                </AlertDescription>
              </Alert>
            )}

            {isUploadSuccess && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  Изображения успешно загружены!
                </AlertDescription>
              </Alert>
            )}

            {/* Footer */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Закрыть
              </Button>
              <Button
                type="submit"
                disabled={selectedFiles.length === 0 || isUploading || !product}
                className="flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Загрузить ({selectedFiles.length})
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!imageToDelete}
        onOpenChange={() => setImageToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить изображение?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить это изображение? Это действие
              нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteImage}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Удалить"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddImageModal;
