import { Telescope, Github, ExternalLink, Scale, MessageCircle } from 'lucide-react'

function About() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-surface-dark dark:text-white">About</h2>
        <p className="mt-1 text-sm text-surface-dark/70 dark:text-white/70">
          Learn about PG Atlas and the data behind it
        </p>
      </div>

      {/* What is PG Atlas */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-white/5 dark:border-white/15">
        <div className="flex items-center gap-2 mb-3">
          <Telescope className="h-5 w-5 text-primary-500" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-surface-dark dark:text-white">What is PG Atlas?</h3>
        </div>
        <p className="text-sm text-surface-dark/70 dark:text-white/70 leading-relaxed">
          PG Atlas is the metrics backbone for the Stellar Community Fund (SCF) Public Goods dependency graph.
          It provides transparency into ecosystem health, project criticality, adoption signals, and contributor
          activity — helping voters, maintainers, and builders make data-driven decisions.
        </p>
      </section>

      {/* Data Sources */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-white/5 dark:border-white/15">
        <h3 className="text-sm font-semibold text-surface-dark dark:text-white mb-3">Data Sources</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'GitHub', icon: Github },
            { label: 'deps.dev', icon: ExternalLink },
            { label: 'OpenGrants', icon: ExternalLink },
            { label: 'PG Atlas', icon: Telescope },
          ].map((source) => (
            <span
              key={source.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-surface-dark/80 dark:border-white/15 dark:bg-white/5 dark:text-white/80"
            >
              <source.icon className="h-3 w-3" aria-hidden="true" />
              {source.label}
            </span>
          ))}
        </div>
      </section>

      {/* Open Source */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-white/5 dark:border-white/15">
        <div className="flex items-center gap-2 mb-3">
          <Scale className="h-5 w-5 text-primary-500" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-surface-dark dark:text-white">Open Source</h3>
        </div>
        <p className="text-sm text-surface-dark/70 dark:text-white/70 mb-3">
          Built as free open-source software under the Mozilla Public License 2.0.
        </p>
        <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
          MPL-2.0
        </span>
      </section>

      {/* Links */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-white/5 dark:border-white/15">
        <h3 className="text-sm font-semibold text-surface-dark dark:text-white mb-3">Links</h3>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/SCF-Public-Goods-Maintenance/pg-atlas-frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-surface-dark hover:bg-gray-50 transition-colors dark:border-white/15 dark:text-white dark:hover:bg-white/10"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            GitHub Repository
          </a>
          <a
            href="https://scf-public-goods-maintenance.github.io/pg-atlas/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-surface-dark hover:bg-gray-50 transition-colors dark:border-white/15 dark:text-white dark:hover:bg-white/10"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Documentation
          </a>
          <a
            href="https://discord.gg/stellardev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-surface-dark hover:bg-gray-50 transition-colors dark:border-white/15 dark:text-white dark:hover:bg-white/10"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Stellar Discord
          </a>
        </div>
      </section>

      {/* Built by */}
      <div className="text-xs text-surface-dark/50 dark:text-white/40">
        Built by the SCF Public Goods Maintenance Working Group
      </div>
    </div>
  )
}

export default About
