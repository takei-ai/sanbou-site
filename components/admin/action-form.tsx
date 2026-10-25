'use client'

import { useActionState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import type { ActionState } from '@/app/admin/actions'

export function ActionForm({
  action,
  submitLabel,
  children,
  className,
}: {
  action: (state: ActionState, form: FormData) => Promise<ActionState>
  submitLabel: string
  children: React.ReactNode
  className?: string
}) {
  const [state, formAction, pending] = useActionState(action, undefined)
  const ref = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.ok) ref.current?.reset()
  }, [state])

  return (
    <form ref={ref} action={formAction} className={className ?? 'flex flex-col gap-4'}>
      {children}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending} className="h-10 bg-foreground px-5 text-background hover:bg-foreground/90">
          {pending ? '処理中…' : submitLabel}
        </Button>
        {state ? (
          <p role={state.ok ? 'status' : 'alert'} className={state.ok ? 'text-sm' : 'text-sm text-destructive'}>
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  )
}

export function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">{label}</label>
      {children}
    </div>
  )
}

export const inputClass =
  'h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
export const textareaClass =
  'min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
