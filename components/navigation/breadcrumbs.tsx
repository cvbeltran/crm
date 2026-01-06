'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Auto-generate breadcrumbs from pathname if items not provided
  const breadcrumbs: BreadcrumbItem[] = items || (() => {
    const paths = pathname.split('/').filter(Boolean)
    const result: BreadcrumbItem[] = [{ label: 'Dashboard', href: '/' }]
    
    let currentPath = ''
    paths.forEach((path, index) => {
      currentPath += `/${path}`
      const isLast = index === paths.length - 1
      
      // Format label
      let label = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      // Handle IDs (UUIDs)
      if (path.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        label = 'Details'
      }
      
      result.push({
        label,
        href: isLast ? undefined : currentPath,
      })
    })
    
    return result
  })()

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1
        
        return (
          <div key={item.href || item.label} className="flex items-center">
            {index === 0 ? (
              <Link href={item.href || '/'} className="hover:text-foreground">
                <Home className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <ChevronRight className="h-4 w-4 mx-1" />
                {isLast ? (
                  <span className="text-foreground font-medium">{item.label}</span>
                ) : (
                  <Link href={item.href || '#'} className="hover:text-foreground">
                    {item.label}
                  </Link>
                )}
              </>
            )}
          </div>
        )
      })}
    </nav>
  )
}

