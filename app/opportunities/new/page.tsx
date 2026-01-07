import { MainNav } from '@/components/navigation/main-nav'
import { getAccounts } from '@/lib/actions/accounts'
import { OpportunityCreateForm } from '@/components/opportunities/opportunity-create-form'

export default async function NewOpportunityPage({
  searchParams,
}: {
  searchParams: { accountId?: string }
}) {
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

