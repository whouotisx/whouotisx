import { pgTable, serial, text, numeric, timestamp } from 'drizzle-orm/pg-core'

export const lotesTn = pgTable('lotes_tn', {
  id: serial('id').primaryKey(),
  numeroLote: text('numero_lote').notNull(),
  empresa: text('empresa').notNull(),
  produto: text('produto'),
  quantidade: numeric('quantidade'),
  dataEntrada: timestamp('data_entrada').defaultNow(),
  status: text('status').default('PENDENTE'),
  observacoes: text('observacoes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const pedidos = pgTable('pedidos', {
  id: serial('id').primaryKey(),
  numeroPedido: text('numero_pedido').notNull(),
  empresa: text('empresa').notNull(),
  cliente: text('cliente'),
  produto: text('produto'),
  quantidade: numeric('quantidade'),
  dataPedido: timestamp('data_pedido').defaultNow(),
  dataEntrega: timestamp('data_entrega'),
  status: text('status').default('PENDENTE'),
  observacoes: text('observacoes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type LoteTn = typeof lotesTn.$inferSelect
export type NewLoteTn = typeof lotesTn.$inferInsert
export type Pedido = typeof pedidos.$inferSelect
export type NewPedido = typeof pedidos.$inferInsert
