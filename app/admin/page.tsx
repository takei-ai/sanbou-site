import { Download } from 'lucide-react'
import { ActionForm, Field, inputClass, textareaClass } from '@/components/admin/action-form'
import { importMembersCsv, inviteMember, setMemberRole, setMemberStatus } from '@/app/admin/actions'
import { requireAdmin } from '@/lib/auth'
import { formatDate } from '@/lib/site'

export const metadata = { title: '会員管理' }

const STATUS_LABEL = { active: '有効', suspended: '停止中', withdrawn: '退会' } as const

export default async function AdminMembersPage() {
  const { supabase, profile: me } = await requireAdmin()
  const { data: members } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, status, created_at')
    .order('created_at', { ascending: false })

  const list = members ?? []
  const activeCount = list.filter((m) => m.status === 'active').length

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">会員管理</h1>
          <p className="mt-1 text-sm text-muted-foreground">{`登録 ${list.length}名 / 有効 ${activeCount}名`}</p>
        </div>
        <a href="/admin/members.csv" className="flex items-center gap-1.5 rounded-md border bg-background px-4 py-2 text-sm hover:bg-muted">
          <Download className="size-4" aria-hidden />
          会員一覧をCSV出力
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="invite" className="rounded-lg border bg-background p-6">
          <h2 id="invite" className="mb-1 font-bold">会員アカウントを発行</h2>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">入力したメールアドレスにパスワード設定用の招待メールが届きます。</p>
          <ActionForm action={inviteMember} submitLabel="招待メールを送る">
            <Field label="メールアドレス" htmlFor="inv-email">
              <input id="inv-email" name="email" type="email" required className={inputClass} />
            </Field>
            <Field label="氏名" htmlFor="inv-name">
              <input id="inv-name" name="full_name" className={inputClass} />
            </Field>
          </ActionForm>
        </section>

        <section aria-labelledby="csv" className="rounded-lg border bg-background p-6">
          <h2 id="csv" className="mb-1 font-bold">CSVで一括発行</h2>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{'1行に「メールアドレス,氏名」。ファイル選択か貼り付けのどちらかで登録できます（最大200件）。'}</p>
          <ActionForm action={importMembersCsv} submitLabel="一括で招待する">
            <Field label="CSVファイル" htmlFor="csv-file">
              <input id="csv-file" name="file" type="file" accept=".csv,text/csv" className="text-sm" />
            </Field>
            <Field label="または貼り付け" htmlFor="csv-text">
              <textarea id="csv-text" name="csv" placeholder={'taro@example.co.jp,山田 太郎\nhanako@example.co.jp,佐藤 花子'} className={textareaClass} />
            </Field>
          </ActionForm>
        </section>
      </div>

      <section aria-labelledby="list" className="overflow-hidden rounded-lg border bg-background">
        <h2 id="list" className="sr-only">会員一覧</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-muted text-left text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">氏名 / メール</th>
                <th scope="col" className="px-4 py-3 font-medium">登録日</th>
                <th scope="col" className="px-4 py-3 font-medium">権限</th>
                <th scope="col" className="px-4 py-3 font-medium">状態</th>
                <th scope="col" className="px-4 py-3 font-medium"><span className="sr-only">操作</span></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {list.map((m) => {
                const self = m.id === me.id
                return (
                  <tr key={m.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{m.full_name || '（未設定）'}</p>
                      <p className="text-muted-foreground">{m.email}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(m.created_at)}</td>
                    <td className="px-4 py-3">
                      {self ? (
                        '管理者（自分）'
                      ) : (
                        <form action={setMemberRole}>
                          <input type="hidden" name="id" value={m.id} />
                          <input type="hidden" name="role" value={m.role === 'admin' ? 'member' : 'admin'} />
                          <button type="submit" className="underline underline-offset-4">
                            {m.role === 'admin' ? '管理者 → 会員に戻す' : '会員 → 管理者にする'}
                          </button>
                        </form>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={m.status === 'active' ? 'font-medium' : 'font-medium text-destructive'}>
                        {STATUS_LABEL[m.status as keyof typeof STATUS_LABEL]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {self ? null : (
                        <form action={setMemberStatus} className="flex justify-end gap-2">
                          <input type="hidden" name="id" value={m.id} />
                          {m.status === 'active' ? (
                            <>
                              <button name="status" value="suspended" className="rounded border px-3 py-1.5 hover:bg-muted">停止</button>
                              <button name="status" value="withdrawn" className="rounded border px-3 py-1.5 text-destructive hover:bg-muted">退会処理</button>
                            </>
                          ) : (
                            <button name="status" value="active" className="rounded border px-3 py-1.5 hover:bg-muted">再開</button>
                          )}
                        </form>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
