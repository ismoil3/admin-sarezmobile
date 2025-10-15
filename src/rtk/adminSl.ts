import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const admin = createApi({
  reducerPath: "admin",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.sarezmobile.com/",

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["User", "Prod", "Cate", "Brand", "SubCat", "Color"],
  endpoints: (builder) => ({
    adminGet: builder.query({
      query: () => ``,
    }),

    userGet: builder.query({
      query: () => `UserProfile/get-user-profiles?PageSize=1000`,
      providesTags: ["User"],
    }),

    prodGet: builder.query({
      query: () => `Product/get-products`,
      providesTags: ["Prod"],
    }),
    getCat: builder.query({
      query: () => `Category/get-categories`,
      providesTags: ["Cate"],
    }),
    getBrand: builder.query({
      query: () => `Brand/get-brands`,
      providesTags: ["Brand"],
    }),

    getSubCat: builder.query({
      query: () => `SubCategory/get-sub-category`,
      providesTags: ["SubCat"],
    }),

    setRolUser: builder.mutation({
      query: ({ Uid, Rid }) => ({
        url: `UserProfile/addrole-from-user?UserId=${Uid}&RoleId=${Rid}`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    delUserrol: builder.mutation({
      query: ({ idUs, rolUs }) => ({
        url: `UserProfile/remove-role-from-user?UserId=${idUs}&RoleId=${rolUs}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    UserDelete: builder.mutation({
      query: (id1) => ({
        url: `UserProfile/delete-user?id=${id1}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    ProdDel: builder.mutation({
      query: (id) => ({
        url: `Product/delete-product?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Prod"],
    }),

    UserRegis: builder.mutation({
      query: (obj) => ({
        url: `Account/register`,
        method: "POST",
        body: obj,
      }),
      invalidatesTags: ["User"],
    }),

    getCateg: builder.query({
      query: () => `Category/get-categories`,
    }),

    getColor: builder.query({
      query: () => `Color/get-colors`,
      providesTags: ["Color"],
    }),

    postProd: builder.mutation({
      query: (fd) => ({
        url: `Product/add-product`,
        method: "POST",
        body: fd,
      }),
      invalidatesTags: ["Prod"],
    }),

    addCategory: builder.mutation({
      query: (formData) => ({
        url: `Category/add-category`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Cate"],
    }),

    updateCategory: builder.mutation({
      query: (formData) => ({
        url: `Category/update-category`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Cate"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `Category/delete-category?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cate"],
    }),

    addBrand: builder.mutation({
      query: (brandData) => ({
        url: `Brand/add-brand?BrandName=${brandData.brandName}`,
        method: "POST",
        body: brandData,
      }),
      invalidatesTags: ["Brand"],
    }),

    updateBrand: builder.mutation({
      query: ({ id, brandName }) => ({
        url: `Brand/update-brand?Id=${id}&BrandName=${brandName}`,
        method: "PUT",
      }),
      invalidatesTags: ["Brand"],
    }),

    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `Brand/delete-brand?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),

    addSubCategory: builder.mutation({
      query: (subCatData) => ({
        url: `SubCategory/add-sub-category?CategoryId=${subCatData.categoryId}&SubCategoryName=${subCatData.subCategoryName}`,
        method: "POST",
        body: subCatData,
      }),
      invalidatesTags: ["SubCat"],
    }),
    addImageToProduct: builder.mutation({
      query: (formData: FormData) => ({
        url: `Product/add-image-to-product`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Prod"],
    }),

    updateSubCategory: builder.mutation({
      query: ({ id, categoryId, subCategoryName }) => ({
        url: `SubCategory/update-sub-category?Id=${id}&CategoryId=${categoryId}&SubCategoryName=${subCategoryName}`,
        method: "PUT",
        body: {
          id: id,
          categoryId: categoryId,
          subCategoryName: subCategoryName,
        },
      }),
      invalidatesTags: ["SubCat"],
    }),
    prodGetById: builder.query({
      query: (id: number) => `Product/get-product-by-id?id=${id}`,
      providesTags: ["Prod"],
    }),
    deleteImage: builder.mutation({
      query: (imageId: number) => ({
        url: `Product/delete-image-from-product?imageId=${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Prod"],
    }),
    deleteSubCategory: builder.mutation({
      query: (id) => ({
        url: `SubCategory/delete-sub-category?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubCat"],
    }),
  }),
});

export const {
  useAdminGetQuery,
  useUserGetQuery,
  useProdGetQuery,
  useGetCatQuery,
  useGetBrandQuery,
  useGetSubCatQuery,
  useSetRolUserMutation,
  useUserDeleteMutation,
  useProdDelMutation,
  useDelUserrolMutation,
  useUserRegisMutation,
  useGetCategQuery,
  useGetColorQuery,
  usePostProdMutation,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useAddBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useAddSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useAddImageToProductMutation,
  useDeleteImageMutation,
  useProdGetByIdQuery,
} = admin;
