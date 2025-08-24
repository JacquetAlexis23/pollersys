"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search, Edit, Trash2, Package, AlertTriangle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EditProductDialog } from "./edit-product-dialog"
import { DeleteProductDialog } from "./delete-product-dialog"
import { StockDialog } from "./stock-dialog"

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

interface Supplier {
  id: string
  name: string
}

interface ProductsTableProps {
  products: ProductWithStock[]
  suppliers: Supplier[]
}

export function ProductsTable({ products, suppliers }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [editingProduct, setEditingProduct] = useState<ProductWithStock | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<ProductWithStock | null>(null)
  const [managingStock, setManagingStock] = useState<ProductWithStock | null>(null)

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.suppliers.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStockStatus = (product: ProductWithStock) => {
    const stock = product.stock[0]
    if (!stock) return { status: "Sin stock", color: "bg-gray-500", quantity: 0 }

    if (stock.quantity <= 0) return { status: "Agotado", color: "bg-red-500", quantity: stock.quantity }
    if (stock.quantity <= stock.min_stock) return { status: "Bajo", color: "bg-yellow-500", quantity: stock.quantity }
    return { status: "Normal", color: "bg-green-500", quantity: stock.quantity }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Catálogo de Productos</CardTitle>
        <CardDescription className="text-muted-foreground">{products.length} productos registrados</CardDescription>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-input border-border"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm ? "No se encontraron productos" : "No hay productos registrados"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-card-foreground">Producto</TableHead>
                <TableHead className="text-card-foreground">Proveedor</TableHead>
                <TableHead className="text-card-foreground">Precio</TableHead>
                <TableHead className="text-card-foreground">Stock</TableHead>
                <TableHead className="text-card-foreground">Estado</TableHead>
                <TableHead className="text-card-foreground w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product)
                return (
                  <TableRow key={product.id} className="border-border">
                    <TableCell className="font-medium text-foreground">
                      <div>
                        <div className="font-semibold">{product.name}</div>
                        {product.category && <div className="text-sm text-muted-foreground">{product.category}</div>}
                        {product.description && (
                          <div className="text-xs text-muted-foreground mt-1 max-w-xs truncate">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{product.suppliers.name}</TableCell>
                    <TableCell className="text-foreground font-medium">
                      ${product.unit_price.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-foreground">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>{stockStatus.quantity}</span>
                        {stockStatus.quantity <= (product.stock[0]?.min_stock || 0) && stockStatus.quantity > 0 && (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${stockStatus.color} text-white`}>{stockStatus.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuItem
                            onClick={() => setEditingProduct(product)}
                            className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setManagingStock(product)}
                            className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                          >
                            <Package className="mr-2 h-4 w-4" />
                            Gestionar Stock
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletingProduct(product)}
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {editingProduct && (
        <EditProductDialog
          product={editingProduct}
          suppliers={suppliers}
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
        />
      )}

      {deletingProduct && (
        <DeleteProductDialog
          product={deletingProduct}
          open={!!deletingProduct}
          onOpenChange={(open) => !open && setDeletingProduct(null)}
        />
      )}

      {managingStock && (
        <StockDialog
          product={managingStock}
          open={!!managingStock}
          onOpenChange={(open) => !open && setManagingStock(null)}
        />
      )}
    </Card>
  )
}
