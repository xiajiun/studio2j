export const runtime = 'edge'

import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'

// DELETE /api/admin/orders/:id — any of the 3 admins can delete an order.
// Uses the service client because the orders RLS policy only lets the shared account write.
// order_events rows are removed by ON DELETE CASCADE.
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  const id = Number(params.id)
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid order id' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id)
    .select('order_number')

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  if (!data || data.length === 0) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  return NextResponse.json({ deleted: data[0].order_number })
}
