"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Package, AlertTriangle, CheckCircle } from "lucide-react"

interface StockWithProduct {
  id: string
  product_id: string
  quantity: number
  min_stock: number
  max_stock: number
  location?: string
  user_id: string
  updated_at: string
  products: {
    id: string
    name: string
    category?: string
    unit_price: number
    suppliers: {
      name: string
    }
  }
}

interface StockTableProps {
  stock: StockWithProduct[]
}

export function StockTable({ stock }: StockTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredStock = stock.filter(
    (item) =>
      item.products.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.products.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.products.suppliers.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStockStatus = (item: StockWithProduct) => {
    if (item.quantity <= 0) return { status: "Agotado", color: "bg-red-500", icon: AlertTriangle }
    if (item.quantity <= item.min_stock) return { status: "Bajo", color: "bg-yellow-500", icon: AlertTriangle }
    if (item.quantity >= item.max_stock) return { status: "Exceso", color: "bg-blue-500", icon: Package }
    return { status: "Normal", color: "bg-green-500", icon: CheckCircle }
  }

  const lowStockItems = stock.filter((item) => item.quantity <= item.min_stock && item.quantity > 0)
  const outOfStockItems = stock.filter((item) => item.quantity <= 0)

  return (
    <div className="space-y-6">
      {/* Stock Alerts */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {outOfStockItems.length > 0 && (
            <Card className="bg-card border-border border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Productos Agotados
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {outOfStockItems.length} productos sin stock
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {outOfStockItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="text-sm text-foreground">
                      • {item.products.name}
                    </div>
                  ))}
                  {outOfStockItems.length > 3 && (
                    <div className="text-sm text-muted-foreground">y {outOfStockItems.length - 3} productos más...</div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {lowStockItems.length > 0 && (
            <Card className="bg-card border-border border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-600 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Stock Bajo
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {lowStockItems.length} productos con stock bajo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStockItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="text-sm text-foreground">
                      • {item.products.name} ({item.quantity} unidades)
                    </div>
                  ))}
                  {lowStockItems.length > 3 && (
                    <div className="text-sm text-muted-foreground">y {lowStockItems.length - 3} productos más...</div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Stock Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Inventario General</CardTitle>
          <CardDescription className="text-muted-foreground">{stock.length} productos en inventario</CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar en inventario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-input border-border"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStock.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? "No se encontraron productos" : "No hay productos en inventario"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-card-foreground">Producto</TableHead>
                  <TableHead className="text-card-foreground">Proveedor</TableHead>
                  <TableHead className="text-card-foreground">Stock Actual</TableHead>
                  <TableHead className="text-card-foreground">Min/Max</TableHead>
                  <TableHead className="text-card-foreground">Ubicación</TableHead>
                  <TableHead className="text-card-foreground">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStock.map((item) => {
                  const stockStatus = getStockStatus(item)
                  const StatusIcon = stockStatus.icon
                  return (
                    <TableRow key={item.id} className="border-border">
                      <TableCell className="font-medium text-foreground">
                        <div>
                          <div className="font-semibold">{item.products.name}</div>
                          {item.products.category && (
                            <div className="text-sm text-muted-foreground">{item.products.category}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">{item.products.suppliers.name}</TableCell>
                      <TableCell className="text-foreground">
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{item.quantity}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">
                        <div className="text-sm">
                          <div>Min: {item.min_stock}</div>
                          <div>Max: {item.max_stock}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">{item.location || "-"}</TableCell>
                      <TableCell>
                        <Badge className={`${stockStatus.color} text-white flex items-center gap-1 w-fit`}>
                          <StatusIcon className="h-3 w-3" />
                          {stockStatus.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
