import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProductsTable } from "@/components/products/products-table"
import { AddProductDialog } from "@/components/products/add-product-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function ProductsPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch products with supplier information and stock levels
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select(`
      *,
      suppliers (
        id,
        name
      ),
      stock (
        quantity,
        min_stock,
        max_stock,
        location
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch suppliers for the add product dialog
  const { data: suppliers, error: suppliersError } = await supabase
    .from("suppliers")
    .select("id, name")
    .eq("user_id", user.id)
    .order("name")

  if (productsError) {
    console.error("Error fetching products:", productsError)
  }

  if (suppliersError) {
    console.error("Error fetching suppliers:", suppliersError)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Productos</h1>
          <p className="text-muted-foreground">Gestiona tu catálogo de productos e inventario</p>
        </div>
        <AddProductDialog suppliers={suppliers || []}>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Producto
          </Button>
        </AddProductDialog>
      </div>
      <ProductsTable products={products || []} suppliers={suppliers || []} />
    </div>
  )
}
