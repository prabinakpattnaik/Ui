import { NavLink, useLocation } from "react-router-dom"
import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  Building2,
  Users,
  Network,
  Bot,
  Settings,
  Shield,
  Globe,
  ChevronDown,
  UserCog,
  CreditCard,
} from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { SxalableLogo } from "@/components/sxalable-logo"

type SidebarLinkItem = {
  icon: LucideIcon
  label: string
  href: string
}

const mainItems: SidebarLinkItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },

  // If you already added Organizations, change this line to:
  // { icon: Building2, label: "Organizations", href: "/organizations" },
  //{ icon: Building2, label: "Tenants", href: "/tenants" },

  { icon: Network, label: "SxR", href: "/routers" },
  { icon: Globe, label: "xWAN", href: "/topology" },
  { icon: Shield, label: "xSecurity", href: "/security" },
  { icon: Building2, label: "Organizations", href: "/organizations" },
  { icon: Bot, label: "Assistant", href: "/chat" },   
]

const adminItems: SidebarLinkItem[] = [
  { icon: UserCog, label: "IAM", href: "/users" },
  { icon: CreditCard, label: "Subscriptions", href: "/subscriptions" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export function Sidebar() {
  const location = useLocation()
  const adminActive = adminItems.some((i) => location.pathname.startsWith(i.href))

  const [adminOpen, setAdminOpen] = useState(adminActive)
  useEffect(() => {
    if (adminActive) setAdminOpen(true)
  }, [adminActive])

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background/60 backdrop-blur-md text-card-foreground transition-colors duration-500">
      <div className="flex h-14 items-center border-b px-4 gap-3">
        <SxalableLogo className="w-8 h-8" />
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Sxalable
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {mainItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                    "hover:bg-primary/5 hover:text-primary",
                    isActive ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={cn("h-4 w-4", isActive && "fill-primary/20")} />
                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}

          {/* Administration group */}
          <li className="pt-2">
            <button
              type="button"
              onClick={() => setAdminOpen((v) => !v)}
              aria-expanded={adminOpen}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                "hover:bg-primary/5 hover:text-primary",
                adminActive ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground"
              )}
            >
              <Settings className={cn("h-4 w-4", adminActive && "fill-primary/20")} />
              <span className="flex-1 text-left">Administration</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", adminOpen && "rotate-180")} />
            </button>

            {adminOpen && (
              <ul className="mt-1 space-y-1 pl-6">
                {adminItems.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                          "hover:bg-primary/5 hover:text-primary",
                          isActive ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={cn("h-4 w-4", isActive && "fill-primary/20")} />
                          {item.label}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>

      <div className="border-t p-4">
        <div className="text-xs text-muted-foreground">v1.0.0</div>
      </div>
    </div>
  )
}
