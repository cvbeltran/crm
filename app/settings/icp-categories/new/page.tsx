import { redirect } from 'next/navigation'
import { getSession, hasRole } from '@/lib/auth'
import { ROLES } from '@/lib/constants'
import { ICPCategoryForm } from '@/components/settings/icp-category-form'

export default async function NewICPCategoryPage() {
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
      <h3 className="text-xl font-semibold mb-6">New ICP Category</h3>
      <ICPCategoryForm />
    </div>
  )
}

