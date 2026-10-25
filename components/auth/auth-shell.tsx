import { Logo } from '@/components/site/site-header'

export function AuthShell({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-muted">
      <header className="flex h-16 items-center px-5">
        <Logo />
      </header>
      <main className="flex flex-1 items-start justify-center px-5 pb-16 pt-8 md:items-center md:pt-0">
        <div className="flex w-full max-w-sm flex-col gap-6 rounded-lg border bg-background p-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            {description ? <p className="text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
