import { redirect } from 'next/navigation'
import { getSession, hasRole } from '@/lib/auth'
import { ROLES } from '@/lib/constants'
import { RevenueStreamForm } from '@/components/settings/revenue-stream-form'

export default async function NewRevenueStreamPage() {
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
      <h3 className="text-xl font-semibold mb-6">New Revenue Stream</h3>
      <RevenueStreamForm />
    </div>
  )
}

