import { redirect } from 'next/navigation'
import { getSession, hasAnyRole } from '@/lib/auth'
import { MainNav } from '@/components/navigation/main-nav'
import { ROLES } from '@/lib/constants'
import { AccountCreateForm } from '@/components/accounts/account-create-form'

export default async function NewAccountPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  const canCreate = await hasAnyRole([ROLES.SALES, ROLES.EXECUTIVE])
  
  if (!canCreate) {
    return (
      <main className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container mx-auto flex-1 p-4">
          <div className="py-8">
            <p className="text-destructive">You don't have permission to create accounts.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container mx-auto flex-1 p-4">
        <div className="py-8">
          <h2 className="text-3xl font-bold mb-4">New Account</h2>
          <AccountCreateForm />
        </div>
      </div>
    </main>
  )
}

