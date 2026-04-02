import { Settings, Sun, Moon, Monitor } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-surface-dark dark:text-white">Settings</h2>
        <p className="mt-1 text-sm text-surface-dark/70 dark:text-white/70">
          Configure your application preferences
        </p>
      </div>

      {/* General */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-white/5 dark:border-white/15">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-primary-500" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-surface-dark dark:text-white">General</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-surface-dark dark:text-white">Theme</label>
            <p className="mt-1 text-xs text-surface-dark/60 dark:text-white/50">
              Choose your preferred appearance
            </p>
            <div className="mt-2 flex gap-2">
              {[
                { label: 'Light', icon: Sun },
                { label: 'Dark', icon: Moon },
                { label: 'System', icon: Monitor },
              ].map((option) => (
                <span
                  key={option.label}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-surface-dark/70 dark:border-white/15 dark:text-white/70"
                >
                  <option.icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {option.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* App Info */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-white/5 dark:border-white/15">
        <h3 className="text-sm font-semibold text-surface-dark dark:text-white mb-3">Application</h3>
        <div className="space-y-2 text-sm text-surface-dark/70 dark:text-white/70">
          <div className="flex justify-between">
            <span>Version</span>
            <span className="font-mono text-xs">0.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>License</span>
            <span className="text-xs">MPL-2.0</span>
          </div>
        </div>
      </section>
    </div>
  )
}
