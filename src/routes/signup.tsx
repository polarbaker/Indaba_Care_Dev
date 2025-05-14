import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { useMutation } from '../hooks/useMutation'
import { Auth } from '../components/Auth'
import { getSupabaseServerClient } from '../utils/supabase'

export const signupFn = createServerFn({ method: 'POST' })
  .validator(
    (d: { email: string; password: string; role: string; redirectUrl?: string }) => d,
  )
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient()
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })
    
    if (error) {
      return {
        error: true,
        message: error.message,
      }
    }
    
    // Create a profile record with the user's role
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            user_id: authData.user.id, 
            role: data.role 
          }
        ]);
      
      if (profileError) {
        return {
          error: true,
          message: `User created but profile setup failed: ${profileError.message}`,
        }
      }
    }

    // Redirect to the prev page stored in the "redirect" search param
    throw redirect({
      href: data.redirectUrl || '/',
    })
  })

export const Route = createFileRoute('/signup')({
  component: SignupComp,
})

function SignupComp() {
  const signupMutation = useMutation({
    fn: useServerFn(signupFn),
  })

  return (
    <Auth
      actionText="Sign Up"
      status={signupMutation.status}
      showRoleSelector={true}
      onSubmit={(e) => {
        const formData = new FormData(e.target as HTMLFormElement)

        signupMutation.mutate({
          data: {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            role: formData.get('role') as string,
          },
        })
      }}
      afterSubmit={
        signupMutation.data?.error ? (
          <>
            <div className="text-red-400">{signupMutation.data.message}</div>
          </>
        ) : null
      }
    />
  )
}