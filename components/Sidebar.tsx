"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Heart,
  LayoutDashboard,
  CalendarDays,
  Users,
  UserCheck,
  Building,
  FileText,
  CreditCard,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Appointments", href: "/dashboard/appointments", icon: CalendarDays },
  { name: "Patients", href: "/dashboard/patients", icon: Users },
  { name: "Doctors", href: "/dashboard/doctors", icon: UserCheck },
  { name: "Wards", href: "/dashboard/wards", icon: Building },
  { name: "Medical History", href: "/dashboard/history", icon: FileText },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
]

type SidebarProps = {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export default function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    })
    router.push("/auth/login")
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 bg-white shadow-lg transform transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:inset-0
        ${isCollapsed ? "lg:w-20" : "lg:w-64"}
        w-64
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center p-6 border-b ${isCollapsed ? "justify-center" : "space-x-3"}`}>
            <div className="bg-green-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div className={isCollapsed ? "hidden" : ""}>
              <h1 className="text-lg font-bold text-gray-900">NewHope Hospital</h1>
              <p className="text-xs text-gray-600">Management System</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                className={`
                    flex items-center rounded-lg text-sm font-medium transition-colors
                    ${isCollapsed ? "justify-center px-2 py-3" : "space-x-3 px-3 py-2"}
                    ${
                      isActive
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <span className={isCollapsed ? "hidden" : ""}>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <div className="space-y-2">
              <Button variant="outline" className={`w-full ${isCollapsed ? "justify-center px-2" : "justify-start"}`} onClick={handleLogout}>
                <LogOut className={isCollapsed ? "h-4 w-4" : "h-4 w-4 mr-2"} />
                <span className={isCollapsed ? "hidden" : ""}>Logout</span>
              </Button>
              <Button
                variant="ghost"
                className="hidden lg:flex w-full justify-center"
                onClick={onToggleCollapse}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
