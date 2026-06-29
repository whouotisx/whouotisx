'use client'

import { LoteTn } from '@/lib/db/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2, Package } from 'lucide-react'
import { deleteLoteTn, updateLoteTn } from '@/app/actions'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState, useOptimistic, useTransition } from 'react'

interface LotesListProps {
  lotes: LoteTn[]
}

export function LotesList({ lotes }: LotesListProps) {
  const [editingLote, setEditingLote] = useState<LoteTn | null>(null)
  const [, startTransition] = useTransition()
  const [optimisticLotes, setOptimisticLotes] = useOptimistic(lotes)

  function handleDelete(id: number) {
    startTransition(async () => {
      setOptimisticLotes((prev) => prev.filter((l) => l.id !== id))
      try {
        await deleteLoteTn(id)
        toast.success('Lote TN excluido com sucesso!')
      } catch {
        toast.error('Erro ao excluir lote TN')
      }
    })
  }

  function handleUpdate(formData: FormData) {
    if (!editingLote) return
    const id = editingLote.id
    const data = {
      numeroLote: formData.get('numeroLote') as string,
      empresa: formData.get('empresa') as string,
      produto: formData.get('produto') as string,
      observacoes: formData.get('observacoes') as string,
    }
    setEditingLote(null)
    startTransition(async () => {
      setOptimisticLotes((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...data } : l))
      )
      try {
        await updateLoteTn(id, data)
        toast.success('Lote TN atualizado com sucesso!')
      } catch {
        toast.error('Erro ao atualizar lote TN')
      }
    })
  }

  if (optimisticLotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Package className="h-12 w-12 mb-4 opacity-50" />
        <p>Nenhum lote TN encontrado</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {optimisticLotes.map((lote) => (
          <Card key={lote.id} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-primary">
                {lote.numeroLote}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditingLote(lote)}>
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
                        <AlertDialogTitle>Excluir Lote TN</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este lote TN? Esta acao
                          nao pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(lote.id)}
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
                className={lote.empresa === 'CARGILL' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}
              >
                {lote.empresa}
              </Badge>
              {lote.produto && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Produto:</span> {lote.produto}
                </p>
              )}
              {lote.observacoes && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {lote.observacoes}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {lote.dataEntrada
                  ? new Date(lote.dataEntrada).toLocaleDateString('pt-BR')
                  : ''}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingLote} onOpenChange={() => setEditingLote(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Lote TN</DialogTitle>
          </DialogHeader>
          {editingLote && (
            <form action={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-numeroLote">Numero do Lote *</Label>
                  <Input
                    id="edit-numeroLote"
                    name="numeroLote"
                    defaultValue={editingLote.numeroLote}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-empresa">Empresa *</Label>
                  <input
                    type="text"
                    id="edit-empresa"
                    name="empresa"
                    defaultValue={editingLote.empresa}
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-produto">Produto</Label>
                <Input
                  id="edit-produto"
                  name="produto"
                  defaultValue={editingLote.produto || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-observacoes">Observacoes</Label>
                <Textarea
                  id="edit-observacoes"
                  name="observacoes"
                  defaultValue={editingLote.observacoes || ''}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingLote(null)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
