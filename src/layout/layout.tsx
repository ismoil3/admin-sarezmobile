import { AppSidebar } from "@/components/app-sidebar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import useDarkSide from "@/pages/useDarkMode";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";


import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import { jwtDecode, type JwtPayload } from "jwt-decode";

const Layout = () => {
  const navigate = useNavigate();
  const [theme, toggleTheme]: any = useDarkSide();
  const [open, setOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  console.log(theme);

  useEffect(() => {
    let token = localStorage.getItem("accessToken");
    let decoded: any;

    if (token && typeof token === "string") {
      try {
        decoded = jwtDecode(token);
        console.log(decoded);
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("accessToken");
      }
    } else {
      console.log("No token found");
    }
  }, [navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/login");
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
        navigate("/login");
      }
    } catch (err) {
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
          <div className="w-full flex items-center justify-between xl:px-6 sm:px-3 py-3">
            <div className="flex  items-center xl:gap-10 sm:gap-1 ">
              <SidebarTrigger className="-ml-1" />
              <div
                className="bg-clip-text text-transparent font-semibold text-2xl
             from-green-400 via-gray-400 to-blue-500 bg-gradient-to-r animated-gradient"
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
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <div
                  className=" flex items-center gap-2 px-4 xl:py-2 sm:py-1.5 rounded-xl sm:w-[45%] xl:w-[35%] cursor-text bg-gradient-to-r from-blue-100/30 to-blue-200/20 dark:from-cyan-700/30 dark:to-cyan-600/20 shadow-md hover:shadow-lg hover:from-blue-200/40 hover:to-blue-300/30 dark:hover:from-cyan-600/40 dark:hover:to-cyan-500/30 transition-all duration-300 ease-in-out backdrop-blur-sm border border-transparent hover:border-blue-300 dark:hover:border-cyan-500
  "
                >
                  <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search..."
                    readOnly
                    className="w-full bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
                  />
                  <kbd className="hidden md:inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-muted-foreground border w-[60px] ">
                    ⌘ K
                  </kbd>
                </div>
              </DialogTrigger>

              <DialogContent className="max-w-md mx-auto rounded-xl p-6 bg-white dark:bg-slate-900 shadow-lg border border-border/50">
                <div className="flex items-center justify-between mt-4 ">
                  <input
                    autoFocus
                    ref={inputRef}
                    className="w-full bg-transparent border-none outline-none text-base placeholder:text-muted-foreground"
                    type="text"
                    placeholder="Type to search..."
                  />
                  <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </div>
              </DialogContent>
            </Dialog>
            <div className="flex items-center gap-4">
              <AnimatedThemeToggler onClick={toggleTheme} />
            </div>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
