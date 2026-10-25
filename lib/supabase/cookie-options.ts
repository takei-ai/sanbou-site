import type { CookieOptionsWithName } from '@supabase/ssr'

// The v0 preview renders the app inside a cross-site iframe, where browsers only
// store and send cookies marked SameSite=None; Secure. Production keeps Lax.
export const supabaseCookieOptions: CookieOptionsWithName =
  process.env.NODE_ENV === 'production'
    ? { secure: true, sameSite: 'lax' }
    : { secure: true, sameSite: 'none' }
