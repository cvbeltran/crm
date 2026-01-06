'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search } from 'lucide-react'

interface SearchFilterProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchFilter({ value, onChange, placeholder = 'Search...' }: SearchFilterProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-8"
      />
    </div>
  )
}

