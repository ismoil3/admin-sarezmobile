import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Layout from "@/layout/layout";
import Login from "./pages/login";
import Products from "./pages/products";
import Other from "./pages/other";
import Users from "./pages/user";
import { lazy } from "react";
import EditProductPage from "./pages/productById";

const Details = lazy(() => import("@/pages/detailPr"));

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="login" element={<Login />} />

        <Route path="/" element={<Layout />}>
          <Route path="products" index element={<Products />} />
          <Route path="user" element={<Users />} />
          <Route path="other" element={<Other />} />
          <Route path="detail" element={<Details />} />
          <Route path="edit-product/:id" element={<EditProductPage />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Route>
      </>
    )
  );

  return (
    <div className="dark:bg-[#171717FF]">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
