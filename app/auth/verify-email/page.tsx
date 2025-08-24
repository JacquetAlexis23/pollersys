import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        <Card className="bg-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-card-foreground">Verifica tu Email</CardTitle>
            <CardDescription className="text-muted-foreground">Revisa tu bandeja de entrada</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Te hemos enviado un enlace de verificación a tu email. Haz clic en el enlace para activar tu cuenta y
              poder acceder al sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
