"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Ward {
  _id?: string
  WardName: string
  TotalBeds: number
  AvailableBeds: number
  WardType: string
}

interface WardFormProps {
  ward?: Ward | null
  onClose: () => void
  onSuccess: () => void
}

const wardTypes = ["OPD", "ICU", "CCU", "Spl_Ward", "General_Ward", "Emergency"]

export default function WardForm({ ward, onClose, onSuccess }: WardFormProps) {
  const [formData, setFormData] = useState<Ward>({
    WardName: "",
    TotalBeds: 0,
    AvailableBeds: 0,
    WardType: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (ward) {
      setFormData(ward)
    }
  }, [ward])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = ward ? `/api/wards/${ward._id}` : "/api/wards"
      const method = ward ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: ward ? "Ward updated successfully" : "Ward added successfully",
        })
        onSuccess()
      } else {
        toast({
          title: "Error",
          description: data.message || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save ward",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{ward ? "Edit Ward" : "Add New Ward"}</CardTitle>
              <CardDescription>{ward ? "Update ward information" : "Enter ward details"}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wardName">Ward Name *</Label>
              <Select
                value={formData.WardName}
                onValueChange={(value) => setFormData({ ...formData, WardName: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ward name" />
                </SelectTrigger>
                <SelectContent>
                  {wardTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wardType">Ward Type *</Label>
              <Input
                id="wardType"
                value={formData.WardType}
                onChange={(e) => setFormData({ ...formData, WardType: e.target.value })}
                placeholder="e.g., Critical Care, General Medicine"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalBeds">Total Beds *</Label>
                <Input
                  id="totalBeds"
                  type="number"
                  min="1"
                  value={formData.TotalBeds}
                  onChange={(e) => {
                    const totalBeds = Number.parseInt(e.target.value) || 0
                    setFormData({
                      ...formData,
                      TotalBeds: totalBeds,
                      AvailableBeds: Math.min(formData.AvailableBeds, totalBeds),
                    })
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableBeds">Available Beds *</Label>
                <Input
                  id="availableBeds"
                  type="number"
                  min="0"
                  max={formData.TotalBeds}
                  value={formData.AvailableBeds}
                  onChange={(e) => setFormData({ ...formData, AvailableBeds: Number.parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? "Saving..." : ward ? "Update Ward" : "Add Ward"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
