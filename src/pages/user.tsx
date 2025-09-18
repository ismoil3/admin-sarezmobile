import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useDelUserrolMutation,
  useSetRolUserMutation,
  useUserDeleteMutation,
  useUserGetQuery,
  useUserRegisMutation,
} from "@/rtk/adminSl";
import { Search, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const Users = () => {
  const [val, setVal] = useState("");

  const { data: dataUs, isLoading } = useUserGetQuery(val);
  const [delUs, { isLoading: loadinRoleDel }] = useUserDeleteMutation();
  const [EditRole, { isLoading: loadinRoleEdit }] = useSetRolUserMutation();
  const [regis] = useUserRegisMutation();
  const [rolUsDel] = useDelUserrolMutation();

  const inputRef = useRef<HTMLInputElement>(null);

  const [sel, setSel] = useState("");

  const [load, setLoad] = useState(null);
  const [loadDel, setLoadDel] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const todos = dataUs?.data || [];
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTodos = todos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(todos.length / itemsPerPage);

  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleRegis(e: any) {
    e.prevemtDefault();
    const obj = {
      userName: e.target["userName"].value,
      phoneNumber: e.target["phoneNumber"].value,
      email: e.target["email"].value,
      password: e.target["password"].value,
      confirmPassword: e.target["confirmPassword"].value,
    };

    regis(obj);
  }

  const [arr, setArr] = useState<number[]>([]);

  function checkDel() {
    arr.forEach((e) => {
      console.log(1);

      delUs(e);
    });
    setArr([]);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl xl:text-3xl font-semibold text-slate-900 dark:text-slate-100">
          Пользователи
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="px-5 py-2 xl:text-[15px] sm:text-[13px]  rounded-lg font-medium shadow-md border border-transparent bg-gradient-to-r from-blue-100/40 to-blue-200/30 dark:from-cyan-700/30 dark:to-cyan-600/20 hover:from-blue-200/50 hover:to-blue-300/40 dark:hover:from-cyan-600/40 dark:hover:to-cyan-500/30 hover:border-blue-300 dark:hover:border-cyan-500 transition-all duration-300 ease-in-out backdrop-blur-sm">
              + Добавить пользователя
              <kbd className="sm:hidden xl:inline "> ⌘Y </kbd>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Вы уверены?</DialogTitle>
              <form
                onSubmit={handleRegis}
                className="w-full max-w-md mx-auto  p-6 rounded-2xl shadow-sm backdrop-blur-md"
              >
                {/* Input fields */}
                <input
                  type="text"
                  placeholder="Имя пользователя"
                  name="userName"
                  className="w-full border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-900/30
               p-2.5 rounded-lg mt-3 focus:ring-2 focus:ring-blue-400 dark:focus:ring-cyan-500
               focus:border-transparent outline-none transition-all"
                />
                <input
                  type="text"
                  placeholder="Номер телефона"
                  name="phoneNumber"
                  className="w-full border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-900/30
               p-2.5 rounded-lg mt-3 focus:ring-2 focus:ring-blue-400 dark:focus:ring-cyan-500
               focus:border-transparent outline-none transition-all"
                />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  className="w-full border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-900/30
               p-2.5 rounded-lg mt-3 focus:ring-2 focus:ring-blue-400 dark:focus:ring-cyan-500
               focus:border-transparent outline-none transition-all"
                />
                <input
                  type="password"
                  placeholder="Пароль"
                  name="password"
                  className="w-full border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-900/30
               p-2.5 rounded-lg mt-3 focus:ring-2 focus:ring-blue-400 dark:focus:ring-cyan-500
               focus:border-transparent outline-none transition-all"
                />
                <input
                  type="password"
                  placeholder="Подтвердите пароль"
                  name="confirmPassword"
                  className="w-full border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-900/30
               p-2.5 rounded-lg mt-3 focus:ring-2 focus:ring-blue-400 dark:focus:ring-cyan-500
               focus:border-transparent outline-none transition-all"
                />

                <button
                  type="submit"
                  className="block px-3 !mt-4 w-[70%] m-auto text-[14px] py-2 rounded-lg font-medium  bg-gradient-to-r dark:from-cyan-700/20 dark:to-cyan-600/20  hover:text-cyan-400 from-blue-200/50 to-blue-300/40  dark:hover:from-cyan-600/40 dark:hover:to-cyan-500/20  border border-transparent hover:border-blue-300 dark:hover:border-cyan-500  transition-all duration-300 backdrop-blur-sm"
                >
                  Отправить
                </button>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
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
              onInput={(e: any) => setVal(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <Search className=" text-slate-500 dark:text-slate-400" />
          </div>
          <Select onValueChange={(val) => setSel(val)}>
            <SelectTrigger
              className="w-[180px] h-[44px] rounded-lg
                bg-gradient-to-r from-blue-50/50 to-blue-100/40
                dark:from-cyan-800/30 dark:to-cyan-700/20
                border border-transparent hover:border-blue-300 dark:hover:border-cyan-500
                shadow-sm hover:shadow-md text-slate-800 dark:text-slate-100
                transition-all duration-300 ease-in-out flex items-center justify-between px-3"
            >
              <SelectValue placeholder="Фильтр" />
            </SelectTrigger>

            <SelectContent
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700
                shadow-lg rounded-lg overflow-hidden backdrop-blur-sm"
            >
              <SelectItem value="all">Все</SelectItem>
              <SelectItem value="Admin">Админ</SelectItem>
              <SelectItem value="User">Пользователь</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => checkDel()}
            className="flex-1 sm:flex-none border border-slate-300 rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 transition"
          >
            <Trash className="w-5 h-5 mx-auto" />
          </button>
        </div>
      </div>

      <div
        className="overflow-x-auto w-full"
        style={{ scrollbarColor: "transparent transparent " }}
      >
        <table className="min-w-[700px] w-full border-collapse">
          <thead className="bg-gray-50 dark:bg-[#171227FF]">
            <tr>
              <th className="px-4 py-3 text-left text-sm sm:text-base font-medium text-gray-500">
                <div className="flex items-center gap-3">
                  <Checkbox />
                  Пользователи
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm sm:text-base font-medium text-gray-500">
                Дата
              </th>
              <th className="px-4 py-3 text-left text-sm sm:text-base font-medium text-gray-500">
                Статус оплаты
              </th>
              <th className="px-4 py-3 text-left text-sm sm:text-base font-medium text-gray-500">
                Номер
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
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      </td>
                    ))}
                  </tr>
                ))
              : currentTodos
                  .filter((e: any) => {
                    if (sel === "" || sel === "all") return true;
                    return e?.userRoles?.[0]?.name === sel;
                  })
                  .map((user: any) => (
                    <tr
                      key={user?.userId}
                      className="hover:bg-gradient-to-r hover:from-blue-100/30 hover:to-blue-200/20 dark:hover:from-cyan-600/30 dark:hover:to-cyan-500/20 transition-all duration-300 cursor-pointer"
                    >
                      <td className="px-4 py-3 flex items-center gap-2 min-w-[120px]">
                        <Checkbox
                          checked={arr.includes(user?.userId)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setArr((prev): any => [...prev, user?.userId]);
                            } else {
                              setArr((prev) =>
                                prev.filter((id) => id !== user?.userId)
                              );
                            }
                          }}
                        />
                        <img
                          src={`https://shop-api.softclub.tj/images/${user?.image}`}
                          alt="Аватар пользователя"
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://th.bing.com/th/id/R.4bc757d5050b5d90334ee3e6d3445829?rik=NHuVPhF9oaqCTQ&pid=ImgRaw&r=0";
                          }}
                        />
                        {user?.userName}
                      </td>
                      <td className="px-4 py-3 text-sm sm:text-base text-gray-700 dark:text-gray-200">
                        {user?.dob}
                      </td>
                      <td className="px-4 py-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        {["SuperAdmin", "Admin", "User"].map((roleName) => {
                          const hasRole = user?.userRoles.some(
                            (r: any) => r?.name === roleName
                          );

                          const handleRoleChange = () => {
                            if (roleName === "Admin") {
                              rolUsDel({
                                idUs: user?.userId,
                                rolUs: "34808f49-52e9-4fb7-9001-cf05800d608d",
                              });
                              EditRole({
                                Uid: user?.userId,
                                Rid: "82f1e62b-03ca-4d0e-a61a-e5398d8a67e1",
                              });
                            } else if (roleName === "User") {
                              rolUsDel({
                                idUs: user?.userId,
                                rolUs: "82f1e62b-03ca-4d0e-a61a-e5398d8a67e1",
                              });
                              EditRole({
                                Uid: user?.userId,
                                Rid: "34808f49-52e9-4fb7-9001-cf05800d608d",
                              });
                            } else if (roleName === "SuperAdmin") {
                            }

                            setLoad(`${user?.userId}-${roleName}` as any);
                          };
                          const buttonStyle = `px-3 xl:w-[100px] sm:w-[80px] text-[14px] py-1 rounded-lg font-medium   bg-gradient-to-r from-blue-100/30 to-blue-200/20 dark:from-cyan-700/30 dark:to-cyan-600/20   hover:text-cyan-400 hover:from-blue-200/50 hover:to-blue-300/30   dark:hover:from-cyan-600/40 dark:hover:to-cyan-500/20   border border-transparent hover:border-blue-300 dark:hover:border-cyan-500   sm:m-auto xl:m-0 transition-all duration-300 backdrop-blur-sm   ${
                            hasRole
                              ? "bg-green-200/30 dark:bg-green-600/30"
                              : ""
                          } `;

                          const isLoading =
                            loadinRoleEdit &&
                            load === `${user?.userId}-${roleName}`;

                          return (
                            <button
                              key={roleName}
                              onClick={handleRoleChange}
                              className={buttonStyle}
                            >
                              {isLoading ? (
                                <span className="w-4 h-4 border-2 border-gray-300 border-t-cyan-400 rounded-full animate-spin inline-block" />
                              ) : roleName === "Admin" ? (
                                "Админ"
                              ) : roleName === "User" ? (
                                "Пользователь"
                              ) : (
                                "СуперАдмин"
                              )}
                            </button>
                          );
                        })}
                      </td>

                      <td className="px-4 py-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        {user?.phoneNumber}
                      </td>
                      <td className="px-4 py-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        <button
                          onClick={() => {
                            delUs(user?.userId),
                              setLoadDel(user?.userId),
                              toast(`${user?.userName}`);
                          }}
                          className="flex-1 w-[36px] h-[36px] sm:flex-none border border-slate-300 rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 transition"
                        >
                          {loadinRoleDel && loadDel == user?.userId ? (
                            <span className="w-4 h-4 border-2 border-gray-300 border-t-cyan-400 rounded-full animate-spin inline-block" />
                          ) : (
                            <Trash className="w-5 h-5 mx-auto" />
                          )}
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

export default Users;
