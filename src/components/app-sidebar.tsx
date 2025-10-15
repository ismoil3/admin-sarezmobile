import * as React from "react";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      url: "#",
      items: [
        { title: "Пользователи", url: "/user" },
        { title: "Товары", url: "/products" },
        { title: "Другое", url: "/other" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation();

  return (
    <Sidebar
      {...props}
      className="
      w-[250px]
        bg-gradient-to-b from-white to-slate-50
        dark:from-slate-950 dark:to-slate-900
        text-slate-800 dark:text-slate-300
        border-r border-slate-200 dark:border-slate-800
        transition-colors duration-300
        z-50
      "
    >
      <SidebarHeader className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <VersionSwitcher />
      </SidebarHeader>

      <SidebarContent className="p-4">
        {data.navMain.map((group:any) => (
          <SidebarGroup key={group.title} className="mb-6">
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 w-full min-w-0">
                {group.items.map((item:any) => {
                  const isActive = item.url === pathname;
                  return (
                    <SidebarMenuItem key={item.title} className="min-w-0">
                      <SidebarMenuButton
                        size="md"
                        className={`
            w-full flex items-center truncate text-left px-3 py-2 text-sm font-normal
            rounded-lg transition-all duration-200
            ${
              isActive
                ? `bg-gradient-to-r from-blue-100/30 to-blue-200/20
                   dark:from-cyan-700/30 dark:to-cyan-600/20
                   text-blue-600 dark:text-cyan-400 font-medium
                   border border-transparent hover:border-blue-300 dark:hover:border-cyan-500`
                : `text-slate-700 dark:text-slate-300
                   hover:bg-gradient-to-r hover:from-blue-200/50 hover:to-blue-300/30
                   dark:hover:from-cyan-600/40 dark:hover:to-cyan-500/20
                   border border-transparent`
            }
          `}
                        asChild
                        isActive={isActive}
                      >
                        <Link
                          to={item.url}
                          className="flex w-full items-center truncate"
                        >
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail className="bg-slate-50  w-[13px]  dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 !cursor-pointer  " />
    </Sidebar>
  );
}
