import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import useDarkSide from "@/pages/useDarkMode";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import  {jwtDecode, type JwtPayload } from "jwt-decode";
import { Toaster } from "sonner";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [, toggleTheme]: any = useDarkSide();

  /** ----------------------------------------
   *  Auth + Role + Homepage Redirect
   * ---------------------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      // Logged-out → redirect to login
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded: any = jwtDecode<JwtPayload>(token);
      const role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const isExpired = decoded.exp * 1000 < Date.now();

      if (
        isExpired ||
        !(role.includes("Admin") || role.includes("SuperAdmin"))
      ) {
        localStorage.removeItem("accessToken");
        navigate("/login", { replace: true });
        return;
      }

      // Logged-in user on homepage → redirect to /products
      if (location.pathname === "/") {
        navigate("/products", { replace: true });
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("accessToken");
      navigate("/login", { replace: true });
    }
  }, [location.pathname, navigate]);



  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
          <div className="w-full flex items-center justify-between xl:px-6 sm:px-3 py-3">
            <div className="flex items-center xl:gap-10 sm:gap-1">
              <SidebarTrigger className="-ml-1" />
              <div
                className="bg-clip-text text-transparent font-semibold text-2xl from-green-400 via-gray-400 to-blue-500 bg-gradient-to-r animated-gradient"
                style={{
                  fontWeight: 700,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "'Poppins', sans-serif",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                SAREZ MOBILE
              </div>
            </div>

            <div className="flex items-center gap-4">
              <AnimatedThemeToggler onClick={toggleTheme} />
            </div>
          </div>
        </header>

        <main className="p-6">
          <Toaster />
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
