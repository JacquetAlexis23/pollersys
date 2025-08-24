"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ProductWithStock {
  id: string
  name: string
  description?: string
  category?: string
  unit_price: number
  supplier_id: string
  user_id: string
  created_at: string
  updated_at: string
  suppliers: {
    id: string
    name: string
  }
  stock: Array<{
    quantity: number
    min_stock: number
    max_stock: number
    location?: string
  }>
}

interface StockDialogProps {
  product: ProductWithStock
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StockDialog({ product, open, onOpenChange }: StockDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    quantity: "",
    min_stock: "",
    max_stock: "",
    location: "",
  })
  const router = useRouter()

  useEffect(() => {
    if (product && product.stock[0]) {
      const stock = product.stock[0]
      setFormData({
        quantity: stock.quantity.toString(),
        min_stock: stock.min_stock.toString(),
        max_stock: stock.max_stock.toString(),
        location: stock.location || "",
      })
    }
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Usuario no autenticado")

      const stockData = {
        quantity: Number.parseInt(formData.quantity),
        min_stock: Number.parseInt(formData.min_stock),
        max_stock: Number.parseInt(formData.max_stock),
        location: formData.location || null,
        product_id: product.id,
        user_id: user.id,
      }

      // Check if stock entry exists
      if (product.stock.length > 0) {
        // Update existing stock
        const { error } = await supabase.from("stock").update(stockData).eq("product_id", product.id)
        if (error) throw error
      } else {
        // Create new stock entry
        const { error } = await supabase.from("stock").insert(stockData)
        if (error) throw error
      }

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating stock:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-popover border-border">
        <DialogHeader>
          <DialogTitle className="text-popover-foreground">Gestionar Stock</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Actualiza la información de inventario para "{product.name}"
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="quantity" className="text-popover-foreground">
                Cantidad Actual *
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                className="bg-input border-border"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="min_stock" className="text-popover-foreground">
                  Stock Mínimo *
                </Label>
                <Input
                  id="min_stock"
                  type="number"
                  min="0"
                  value={formData.min_stock}
                  onChange={(e) => setFormData({ ...formData, min_stock: e.target.value })}
                  required
                  className="bg-input border-border"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max_stock" className="text-popover-foreground">
                  Stock Máximo *
                </Label>
                <Input
                  id="max_stock"
                  type="number"
                  min="0"
                  value={formData.max_stock}
                  onChange={(e) => setFormData({ ...formData, max_stock: e.target.value })}
                  required
                  className="bg-input border-border"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location" className="text-popover-foreground">
                Ubicación
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ej: Almacén A, Estante 1"
                className="bg-input border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border text-popover-foreground"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? "Guardando..." : "Actualizar Stock"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
