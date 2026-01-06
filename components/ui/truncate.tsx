import * as React from 'react'
import { cn } from '@/lib/utils'

interface TruncateProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  maxLength?: number
  showTooltip?: boolean
}

export function Truncate({
  children,
  maxLength = 50,
  showTooltip = true,
  className,
  ...props
}: TruncateProps) {
  const text = String(children)
  const shouldTruncate = text.length > maxLength
  const truncatedText = shouldTruncate ? text.slice(0, maxLength) + '...' : text

  return (
    <span
      className={cn('inline-block', className)}
      title={showTooltip && shouldTruncate ? text : undefined}
      {...props}
    >
      {truncatedText}
    </span>
  )
}

