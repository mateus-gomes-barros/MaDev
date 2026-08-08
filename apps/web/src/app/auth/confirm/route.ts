import {
  NextResponse,
  type NextRequest,
} from 'next/server'

import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
) {
  const code =
    request.nextUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()

    const { error } =
      await supabase.auth.exchangeCodeForSession(
        code,
      )

    if (!error) {
      return NextResponse.redirect(
        new URL('/', request.url),
      )
    }
  }

  const searchParams = new URLSearchParams({
    error:
      'Não foi possível confirmar seu e-mail. Solicite um novo link e tente novamente.',
  })

  return NextResponse.redirect(
    new URL(
      `/login?${searchParams.toString()}`,
      request.url,
    ),
  )
}
