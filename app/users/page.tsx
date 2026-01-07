import { MainNav } from '@/components/navigation/main-nav'
import { UsersListClient } from '@/components/users/users-list-client'

export default async function UsersPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container mx-auto flex-1 p-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-muted-foreground mt-2">
              Manage user accounts
            </p>
          </div>
          <a
            href="/users/new"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create User
          </a>
        </div>
        <UsersListClient />
      </div>
    </main>
  )
}

