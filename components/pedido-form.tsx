'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { createPedido } from '@/app/actions'
import { toast } from 'sonner'

interface PedidoFormProps {
  empresaFilter?: string
}

export function PedidoForm({ empresaFilter }: PedidoFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      await createPedido({
        numeroPedido: formData.get('numeroPedido') as string,
        empresa: formData.get('empresa') as string,
        cliente: formData.get('cliente') as string,
        produto: formData.get('produto') as string,
        observacoes: formData.get('observacoes') as string,
      })
      toast.success('Pedido criado com sucesso!')
      setOpen(false)
    } catch {
      toast.error('Erro ao criar pedido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Pedido
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Pedido</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroPedido">Numero do Pedido *</Label>
              <Input
                id="numeroPedido"
                name="numeroPedido"
                placeholder="Ex: PED-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa *</Label>
              <Select name="empresa" defaultValue={empresaFilter || ''} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COFCO">COFCO</SelectItem>
                  <SelectItem value="AGREX">AGREX</SelectItem>
                  <SelectItem value="CARGILL">Cargill</SelectItem>
                  <SelectItem value="ADM">ADM</SelectItem>
                  <SelectItem value="CJ">CJ</SelectItem>
                  <SelectItem value="CERES">CERES</SelectItem>
                  <SelectItem value="INPASA">Inpasa</SelectItem>
                  <SelectItem value="GALVANI">Galvani</SelectItem>
                  <SelectItem value="ATIVAAGRO">AtivaAgro</SelectItem>
                  <SelectItem value="NNC">NNC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Select name="cliente">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INPASA">Inpasa</SelectItem>
                  <SelectItem value="GALVANI">Galvani</SelectItem>
                  <SelectItem value="ATIVAAGRO">AtivaAgro</SelectItem>
                  <SelectItem value="NNC">NNC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="produto">Produto</Label>
              <Input id="produto" name="produto" placeholder="Ex: Soja" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observacoes</Label>
            <Textarea
              id="observacoes"
              name="observacoes"
              placeholder="Observacoes adicionais..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
