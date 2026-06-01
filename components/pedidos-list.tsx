'use client'

import { Pedido } from '@/lib/db/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2, ClipboardList } from 'lucide-react'
import { deletePedido, updatePedido } from '@/app/actions'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'

interface PedidosListProps {
  pedidos: Pedido[]
}

export function PedidosList({ pedidos }: PedidosListProps) {
  const [editingPedido, setEditingPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleDelete(id: number) {
    try {
      await deletePedido(id)
      toast.success('Pedido excluido com sucesso!')
    } catch {
      toast.error('Erro ao excluir pedido')
    }
  }

  async function handleUpdate(formData: FormData) {
    if (!editingPedido) return
    setLoading(true)
    try {
      await updatePedido(editingPedido.id, {
        numeroPedido: formData.get('numeroPedido') as string,
        empresa: formData.get('empresa') as string,
        cliente: formData.get('cliente') as string,
        produto: formData.get('produto') as string,
        observacoes: formData.get('observacoes') as string,
      })
      toast.success('Pedido atualizado com sucesso!')
      setEditingPedido(null)
    } catch {
      toast.error('Erro ao atualizar pedido')
    } finally {
      setLoading(false)
    }
  }

  if (pedidos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <ClipboardList className="h-12 w-12 mb-4 opacity-50" />
        <p>Nenhum pedido encontrado</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pedidos.map((pedido) => (
          <Card key={pedido.id} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-primary">
                {pedido.numeroPedido}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditingPedido(pedido)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Pedido</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este pedido? Esta acao
                          nao pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(pedido.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge
                variant="outline"
                className="bg-primary/20 text-primary border-primary/30"
              >
                {pedido.empresa}
              </Badge>
              {pedido.cliente && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Cliente:</span> {pedido.cliente}
                </p>
              )}
              {pedido.produto && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Produto:</span> {pedido.produto}
                </p>
              )}
              {pedido.observacoes && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {pedido.observacoes}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {pedido.dataPedido
                  ? new Date(pedido.dataPedido).toLocaleDateString('pt-BR')
                  : ''}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingPedido} onOpenChange={() => setEditingPedido(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Pedido</DialogTitle>
          </DialogHeader>
          {editingPedido && (
            <form action={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-numeroPedido">Numero do Pedido *</Label>
                  <Input
                    id="edit-numeroPedido"
                    name="numeroPedido"
                    defaultValue={editingPedido.numeroPedido}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-empresa">Empresa *</Label>
                  <Select name="empresa" defaultValue={editingPedido.empresa} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CARGILL">Cargill</SelectItem>
                      <SelectItem value="ADM">ADM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-cliente">Cliente</Label>
                  <Input
                    id="edit-cliente"
                    name="cliente"
                    defaultValue={editingPedido.cliente || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-produto">Produto</Label>
                  <Input
                    id="edit-produto"
                    name="produto"
                    defaultValue={editingPedido.produto || ''}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-quantidade">Quantidade</Label>
                  <Input
                    id="edit-quantidade"
                    name="quantidade"
                    type="number"
                    defaultValue={editingPedido.quantidade || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dataEntrega">Data de Entrega</Label>
                  <Input
                    id="edit-dataEntrega"
                    name="dataEntrega"
                    type="date"
                    defaultValue={
                      editingPedido.dataEntrega
                        ? new Date(editingPedido.dataEntrega).toISOString().split('T')[0]
                        : ''
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select name="status" defaultValue={editingPedido.status || 'PENDENTE'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                    <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
                    <SelectItem value="ENTREGUE">Entregue</SelectItem>
                    <SelectItem value="CANCELADO">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-observacoes">Observacoes</Label>
                <Textarea
                  id="edit-observacoes"
                  name="observacoes"
                  defaultValue={editingPedido.observacoes || ''}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingPedido(null)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
