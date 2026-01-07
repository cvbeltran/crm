import { RevenueModelForm } from '@/components/settings/revenue-model-form'

export default async function NewRevenueModelPage() {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">New Revenue Model</h3>
      <RevenueModelForm />
    </div>
  )
}

