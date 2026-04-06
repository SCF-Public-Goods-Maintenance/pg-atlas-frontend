import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Monitor,
  Hash,
  Scale,
} from "lucide-react";
import { useState } from "react";
import type { ThemePref } from "../../types";

export default function Settings() {
  const [themePref, setThemePref] = useState<ThemePref>(() => {
    const stored = localStorage.getItem("pg-atlas-theme");
    if (stored === "light" || stored === "dark") return stored;
    return "system";
  });

  const [numberFormat, setNumberFormat] = useState<"full" | "abbreviated">(
    "full",
  );

  const themeOptions = [
    { value: "light" as const, label: "Light", icon: Sun },
    { value: "dark" as const, label: "Dark", icon: Moon },
    { value: "system" as const, label: "System", icon: Monitor },
  ];

  const handleThemeChange = (pref: ThemePref) => {
    setThemePref(pref);
    if (pref === "system") {
      localStorage.removeItem("pg-atlas-theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      document.documentElement.classList.toggle("dark", prefersDark);
      document.body.classList.toggle("dark", prefersDark);
    } else {
      localStorage.setItem("pg-atlas-theme", pref);
      document.documentElement.classList.toggle("dark", pref === "dark");
      document.body.classList.toggle("dark", pref === "dark");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-surface-dark dark:text-white">
          Settings
        </h2>
        <p className="mt-1 text-sm text-surface-dark/70 dark:text-white/70">
          Configure your application preferences
        </p>
      </div>

      {/* Appearance */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
        <div className="flex items-center gap-2 mb-4">
          <SettingsIcon
            className="h-4 w-4 text-primary-500"
            aria-hidden="true"
          />
          <h3 className="text-sm font-semibold text-surface-dark dark:text-white">
            Appearance
          </h3>
        </div>

        <div>
          <label className="text-xs font-medium text-surface-dark/60 dark:text-white/50">
            Theme
          </label>
          <div className="mt-2 flex gap-2">
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = themePref === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleThemeChange(opt.value)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300 dark:border-primary-500/40"
                      : "border-gray-200 text-surface-dark/60 hover:bg-gray-50 dark:border-white/15 dark:text-white/50 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Display */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
        <div className="flex items-center gap-2 mb-4">
          <Hash className="h-4 w-4 text-primary-500" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-surface-dark dark:text-white">
            Display
          </h3>
        </div>

        <div>
          <label className="text-xs font-medium text-surface-dark/60 dark:text-white/50">
            Number format
          </label>
          <div className="mt-2 flex gap-2">
            {[
              { value: "full" as const, label: "1,234,567" },
              { value: "abbreviated" as const, label: "1.2M" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setNumberFormat(opt.value)}
                className={`rounded-lg border px-3 py-2 text-xs font-mono transition-colors ${
                  numberFormat === opt.value
                    ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300 dark:border-primary-500/40"
                    : "border-gray-200 text-surface-dark/60 hover:bg-gray-50 dark:border-white/15 dark:text-white/50 dark:hover:bg-white/5"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
        <div className="flex items-center gap-2 mb-4">
          <Scale className="h-4 w-4 text-primary-500" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-surface-dark dark:text-white">
            About
          </h3>
        </div>

        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between text-surface-dark/70 dark:text-white/60">
            <span>Version</span>
            <span className="font-mono text-xs text-surface-dark dark:text-white">
              0.0.0
            </span>
          </div>
          <div className="flex justify-between text-surface-dark/70 dark:text-white/60">
            <span>License</span>
            <span className="text-xs text-surface-dark dark:text-white">
              MPL-2.0
            </span>
          </div>
          <div className="flex justify-between text-surface-dark/70 dark:text-white/60">
            <span>Data refresh</span>
            <span className="text-xs text-surface-dark/50 dark:text-white/40">
              Mock data
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
