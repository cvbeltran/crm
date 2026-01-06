import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Truncates text to a specified length with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Truncates URLs to a specified length, preserving the domain
 */
export function truncateUrl(url: string, maxLength: number = 30): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
    const domain = urlObj.hostname.replace('www.', '')
    const path = urlObj.pathname + urlObj.search
    
    if (url.length <= maxLength) return url
    
    const domainLength = domain.length
    const availableLength = maxLength - domainLength - 3 // 3 for "..."
    
    if (availableLength < 0) {
      return truncate(domain, maxLength)
    }
    
    if (path.length <= availableLength) {
      return `${domain}${path}`
    }
    
    return `${domain}${path.slice(0, availableLength)}...`
  } catch {
    return truncate(url, maxLength)
  }
}

