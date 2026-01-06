import { redirect } from 'next/navigation'
import { getSession, getUserProfile } from '@/lib/auth'
import { MainNav } from '@/components/navigation/main-nav'
import { ProfileForm } from '@/components/profile/profile-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function ProfilePage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  const profile = await getUserProfile()

  if (!profile) {
    return (
      <main className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container mx-auto flex-1 p-4">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">Profile not found</p>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container mx-auto flex-1 p-4">
        <div className="py-8">
          <h2 className="text-3xl font-bold mb-6">Profile</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm profile={profile} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{profile.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <Badge variant="outline">{profile.role}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User ID</p>
                  <p className="text-xs font-mono text-muted-foreground">{profile.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                  <p>
                    {profile.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : '-'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

