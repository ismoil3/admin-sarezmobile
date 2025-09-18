"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useProdDelMutation, useProdGetQuery } from "@/rtk/adminSl";
import { Delete, Pen, Search, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

const Products = () => {
  const { data: dataProd, isLoading } = useProdGetQuery({});
  const [currentPage, setCurrentPage] = useState(1);
  const [ProdDele] = useProdDelMutation();

  const todos = dataProd?.data?.products || [];
  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTodos = todos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(todos.length / itemsPerPage);

  const [arr, setArr] = useState<number[]>([]);

  function checkDel() {
    arr.forEach((e) => {
      console.log(1);

      ProdDele(e);
    });
    setArr([]);
  }
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const goToDetail = () => {
    navigate("/detail");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        goToDetail();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl xl:text-3xl font-semibold text-slate-900 dark:text-slate-100">
          Товары
        </h1>

        <button
          onClick={goToDetail}
          className="px-5 py-2 xl:text-[15px] sm:text-[13px] rounded-lg font-medium shadow-md border border-transparent bg-gradient-to-r from-blue-100/40 to-blue-200/30 dark:from-cyan-700/30 dark:to-cyan-600/20 hover:from-blue-200/50 hover:to-blue-300/40 dark:hover:from-cyan-600/40 dark:hover:to-cyan-500/30 hover:border-blue-300 dark:hover:border-cyan-500 transition-all duration-300 ease-in-out backdrop-blur-sm"
        >
          + Добавить товар
          <kbd className="sm:hidden xl:inline"> ⌘Y </kbd>
        </button>
      </div>

      <div className="flex xl:flex-row items-start xl:items-center justify-between gap-6">
        <div className="flex flex-wrap gap-4 xl:w-[50%] sm:w-[70%]">
          <div
            className="flex items-center flex-1 min-w-[220px] px-4 py-2 rounded-lg shadow-md
            bg-gradient-to-r from-blue-100/30 to-blue-200/20
            dark:from-cyan-700/30 dark:to-cyan-600/20
            hover:from-blue-200/50 hover:to-blue-300/30
            dark:hover:from-cyan-600/40 dark:hover:to-cyan-500/20
            border border-transparent hover:border-blue-300 dark:hover:border-cyan-500
            transition-all duration-300 backdrop-blur-sm"
          >
            <input
              type="text"
              placeholder="Поиск..."
              className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <Search className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none border border-slate-300 rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 transition">
            <Trash onClick={() => checkDel()} className="w-5 h-5 mx-auto" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-[700px] w-full border-collapse">
          <thead className="bg-gray-50 dark:bg-[#171227FF]">
            <tr>
              <th className="px-4 py-3 text-left text-sm sm:text-base font-medium text-gray-500">
                <div className="flex items-center gap-3">
                  <Checkbox />
                  Товар
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm sm:text-base font-medium text-gray-500">
                Инвентарь
              </th>
              <th className="px-4 py-3 text-left text-sm sm:text-base font-medium text-gray-500">
                Категория
              </th>
              <th className="px-4 py-3 text-left text-sm sm:text-base font-medium text-gray-500">
                Цена
              </th>
              <th className="px-4 py-3 text-left text-sm sm:text-base font-medium text-gray-500">
                Действие
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading
              ? Array.from({ length: itemsPerPage }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3 flex items-center gap-2 min-w-[120px]">
                      <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                    </td>

                    <td className="px-4 py-3 flex gap-2">
                      <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </td>
                  </tr>
                ))
              : currentTodos.map((prod: any) => (
                  <tr
                    key={prod?.id}
                    className="hover:bg-gradient-to-r hover:from-blue-100/30 hover:to-blue-200/20 dark:hover:from-cyan-600/30 dark:hover:to-cyan-500/20 transition-all duration-300 cursor-pointer"
                  >
                    <td className="px-4 py-3 flex items-center gap-2 min-w-[120px]">
                      <Checkbox
                        checked={arr.includes(prod?.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setArr((prev): any => [...prev, prod?.id]);
                          } else {
                            setArr((prev) =>
                              prev.filter((id) => id !== prod?.id)
                            );
                          }
                        }}
                      />

                      <img
                        src={`https://shop-api.softclub.tj/images/${prod?.image}`}
                        alt={prod?.productName}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://th.bing.com/th/id/OIP.okPmaCJSAMclNwPBnDIfNQHaJb?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3";
                        }}
                        className="w-10 h-10 rounded-full object-cover  bg-amber-100"
                      />
                      <span className="truncate max-w-[120px] text-sm sm:text-base font-medium text-gray-800 dark:text-gray-100">
                        {prod?.productName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm sm:text-base text-gray-700 dark:text-gray-200">
                      {prod?.inventory}
                    </td>
                    <td className="px-4 py-3 text-sm sm:text-base text-gray-800 dark:text-gray-100">
                      {prod?.categoryName}
                    </td>
                    <td className="px-4 py-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      {prod?.price}
                    </td>
                    <td className="px-4 py-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 flex gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        onClick={() => navigate(`/edit-product/${prod?.id}`)}
                      >
                        <Pen />
                      </button>
                      <button
                        className="text-red-600"
                        onClick={() => ProdDele(prod?.id)}
                      >
                        <Delete />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="relative">
        {totalPages > 1 && (
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 absolute xl:block sm:hidden left-16 top-8 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Назад
          </button>
        )}
        <div className="flex items-center justify-center">
          {totalPages > 1 && (
            <div
              className="mt-6 overflow-x-auto max-w-[900px] "
              style={{ scrollbarColor: "transparent transparent " }}
            >
              <div className="inline-flex  items-center gap-2 bg-gray-50 dark:bg-[#1a1a2e] rounded-lg p-2 shadow-md">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-lg transition
                      ${
                        currentPage === i + 1
                          ? "bg-blue-500 text-white dark:bg-cyan-500"
                          : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
          {totalPages > 1 && (
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 absolute right-20 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition xl:block sm:hidden "
            >
              Вперед
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
