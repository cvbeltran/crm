'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    // Use server-side logout route for proper cleanup
    const response = await fetch('/auth/signout', {
      method: 'POST',
    })
    
    if (response.ok) {
      router.push('/login')
      router.refresh()
    }
  }

  return (
    <Button variant="ghost" onClick={handleLogout}>
      Logout
    </Button>
  )
}

