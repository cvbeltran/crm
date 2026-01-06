import { redirect } from 'next/navigation'
import { getSession, hasRole } from '@/lib/auth'
import { ROLES } from '@/lib/constants'
import { UserCreateForm } from '@/components/users/user-create-form'

export default async function NewUserPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  const isAuthorized = await hasRole(ROLES.EXECUTIVE)
  if (!isAuthorized) {
    redirect('/')
  }

  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto flex-1 p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create New User</h1>
          <p className="text-muted-foreground mt-2">
            Create a user account manually. The user will be able to sign in immediately.
          </p>
        </div>
        <UserCreateForm />
      </div>
    </main>
  )
}

