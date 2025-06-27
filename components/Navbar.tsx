"use client"

import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search patients, doctors, wards..." className="pl-10 w-80" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
              3
            </Badge>
          </Button>

          <div className="flex items-center space-x-2">
            <div className="bg-green-600 p-2 rounded-full">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-medium">Dr. Admin</p>
              <p className="text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
