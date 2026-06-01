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
import { createLoteTn } from '@/app/actions'
import { toast } from 'sonner'

interface LoteFormProps {
  empresaFilter?: string
}

export function LoteForm({ empresaFilter }: LoteFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      await createLoteTn({
        numeroLote: formData.get('numeroLote') as string,
        empresa: formData.get('empresa') as string,
        produto: formData.get('produto') as string,
        observacoes: formData.get('observacoes') as string,
      })
      toast.success('Lote TN criado com sucesso!')
      setOpen(false)
    } catch {
      toast.error('Erro ao criar lote TN')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Lote TN
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Lote TN</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroLote">Numero do Lote *</Label>
              <Input
                id="numeroLote"
                name="numeroLote"
                placeholder="Ex: TN-001"
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
                  <SelectItem value="CARGILL">Cargill</SelectItem>
                  <SelectItem value="ADM">ADM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="produto">Produto</Label>
            <Input id="produto" name="produto" placeholder="Ex: Soja" />
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
