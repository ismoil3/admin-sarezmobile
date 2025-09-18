import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "https://shop-api.softclub.tj";

export interface Product {
  id: number;
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
  image?: string;
  categoryName?: string;
  inventory?: number;
}

export interface UpdateProductRequest {
  Id: number;
  BrandId: number;
  ColorId: number;
  ProductName: string;
  Description: string;
  Quantity: number;
  Weight: string;
  Size: string;
  Code: string;
  Price: number;
  HasDiscount: boolean;
  DiscountPrice: number;
  SubCategoryId: number;
}

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProductById: builder.query<{ data: Product }, number>({
      query: (id) => `/Product/get-product-by-id?id=${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
    updateProduct: builder.mutation<any, UpdateProductRequest>({
      query: (product) => ({
        url: `/Product/update-product`,
        method: "PUT",
        params: {
          Id: product.Id,
          BrandId: product.BrandId,
          ColorId: product.ColorId,
          ProductName: product.ProductName,
          Description: product.Description,
          Quantity: product.Quantity,
          Weight: product.Weight,
          Size: product.Size,
          Code: product.Code,
          Price: product.Price,
          HasDiscount: product.HasDiscount,
          DiscountPrice: product.DiscountPrice,
          SubCategoryId: product.SubCategoryId,
        },
      }),
      invalidatesTags: (_result, _error, { Id }) => [
        { type: "Product", id: Id },
      ],
    }),
  }),
});

export const { useGetProductByIdQuery, useUpdateProductMutation } = productApi;
