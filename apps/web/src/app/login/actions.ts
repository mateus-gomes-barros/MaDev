'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

function loginUrl(
  type: 'error' | 'message',
  message: string,
) {
  const searchParams = new URLSearchParams({
    [type]: message,
  })

  return `/login?${searchParams.toString()}`
}

function getText(
  formData: FormData,
  field: string,
) {
  const value = formData.get(field)

  return typeof value === 'string'
    ? value.trim()
    : ''
}

export async function login(
  formData: FormData,
) {
  const email = getText(formData, 'email')
  const password = getText(formData, 'password')

  if (!email || !password) {
    redirect(
      loginUrl(
        'error',
        'Preencha o e-mail e a senha.',
      ),
    )
  }

  const supabase = await createClient()

  const { error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    })

  if (error) {
    redirect(
      loginUrl(
        'error',
        'E-mail ou senha inválidos.',
      ),
    )
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signUp(
  formData: FormData,
) {
  const email = getText(formData, 'email')
  const password = getText(formData, 'password')
  const passwordConfirmation = getText(
    formData,
    'passwordConfirmation',
  )

  if (!email || !password) {
    redirect(
      loginUrl(
        'error',
        'Preencha todos os campos do cadastro.',
      ),
    )
  }

  if (password.length < 8) {
    redirect(
      loginUrl(
        'error',
        'A senha deve ter pelo menos 8 caracteres.',
      ),
    )
  }

  if (password !== passwordConfirmation) {
    redirect(
      loginUrl(
        'error',
        'As senhas não coincidem.',
      ),
    )
  }

  const requestHeaders = await headers()
  const host =
    requestHeaders.get('x-forwarded-host') ??
    requestHeaders.get('host')
  const protocol =
    requestHeaders.get('x-forwarded-proto') ??
    'http'
  const origin =
    requestHeaders.get('origin') ??
    (host ? `${protocol}://${host}` : undefined)

  const supabase = await createClient()

  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,
      options: origin
        ? {
            emailRedirectTo:
              `${origin}/auth/confirm`,
          }
        : undefined,
    })

  if (error) {
    redirect(
      loginUrl(
        'error',
        'Não foi possível criar a conta. Verifique os dados e tente novamente.',
      ),
    )
  }

  if (data.session) {
    revalidatePath('/', 'layout')
    redirect('/')
  }

  redirect(
    loginUrl(
      'message',
      'Cadastro realizado. Verifique seu e-mail para confirmar a conta.',
    ),
  )
}
