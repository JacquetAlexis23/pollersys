import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ClientsTable } from "@/components/clients/clients-table"
import { AddClientDialog } from "@/components/clients/add-client-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function ClientsPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: clients, error: clientsError } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (clientsError) {
    console.error("Error fetching clients:", clientsError)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gestiona la información de tus clientes</p>
        </div>
        <AddClientDialog>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Cliente
          </Button>
        </AddClientDialog>
      </div>
      <ClientsTable clients={clients || []} />
    </div>
  )
}
