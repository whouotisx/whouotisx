import { getLotesTn, getPedidos } from './actions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoteForm } from '@/components/lote-form'
import { PedidoForm } from '@/components/pedido-form'
import { LotesList } from '@/components/lotes-list'
import { PedidosList } from '@/components/pedidos-list'
import { ConsultaView } from '@/components/consulta-view'
import { Package, ClipboardList, Building2, Search } from 'lucide-react'

export default async function Home() {
  const [lotes, pedidos] = await Promise.all([getLotesTn(), getPedidos()])

  const lotesCargill = lotes.filter((l) => l.empresa === 'CARGILL')
  const lotesAdm = lotes.filter((l) => l.empresa === 'ADM')

  const empresasPedidos = ['COFCO', 'AGREX', 'CARGILL', 'ADM', 'CJ', 'CERES']
  const pedidosPorEmpresa = (empresa: string) =>
    pedidos.filter((p) => p.empresa === empresa)

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/50 bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Sistema de Lotes TN e Pedidos</h1>
              <p className="text-sm text-muted-foreground">Gerenciamento Cargill e ADM</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="lotes" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="lotes" className="gap-2">
              <Package className="h-4 w-4" />
              Lotes TN
            </TabsTrigger>
            <TabsTrigger value="pedidos" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="consulta" className="gap-2">
              <Search className="h-4 w-4" />
              Consulta
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lotes" className="space-y-6">
            <Tabs defaultValue="todos" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="todos">
                    Todos ({lotes.length})
                  </TabsTrigger>
                  <TabsTrigger value="cargill" className="text-primary">
                    Cargill ({lotesCargill.length})
                  </TabsTrigger>
                  <TabsTrigger value="adm">
                    ADM ({lotesAdm.length})
                  </TabsTrigger>
                </TabsList>
                <LoteForm />
              </div>

              <TabsContent value="todos">
                <LotesList lotes={lotes} />
              </TabsContent>
              <TabsContent value="cargill">
                <LotesList lotes={lotesCargill} />
              </TabsContent>
              <TabsContent value="adm">
                <LotesList lotes={lotesAdm} />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="pedidos" className="space-y-6">
            <Tabs defaultValue="todos" className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <TabsList className="flex-wrap h-auto">
                  <TabsTrigger value="todos">
                    Todos ({pedidos.length})
                  </TabsTrigger>
                  {empresasPedidos.map((empresa) => (
                    <TabsTrigger key={empresa} value={empresa}>
                      {empresa} ({pedidosPorEmpresa(empresa).length})
                    </TabsTrigger>
                  ))}
                </TabsList>
                <PedidoForm />
              </div>

              <TabsContent value="todos">
                <PedidosList pedidos={pedidos} />
              </TabsContent>
              {empresasPedidos.map((empresa) => (
                <TabsContent key={empresa} value={empresa}>
                  <PedidosList pedidos={pedidosPorEmpresa(empresa)} />
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>

          <TabsContent value="consulta">
            <ConsultaView lotes={lotes} pedidos={pedidos} />
          </TabsContent>
        </Tabs>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border/50 bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{lotes.length}</p>
                <p className="text-sm text-muted-foreground">Total Lotes TN</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pedidos.length}</p>
                <p className="text-sm text-muted-foreground">Total Pedidos</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{lotesCargill.length}</p>
                <p className="text-sm text-muted-foreground">Lotes Cargill</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{lotesAdm.length}</p>
                <p className="text-sm text-muted-foreground">Lotes ADM</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
