"use client";

import CrudModal from "@/components/crud-modal";
import DeleteConfirmation from "@/components/delete-confirmation";
import Toast from "@/components/toast-notification";
import { Button } from "@/components/ui/button";
import {
  useAddBrandMutation,
  useAddCategoryMutation,
  useAddSubCategoryMutation,
  useDeleteBrandMutation,
  useDeleteCategoryMutation,
  useDeleteSubCategoryMutation,
  useGetBrandQuery,
  useGetCatQuery,
  useGetSubCatQuery,
  useUpdateBrandMutation,
  useUpdateCategoryMutation,
  useUpdateSubCategoryMutation,
} from "@/rtk/adminSl";
import { Delete, Pencil, Plus, Search } from "lucide-react";
import { useState } from "react";

const AdminCrud = () => {
  const [click, setClick] = useState(0);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "category" as "category" | "brand" | "subcategory",
    mode: "add" as "add" | "edit",
    data: null as any,
  });
  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    type: "",
    id: null as number | null,
    name: "",
  });
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success" as "success" | "error" | "warning",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tabs = ["Категории", "Бренды", "Подкатегории"];

  const {
    data: catProd,
    isLoading: loadingCat,
    refetch: refetchCategories,
  } = useGetCatQuery({});
  const { data: catBran, isLoading: loadingBran } = useGetBrandQuery({});
  const { data: subCat, isLoading: loadingSub } = useGetSubCatQuery({});

  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [addBrand] = useAddBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();
  const [addSubCategory] = useAddSubCategoryMutation();
  const [updateSubCategory] = useUpdateSubCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  const showToast = (
    message: string,
    type: "success" | "error" | "warning"
  ) => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const openAddModal = (type: "category" | "brand" | "subcategory") => {
    setModalState({
      isOpen: true,
      type,
      mode: "add",
      data: null,
    });
  };

  const openEditModal = (
    type: "category" | "brand" | "subcategory",
    data: any
  ) => {
    setModalState({
      isOpen: true,
      type,
      mode: "edit",
      data,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: "category",
      mode: "add",
      data: null,
    });
  };

  const openDeleteConfirmation = (type: string, id: number, name: string) => {
    setDeleteState({
      isOpen: true,
      type,
      id,
      name,
    });
  };

  const closeDeleteConfirmation = () => {
    setDeleteState({
      isOpen: false,
      type: "",
      id: null,
      name: "",
    });
  };

  const handleCategorySubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const data = new FormData();

      if (modalState.mode === "add") {
        data.append("categoryName", formData.name);
        if (formData.image) {
          data.append("categoryImage", formData.image);
        }

        await addCategory(data).unwrap();
        showToast("Категория успешно добавлена!", "success");
      } else {
        data.append("Id", modalState.data.id.toString());
        data.append("categoryName", formData.name);
        if (formData.image) {
          data.append("categoryImage", formData.image);
        }

        console.log("[v0] Содержимое FormData для редактирования:", {
          id: modalState.data.id,
          name: formData.name,
          hasImage: !!formData.image,
        });

        await updateCategory(data).unwrap();
        showToast("Категория успешно обновлена!", "success");
      }

      refetchCategories();
    } catch (error: any) {
      console.error("Ошибка при отправке категории:", error);
      showToast(
        `Не удалось ${
          modalState.mode === "add" ? "добавить" : "обновить"
        } категорию: ${error.data?.errors?.[0] || error.message}`,
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteCategory(deleteState.id!).unwrap();
      closeDeleteConfirmation();
      showToast("Категория успешно удалена!", "success");
    } catch (error: any) {
      console.error("Ошибка при удалении категории:", error);
      showToast(
        `Не удалось удалить категорию: ${
          error.data?.errors?.[0] || error.message
        }`,
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBrandSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (modalState.mode === "add") {
        await addBrand({ brandName: formData.name }).unwrap();
        showToast("Бренд успешно добавлен!", "success");
      } else {
        await updateBrand({
          id: formData.id,
          brandName: formData.name,
        }).unwrap();
        showToast("Бренд успешно обновлен!", "success");
      }
    } catch (error: any) {
      console.error("Ошибка при отправке бренда:", error);
      showToast(
        `Не удалось ${
          modalState.mode === "add" ? "добавить" : "обновить"
        } бренд: ${error.data?.errors?.[0] || error.message}`,
        "error"
      );
      console.log(error?.data, "from brand");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBrandDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteBrand(deleteState.id!).unwrap();
      closeDeleteConfirmation();
      showToast("Бренд успешно удален!", "success");
    } catch (error: any) {
      console.error("Ошибка при удалении бренд:", error);
      showToast(
        `Не удалось удалить бренд: ${error.data?.errors?.[0] || error.message}`,
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubCategorySubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (modalState.mode === "add") {
        await addSubCategory({
          categoryId: Number.parseInt(formData.categoryId),
          subCategoryName: formData.name,
        }).unwrap();
        showToast("Подкатегория успешно добавлена!", "success");
      } else {
        console.log("[v0] Содержимое FormData для редактирования:", formData);

        await updateSubCategory({
          id: formData.id,
          categoryId: Number.parseInt(formData.categoryId),
          subCategoryName: formData.name,
        }).unwrap();
        showToast("Подкатегория успешно обновлена!", "success");
      }
    } catch (error: any) {
      console.error("Ошибка при отправке подкатегории:", error);
      showToast(
        `Не удалось ${
          modalState.mode === "add" ? "добавить" : "обновить"
        } подкатегорию: ${error.data?.errors?.[0] || error.message}`,
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubCategoryDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteSubCategory(deleteState.id!).unwrap();
      closeDeleteConfirmation();
      showToast("Подкатегория успешно удалена!", "success");
    } catch (error: any) {
      console.error("Ошибка при удалении подкатегории:", error);
      showToast(
        `Не удалось удалить подкатегорию: ${
          error.data?.errors?.[0] || error.message
        }`,
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col flex-wrap sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-2">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setClick(index)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-300 xl:text-[15px] sm:text-[13px]
                ${
                  click === index
                    ? "text-white bg-blue-600 dark:text-white dark:bg-cyan-600"
                    : "text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        <Button
          onClick={() => {
            const types: ("category" | "brand" | "subcategory")[] = [
              "category",
              "brand",
              "subcategory",
            ];
            openAddModal(types[click]);
          }}
          disabled={isSubmitting}
          className="px-5 py-2 xl:text-[15px] sm:text-[13px] rounded-lg font-medium shadow-md bg-blue-600 hover:bg-blue-700 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:text-white transition-all duration-300 ease-in-out disabled:opacity-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить {tabs[click].slice(0, -1)}
        </Button>
      </div>

      <div className="flex items-center w-full sm:w-[250px] px-4 py-2 rounded-lg shadow-md bg-gradient-to-r from-blue-100/30 to-blue-200/20 dark:from-cyan-700/30 dark:to-cyan-600/20 hover:from-blue-200/50 hover:to-blue-300/30 dark:hover:from-cyan-600/40 dark:hover:to-cyan-500/20 border border-transparent hover:border-blue-300 dark:hover:border-cyan-500 sm:m-auto xl:m-0 transition-all duration-300 backdrop-blur-sm">
        <input
          type="text"
          placeholder="Поиск..."
          className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
        <Search className="w-5 h-5 text-slate-500 dark:text-slate-400" />
      </div>

      {(loadingCat || loadingBran || loadingSub) && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      <div className="flex flex-wrap gap-7 mt-4 justify-between">
        {click === 0 &&
          catProd?.data?.map((cat: any) => (
            <div
              key={cat.id}
              className="w-[16%] min-w-[120px] p-3 border flex items-center justify-between gap-2 rounded-lg shadow hover:shadow-lg transition-all"
            >
              <div className="flex-1">
                <img
                  src={`https://api.sarezmobile.com/images/${cat.categoryImage}`}
                  alt={cat.categoryName || "Нет изображения"}
                  className="xl:w-[50px] xl:h-[60px] sm:w-[35px] sm:h-[30px] object-cover dark:invert mb-1 p-[2%] mx-auto"
                />
                <h1 className="xl:text-sm sm:text-[10px] font-medium text-center">
                  {cat.categoryName.slice(0, 17)}
                </h1>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => openEditModal("category", cat)}
                  disabled={isSubmitting}
                  className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                >
                  <Pencil className="sm:w-[17px] xl:w-auto" />
                </button>
                <button
                  onClick={() =>
                    openDeleteConfirmation("category", cat.id, cat.categoryName)
                  }
                  disabled={isSubmitting}
                  className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                >
                  <Delete className="sm:w-[17px] xl:w-auto" />
                </button>
              </div>
            </div>
          ))}

        {click === 1 && (
          <div className="w-full items-center flex justify-between flex-wrap gap-7">
            <div className="overflow-x-auto xl:w-[50%] sm:w-full flex-wrap border">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="!px-4 py-2 text-left">Бренд</th>
                    <th className="!px-4 py-2 text-end">Действие</th>
                  </tr>
                </thead>
                <tbody>
                  {catBran?.data?.map((brand: any) => (
                    <tr
                      key={brand.id}
                      className="bg-gradient-to-r hover:text-cyan-400 from-blue-100/30 to-blue-200/20 dark:from-cyan-700/30 dark:to-cyan-600/20 hover:from-blue-200/50 hover:to-blue-300/30 dark:hover:from-cyan-600/40 dark:hover:to-cyan-500/20 border border-transparent hover:border-blue-300 dark:hover:border-cyan-500 sm:m-auto xl:m-0 transition-all duration-300 backdrop-blur-sm"
                    >
                      <td className="!px-4 py-2">{brand.brandName}</td>
                      <td className="!px-4 py-2 flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal("brand", brand)}
                          disabled={isSubmitting}
                          className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            openDeleteConfirmation(
                              "brand",
                              brand.id,
                              brand.brandName
                            )
                          }
                          disabled={isSubmitting}
                          className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                        >
                          <Delete className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {click === 2 &&
          subCat?.data?.map((sub: any) => (
            <div
              key={sub.id}
              className="w-[16%] min-w-[120px] p-2 border flex flex-col items-center justify-between gap-2 rounded-lg shadow hover:shadow-lg transition-all"
            >
              <div className="flex-1 text-center">
                <h1 className="text-sm font-medium mb-2">
                  {sub.subCategoryName}
                </h1>
                <p className="text-xs text-gray-500">
                  Категория:{" "}
                  {catProd?.data?.find((cat: any) => cat.id === sub.categoryId)
                    ?.categoryName || "Неизвестно"}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openEditModal("subcategory", sub)}
                  disabled={isSubmitting}
                  className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    openDeleteConfirmation(
                      "subcategory",
                      sub.id,
                      sub.subCategoryName
                    )
                  }
                  disabled={isSubmitting}
                  className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                >
                  <Delete className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
      </div>

      <CrudModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={`${modalState.mode === "add" ? "Добавить" : "Редактировать"} ${
          modalState.type === "category"
            ? "категорию"
            : modalState.type === "brand"
            ? "бренд"
            : "подкатегорию"
        }`}
        type={modalState.type}
        mode={modalState.mode}
        initialData={modalState.data}
        onSubmit={
          modalState.type === "category"
            ? handleCategorySubmit
            : modalState.type === "brand"
            ? handleBrandSubmit
            : modalState.type === "subcategory"
            ? handleSubCategorySubmit
            : () => {}
        }
        categories={catProd?.data || []}
      />

      <DeleteConfirmation
        isOpen={deleteState.isOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={
          deleteState.type === "category"
            ? handleCategoryDelete
            : deleteState.type === "brand"
            ? handleBrandDelete
            : deleteState.type === "subcategory"
            ? handleSubCategoryDelete
            : () => {}
        }
        itemName={deleteState.name}
        itemType={deleteState.type}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default AdminCrud;
