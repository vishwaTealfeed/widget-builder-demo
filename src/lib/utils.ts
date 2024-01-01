import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import deepmerge from 'deepmerge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return ''
  }
  if (process.env.VERCEL_URL) {
    // SSR should use vercel url
    return `https://${process.env.VERCEL_URL}`
  }
  // dev SSR should use localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export function getUrl(path: string) {
  return `${getBaseUrl()}${path}`
}

export function merge<T>(source: any, target: any): T {
  return deepmerge(source, target, { arrayMerge: (sourceArray, targetArray) => targetArray })
}
