import { createClient } from '@supabase/supabase-js'

// Service-role client. Import only from server actions / route handlers that have already verified an admin session.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}
