import { ICPCategoryForm } from '@/components/settings/icp-category-form'

export default async function NewICPCategoryPage() {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">New ICP Category</h3>
      <ICPCategoryForm />
    </div>
  )
}

