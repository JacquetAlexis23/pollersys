"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

interface DeleteProductDialogProps {
  product: ProductWithStock
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteProductDialog({ product, open, onOpenChange }: DeleteProductDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      const supabase = createClient()

      // Delete stock entries first (due to foreign key constraint)
      const { error: stockError } = await supabase.from("stock").delete().eq("product_id", product.id)
      if (stockError) throw stockError

      // Then delete the product
      const { error: productError } = await supabase.from("products").delete().eq("id", product.id)
      if (productError) throw productError

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error deleting product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-popover border-border">
        <DialogHeader>
          <DialogTitle className="text-popover-foreground">Eliminar Producto</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            ¿Estás seguro de que deseas eliminar el producto "{product.name}"? Esta acción eliminará también todos los
            registros de stock asociados y no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
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
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isLoading ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
