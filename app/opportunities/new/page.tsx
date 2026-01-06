import { redirect } from 'next/navigation'
import { getSession, hasAnyRole } from '@/lib/auth'
import { MainNav } from '@/components/navigation/main-nav'
import { ROLES } from '@/lib/constants'
import { getAccounts } from '@/lib/actions/accounts'
import { OpportunityCreateForm } from '@/components/opportunities/opportunity-create-form'

export default async function NewOpportunityPage({
  searchParams,
}: {
  searchParams: { accountId?: string }
}) {
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
            <p className="text-destructive">You don't have permission to create opportunities.</p>
          </div>
        </div>
      </main>
    )
  }

  const { data: accounts } = await getAccounts()

  return (
    <main className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container mx-auto flex-1 p-4">
        <div className="py-8">
          <h2 className="text-3xl font-bold mb-4">New Opportunity</h2>
          <OpportunityCreateForm accounts={accounts || []} defaultAccountId={searchParams.accountId} />
        </div>
      </div>
    </main>
  )
}

