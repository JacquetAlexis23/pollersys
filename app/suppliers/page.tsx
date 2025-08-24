import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SuppliersTable } from "@/components/suppliers/suppliers-table"
import { AddSupplierDialog } from "@/components/suppliers/add-supplier-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function SuppliersPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: suppliers, error: suppliersError } = await supabase
    .from("suppliers")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (suppliersError) {
    console.error("Error fetching suppliers:", suppliersError)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Proveedores</h1>
          <p className="text-muted-foreground">Gestiona la información de tus proveedores</p>
        </div>
        <AddSupplierDialog>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Proveedor
          </Button>
        </AddSupplierDialog>
      </div>
      <SuppliersTable suppliers={suppliers || []} />
    </div>
  )
}
