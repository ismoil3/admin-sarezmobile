import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { jwtDecode } from "jwt-decode";
import { LogOut } from "lucide-react";
import * as React from "react";
import { useNavigate } from "react-router-dom";

interface DecodedToken {
  sub: string;
  name: string;
  email: string;
  role?: string;
  exp?: number;
  iat?: number;
}

export function VersionSwitcher() {
  const [decoded, setDecoded] = React.useState<DecodedToken | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      setDecoded(decodedToken);
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex items-center gap-3 p-2">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex w-10 h-10 items-center justify-center rounded-full shadow-md overflow-hidden">
                  {decoded?.sub ? (
                    <img
                      src={`https://api.sarezmobile.com/images/${decoded.sub}`}
                      alt={decoded?.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold">
                      {decoded?.name?.[0] || "?"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col leading-tight">
                  <span className="font-semibold text-sm text-foreground">
                    {decoded?.name || "Guest"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {decoded?.email || "No email"}
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-[200px] bg-white dark:bg-slate-900 shadow-lg rounded-xl border border-border/50 p-2"
          >
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-800 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
