import { MainNav } from '@/components/navigation/main-nav'
import { AccountCreateForm } from '@/components/accounts/account-create-form'

export default async function NewAccountPage() {
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

