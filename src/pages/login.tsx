"use client";

import { Input } from "@/components/ui/input";
import { Request } from "@/utils/config";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
interface JwtPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  [key: string]: any;
}

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function login(userName: string, password: string) {
    setIsLoading(true);
    try {
      const res = await Request.post(`Account/login`, { userName, password });
      if (res.data.data) {
        const token = res.data.data;
        try {
          const decodedToken = jwtDecode<JwtPayload>(token);
          const role =
            decodedToken[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];
          if (role.includes("Admin") || role.includes("SuperAdmin")) {
            localStorage.setItem("accessToken", token);
            toast("Вход выполнен успешно");
            navigate("/");
          } else {
            toast("У вас нет прав администратора для доступа к этой панели.");
            return;
          }
        } catch (err) {
          console.error("Недействительный токен", err);
          toast({
            title: "Ошибка входа",
            description:
              "Получен недействительный токен. Пожалуйста, попробуйте снова.",
            variant: "destructive",
          });
          return;
        }
      } else {
        toast({
          title: "Ошибка входа",
          description: "Неверное имя пользователя или пароль.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Ошибка входа:", error);
      toast({
        title: "Ошибка входа",
        description:
          "Произошла ошибка при входе. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const hadnleSubmit = (e: any) => {
    e.preventDefault();
    const userName = e.target["userName"].value;
    const password = e.target["password"].value;

    if (!userName || !password) {
      toast({
        title: "Недостаточно информации",
        description: "Пожалуйста, введите имя пользователя и пароль.",
        variant: "destructive",
      });
      return;
    }

    login(userName, password);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const role =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      if (role.includes("Admin") || role.includes("SuperAdmin")) {
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap ">
        <div className="xl:w-[50%] sm:w-[100%] xl:block sm:hidden    xl:min-h-screen sm:h-[50vh]  flex items-center  bg-gradient-to-r from-[#4c6085] to-[#1C2536]  via-[#1C2536] ">
          <div className="ml-[7%] mt-[260px] ">
            <p className="text-white text-[26px] font-medium">
              Добро пожаловать в панель администратора
            </p>
            <span className="bg-gradient-to-b from-green-400 via-gray-400 to-blue-500 bg-clip-text text-transparent text-4xl font-bold ">
              SAREZ MOBILE
            </span>
          </div>
        </div>
        <div className="xl:w-[50%]  flex items-center justify-center sm:w-[90%] m-auto  mt-[160px] ">
          <form
            onSubmit={hadnleSubmit}
            className="xl:w-[60%] bg-white p-8 rounded-xl shadow-lg sm:w-[100%] "
          >
            <p className="text-4xl font-semibold mb-6 text-gray-800">Вход</p>
            <Input
              type="text"
              name="userName"
              disabled={isLoading}
              className={`w-full p-3 mb-4 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                isLoading ? "opacity-50" : ""
              }`}
              placeholder="Имя пользователя"
            />
            <Input
              type="password"
              name="password"
              disabled={isLoading}
              className={`w-full p-3 mb-4 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                isLoading ? "opacity-50" : ""
              }`}
              placeholder="Пароль"
            />
            <button
              type="button"
              disabled={isLoading}
              className={`w-full text-blue-600 bg-white py-3 rounded mb-4 hover:bg-blue-50 transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Забыли пароль?
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors flex items-center justify-center ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Вход...
                </>
              ) : (
                "Войти"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
