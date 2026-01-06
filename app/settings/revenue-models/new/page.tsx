import { redirect } from 'next/navigation'
import { getSession, hasRole } from '@/lib/auth'
import { ROLES } from '@/lib/constants'
import { RevenueModelForm } from '@/components/settings/revenue-model-form'

export default async function NewRevenueModelPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  const isExecutive = await hasRole(ROLES.EXECUTIVE)
  
  if (!isExecutive) {
    redirect('/')
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">New Revenue Model</h3>
      <RevenueModelForm />
    </div>
  )
}

