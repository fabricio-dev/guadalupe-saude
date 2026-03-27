"use client";
import {
  Building2,
  IdCard,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePermissions } from "@/hooks/use-permissions";
import { authClient, getResolvedAuthBaseURL } from "@/lib/auth-client";

// Menu items.
const baseItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    requiresAdmin: true,
  },

  {
    title: "Convênios",
    url: "/patients",
    icon: IdCard,
    requiresAdmin: true,
  },
  {
    title: "Vendedores",
    url: "/sellers",
    icon: Users,
    requiresAdmin: true,
  },
  {
    title: "Unidades",
    url: "/clinics",
    icon: Building2,
    requiresAdmin: true,
  },
  {
    title: "Relatórios",
    url: "/management",
    icon: Settings,
    requiresAdmin: true,
  },
  {
    title: "Admin",
    url: "/admin",
    icon: Shield,
    requiresAdmin: true,
  },

  //gestor
  {
    title: "Dashboard",
    url: "/gerente/dashboard-gestor",
    icon: LayoutDashboard,
    requiresGestor: true,
  },
  // {
  //   title: "Sua Unidade",
  //   url: "/gerente/clinics-gestor",
  //   icon: Building2,
  //   requiresGestor: true,
  // },
  {
    title: "Convênios",
    url: "/gerente/patients-gestor",
    icon: IdCard,
    requiresGestor: true,
  },
  {
    title: "Vendedores",
    url: "/gerente/sellers-gestor",
    icon: Users,
    requiresGestor: true,
  },

  //vendedor
  {
    title: "Dashboard",
    url: "/vendedor/dashboard-seller",
    icon: LayoutDashboard,
    requiresUser: true,
  },
  {
    title: "Convênios",
    url: "/vendedor/patients-seller",
    icon: IdCard,
    requiresUser: true,
  },
];

export function AppSidebar() {
  const session = authClient.useSession();
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  // const { isAdmin, userRole } = usePermissions(); mudei par o de baixo
  const { isAdmin, isGestor } = usePermissions();

  // Filtrar itens do menu baseado nas permissões do usuário
  const items = baseItems.filter((item) => {
    if (item.requiresAdmin) {
      return isAdmin;
    }
    if (item.requiresGestor) {
      return isGestor;
    }
    if (item.requiresUser) {
      return session.data?.user.role === "user";
    }
    return true;
  });

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await authClient.signOut();

      const base = getResolvedAuthBaseURL();
      const verify = await fetch(
        `${base}/api/auth/get-session?disableCookieCache=true`,
        {
          credentials: "include",
          headers: { accept: "application/json" },
        },
      );
      let stillLoggedIn = false;
      try {
        const body: unknown = await verify.json();
        stillLoggedIn =
          !!body &&
          typeof body === "object" &&
          "user" in body &&
          body.user != null;
      } catch {
        stillLoggedIn = false;
      }

      if (stillLoggedIn) {
        console.error("[logout] Sessão ainda ativa após signOut.", {
          clientBaseURL: base,
          browserOrigin: window.location.origin,
          getSessionStatus: verify.status,
          hint: "No painel do servidor (Vercel etc.), defina BETTER_AUTH_URL exatamente como na barra (ex.: https://www.guadalupesaude.com.br). Na aba Rede, confira POST /api/auth/sign-out: se for 403, era origem/CSRF (trustedOrigins + env alinhados devem corrigir).",
        });
        toast.error(
          "A sessão não foi encerrada. Confira no servidor se BETTER_AUTH_URL é exatamente a URL da barra de endereço (mesmo host, com ou sem www) e veja o console [logout] para detalhes.",
          { duration: 14_000 },
        );
        return;
      }

      window.location.assign("/authentication");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Não foi possível sair. Tente novamente.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleMenuItemClick = () => {
    // Fechar sidebar em mobile quando um item do menu for clicado
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b p-3">
        <Image
          src="/logo.png"
          alt="guadalupe Saúde Logo"
          width={200}
          height={150}
          className="h-auto w-full object-contain"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="hover:bg-sky-100 hover:text-sky-900"
                  >
                    <Link href={item.url} onClick={handleMenuItemClick}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-sky-50">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className="bg-sky-50 hover:bg-sky-100"
              >
                <SidebarMenuButton size="lg">
                  <Avatar>
                    <AvatarFallback className="bg-sky-200">
                      {session.data?.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col gap-0">
                    <p className="truncate text-xs font-medium">
                      {session.data?.user.name}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {session.data?.user.email}
                    </p>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  variant="destructive"
                  disabled={isLoggingOut}
                  onSelect={(event) => {
                    event.preventDefault();
                    void handleLogout();
                  }}
                >
                  <LogOut />
                  {isLoggingOut ? "Saindo..." : "Sair"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
