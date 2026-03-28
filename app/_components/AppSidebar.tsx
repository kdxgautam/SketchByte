import React from "react";
import {
  SidebarSeparator,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Brush, LayoutDashboard, WalletCards, Code2, Library } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthContext } from "../provider";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const items = [
  {
    title: "Workspace",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Design",
    url: "/designs",
    icon: Brush,
  },
  {
    title: "Custom Templates",
    url: "/custom-templates",
    icon: Code2,
  },
  {
    title: "My Templates",
    url: "/my-templates",
    icon: Library,
  },
  {
    title: "Credit",
    url: "/credits",
    icon: WalletCards,
  },
];

export function AppSidebar() {
  const path = usePathname();
  const authContext = useAuthContext();
  const user = authContext.user;
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');

  const normalizedEmail = useMemo(() => user?.email?.trim().toLowerCase() ?? '', [user?.email]);

  useEffect(() => {
    if (!normalizedEmail) {
      setName('');
      setNickname('');
      return;
    }

    const loadNickname = async () => {
      try {
        const response = await axios.get(`/api/user?email=${encodeURIComponent(normalizedEmail)}`);
        setName(response.data?.name || '');
        setNickname(response.data?.nickname || '');
      } catch (error: any) {
        // If user record doesn't exist yet (fresh DB reset), create it and refetch.
        if (error?.response?.status === 404) {
          try {
            const created = await axios.post('/api/user', {
              userName: user?.displayName,
              userEmail: normalizedEmail,
            });

            setName(created.data?.name || user?.displayName || '');
            setNickname(created.data?.nickname || '');
            return;
          } catch (createError) {
            console.error('Failed to create user after 404:', createError);
          }
        }

        console.error('Failed to load nickname:', error);
      }
    };

    loadNickname();
  }, [normalizedEmail]);

  return (
    <Sidebar
      className="border-r border-[#4d4353]/20 bg-[#131313]/80 shadow-[20px_0_40px_rgba(0,0,0,0.4)] backdrop-blur-xl"
      style={
        {
          "--sidebar-background": "0 0% 7.5%",
          "--sidebar-foreground": "0 0% 88.6%",
          "--sidebar-border": "289 9% 29.2%",
          "--sidebar-accent": "0 0% 12.2%",
          "--sidebar-accent-foreground": "0 0% 88.6%",
        } as React.CSSProperties
      }
    >
      <SidebarHeader className="p-6 pb-4">
        <div>
          <h1 className="text-[2rem] font-black leading-none tracking-tight text-[#e0b6ff]">
            SketchByte
          </h1>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 pt-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 gap-1.5">
              {items.map((item) => {
                const active = path === item.url;

                return (
                  <Link
                    href={item.url}
                    key={item.url}
                    className={`group flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-all ${
                      active
                        ? "border-l-2 border-[#e0b6ff] bg-[#1f1f1f] font-bold text-[#e0b6ff]"
                        : "text-[#998d9e] hover:bg-[#1f1f1f] hover:text-[#c6c6c7]"
                    }`}
                  >
                    <item.icon className={`h-4 w-4 ${active ? "text-[#e0b6ff]" : "text-[#998d9e] group-hover:text-[#c6c6c7]"}`} />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 pt-2">
        <SidebarSeparator className="mx-0 mb-4 bg-[#4d4353]/20" />
        <div className="flex min-w-0 items-center gap-3 rounded-lg bg-[#131313] p-2.5">
          <div className="h-8 w-8 overflow-hidden rounded-md border border-[#e0b6ff]/20 bg-[#2a2a2a]">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="User avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-300">
                {user?.displayName?.[0] ?? "U"}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#e2e2e2]">
              {name || (user?.displayName ?? "Alex Rivera")}
            </p>
            <p className="truncate text-xs font-semibold text-[#e0b6ff]">
              {nickname || 'No nickname set'}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
