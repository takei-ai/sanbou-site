import { requireAdmin } from '@/lib/auth'

const cell = (v: unknown) => {
  let s = String(v ?? '')
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`
  return `"${s.replace(/"/g, '""')}"`
}

export async function GET() {
  const { supabase } = await requireAdmin()
  const { data } = await supabase
    .from('profiles')
    .select('email, full_name, role, status, created_at')
    .order('created_at', { ascending: true })

  const lines = [
    ['メールアドレス', '氏名', '権限', '状態', '登録日時'].map(cell).join(','),
    ...(data ?? []).map((m) => [m.email, m.full_name, m.role, m.status, m.created_at].map(cell).join(',')),
  ]
  return new Response(`\uFEFF${lines.join('\r\n')}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="sanbou-members-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
