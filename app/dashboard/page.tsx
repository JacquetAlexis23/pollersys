import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Package, TrendingUp, Wallet, ShoppingCart } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch dashboard statistics
  const [suppliersResult, clientsResult, productsResult, salesResult] = await Promise.all([
    supabase.from("suppliers").select("id", { count: "exact" }).eq("user_id", user.id),
    supabase.from("clients").select("id", { count: "exact" }).eq("user_id", user.id),
    supabase.from("products").select("id", { count: "exact" }).eq("user_id", user.id),
    supabase.from("sales").select("total_amount").eq("user_id", user.id),
  ])

  const suppliersCount = suppliersResult.count || 0
  const clientsCount = clientsResult.count || 0
  const productsCount = productsResult.count || 0
  const totalSales = salesResult.data?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0

  const stats = [
    {
      title: "Proveedores",
      value: suppliersCount.toString(),
      description: "Proveedores registrados",
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: "Clientes",
      value: clientsCount.toString(),
      description: "Clientes activos",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Productos",
      value: productsCount.toString(),
      description: "Productos en catálogo",
      icon: Package,
      color: "text-purple-600",
    },
    {
      title: "Ventas Totales",
      value: `$${totalSales.toLocaleString()}`,
      description: "Ingresos acumulados",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general de tu negocio</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Acciones Rápidas</CardTitle>
            <CardDescription className="text-muted-foreground">Tareas comunes del día a día</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted cursor-pointer">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Registrar nueva compra</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted cursor-pointer">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Registrar nueva venta</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted cursor-pointer">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Actualizar inventario</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted cursor-pointer">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Registrar movimiento de caja</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Alertas</CardTitle>
            <CardDescription className="text-muted-foreground">Notificaciones importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No hay alertas pendientes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Actividad Reciente</CardTitle>
            <CardDescription className="text-muted-foreground">Últimas operaciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No hay actividad reciente</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
