import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import type { BreadcrumbProps } from '../../types'

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1 text-sm text-surface-dark/50 dark:text-white/40">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li key={item.label} className="flex items-center gap-1">
              {idx > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
              {isLast || !item.href ? (
                <span className={isLast ? 'font-medium text-surface-dark dark:text-white' : ''}>
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="hover:text-primary-500 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
