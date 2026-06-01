'use server'

import { db } from '@/lib/db'
import { lotesTn, pedidos } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

// Lotes TN Actions
export async function getLotesTn(empresa?: string) {
  if (empresa) {
    return db
      .select()
      .from(lotesTn)
      .where(eq(lotesTn.empresa, empresa))
      .orderBy(desc(lotesTn.createdAt))
  }
  return db.select().from(lotesTn).orderBy(desc(lotesTn.createdAt))
}

export async function createLoteTn(data: {
  numeroLote: string
  empresa: string
  produto?: string
  quantidade?: string
  status?: string
  observacoes?: string
}) {
  await db.insert(lotesTn).values({
    numeroLote: data.numeroLote,
    empresa: data.empresa,
    produto: data.produto || null,
    quantidade: data.quantidade || null,
    status: data.status || 'PENDENTE',
    observacoes: data.observacoes || null,
  })
  revalidatePath('/')
}

export async function updateLoteTn(
  id: number,
  data: {
    numeroLote?: string
    empresa?: string
    produto?: string
    quantidade?: string
    status?: string
    observacoes?: string
  }
) {
  await db
    .update(lotesTn)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(lotesTn.id, id))
  revalidatePath('/')
}

export async function deleteLoteTn(id: number) {
  await db.delete(lotesTn).where(eq(lotesTn.id, id))
  revalidatePath('/')
}

// Pedidos Actions
export async function getPedidos(empresa?: string) {
  if (empresa) {
    return db
      .select()
      .from(pedidos)
      .where(eq(pedidos.empresa, empresa))
      .orderBy(desc(pedidos.createdAt))
  }
  return db.select().from(pedidos).orderBy(desc(pedidos.createdAt))
}

export async function createPedido(data: {
  numeroPedido: string
  empresa: string
  cliente?: string
  produto?: string
  quantidade?: string
  dataEntrega?: Date
  status?: string
  observacoes?: string
}) {
  await db.insert(pedidos).values({
    numeroPedido: data.numeroPedido,
    empresa: data.empresa,
    cliente: data.cliente || null,
    produto: data.produto || null,
    quantidade: data.quantidade || null,
    dataEntrega: data.dataEntrega || null,
    status: data.status || 'PENDENTE',
    observacoes: data.observacoes || null,
  })
  revalidatePath('/')
}

export async function updatePedido(
  id: number,
  data: {
    numeroPedido?: string
    empresa?: string
    cliente?: string
    produto?: string
    quantidade?: string
    dataEntrega?: Date
    status?: string
    observacoes?: string
  }
) {
  await db
    .update(pedidos)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(pedidos.id, id))
  revalidatePath('/')
}

export async function deletePedido(id: number) {
  await db.delete(pedidos).where(eq(pedidos.id, id))
  revalidatePath('/')
}
