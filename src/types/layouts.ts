import type React from "react";

export type Theme = "light" | "dark";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface NavSection {
  label?: string;
  items: NavItem[];
}
