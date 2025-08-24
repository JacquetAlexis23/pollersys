import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StockTable } from "@/components/stock/stock-table"

export default async function StockPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch stock with product information
  const { data: stock, error: stockError } = await supabase
    .from("stock")
    .select(`
      *,
      products (
        id,
        name,
        category,
        unit_price,
        suppliers (
          name
        )
      )
    `)
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })

  if (stockError) {
    console.error("Error fetching stock:", stockError)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Inventario</h1>
        <p className="text-muted-foreground">Control de stock y niveles de inventario</p>
      </div>
      <StockTable stock={stock || []} />
    </div>
  )
}
