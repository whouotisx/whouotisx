'use client'

import { useMemo, useState } from 'react'
import { LoteTn, Pedido } from '@/lib/db/schema'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Package, ClipboardList } from 'lucide-react'
import { LotesList } from '@/components/lotes-list'
import { PedidosList } from '@/components/pedidos-list'

interface ConsultaViewProps {
  lotes: LoteTn[]
  pedidos: Pedido[]
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function ConsultaView({ lotes, pedidos }: ConsultaViewProps) {
  const [termo, setTermo] = useState('')

  const busca = normalize(termo.trim())

  const lotesFiltrados = useMemo(() => {
    if (!busca) return []
    return lotes.filter((l) =>
      normalize(
        [l.observacoes, l.numeroLote, l.produto, l.empresa]
          .filter(Boolean)
          .join(' '),
      ).includes(busca),
    )
  }, [lotes, busca])

  const pedidosFiltrados = useMemo(() => {
    if (!busca) return []
    return pedidos.filter((p) =>
      normalize(
        [p.observacoes, p.numeroPedido, p.cliente, p.produto, p.empresa]
          .filter(Boolean)
          .join(' '),
      ).includes(busca),
    )
  }, [pedidos, busca])

  const totalResultados = lotesFiltrados.length + pedidosFiltrados.length

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border/50 bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="consulta-termo">Buscar por observacao</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="consulta-termo"
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
              placeholder="Digite a observacao, numero, produto, cliente..."
              className="pl-9"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {busca
              ? `${totalResultados} resultado(s) encontrado(s)`
              : 'Pesquisa em lotes TN e pedidos pelo campo de observacao e demais dados.'}
          </p>
        </div>
      </div>

      {busca && (
        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">
                Lotes TN ({lotesFiltrados.length})
              </h2>
            </div>
            {lotesFiltrados.length > 0 ? (
              <LotesList lotes={lotesFiltrados} />
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum lote TN encontrado para esta busca.
              </p>
            )}
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">
                Pedidos ({pedidosFiltrados.length})
              </h2>
            </div>
            {pedidosFiltrados.length > 0 ? (
              <PedidosList pedidos={pedidosFiltrados} />
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum pedido encontrado para esta busca.
              </p>
            )}
          </section>
        </div>
      )}

      {!busca && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Search className="h-12 w-12 mb-4 opacity-50" />
          <p>Digite algo para consultar pela observacao</p>
        </div>
      )}
    </div>
  )
}
