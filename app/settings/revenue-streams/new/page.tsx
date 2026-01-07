import { RevenueStreamForm } from '@/components/settings/revenue-stream-form'

export default async function NewRevenueStreamPage() {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">New Revenue Stream</h3>
      <RevenueStreamForm />
    </div>
  )
}

