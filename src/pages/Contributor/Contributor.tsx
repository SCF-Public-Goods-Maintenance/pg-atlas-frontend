import { Link, useRouterState } from '@tanstack/react-router'
import { Breadcrumb } from '../../components/atoms/Breadcrumb'
import { Skeleton, SkeletonCard, SkeletonRow } from '../../components/atoms/Skeleton'
import { UserCircle, ArrowLeft } from 'lucide-react'

export default function Contributor() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const parts = pathname.split('/').filter(Boolean)
  const contributorId = parts[0] === 'contributors' ? parts[1] : undefined

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/' },
        { label: 'Contributors', href: '/contributors' },
        { label: `Contributor ${contributorId ?? '—'}` },
      ]} />
      <h2 className="text-2xl font-bold text-surface-dark dark:text-white">
        Contributor {contributorId ?? '—'}
      </h2>
      <p className="mt-1 text-sm text-surface-dark/70 dark:text-white/70">
        Contributor profile and activity overview
      </p>

      {/* Coming soon state with skeleton preview */}
      <div className="mt-6 space-y-4">
        {/* Profile header skeleton */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10">
              <UserCircle className="h-8 w-8 text-surface-dark/20 dark:text-white/15" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        </div>

        {/* Metric cards skeleton */}
        <div className="grid gap-4 sm:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Repo contributions skeleton */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
          <Skeleton className="h-4 w-40 mb-4" />
          <div className="space-y-2">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        </div>

        {/* Coming soon notice */}
        <div className="text-center py-4">
          <p className="text-sm text-surface-dark/40 dark:text-white/30">
            Detailed contributor data is coming soon
          </p>
          <Link
            to="/contributors"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to contributors
          </Link>
        </div>
      </div>
    </div>
  )
}
