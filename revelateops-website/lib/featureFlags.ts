/**
 * Feature Flags
 *
 * Simple feature flag system for toggling new features.
 * In production, consider using a service like LaunchDarkly, Split.io, or Vercel Edge Config.
 */

export const featureFlags = {
  /**
   * USE_DATABASE_SERVICES
   *
   * When enabled, services are fetched from the database API instead of hardcoded data.
   * This allows admins to manage services without deployments.
   *
   * Default: false (use hardcoded data for now)
   * To enable: Set NEXT_PUBLIC_USE_DATABASE_SERVICES=true in .env.local
   */
  useDatabaseServices: process.env.NEXT_PUBLIC_USE_DATABASE_SERVICES === 'true',

  /**
   * USE_DATABASE_PACKAGES
   *
   * When enabled, packages are fetched from the database API.
   */
  useDatabasePackages: process.env.NEXT_PUBLIC_USE_DATABASE_PACKAGES === 'true',

  /**
   * ENABLE_DYNAMIC_PRICING
   *
   * When enabled, uses scoping rules for dynamic pricing calculations.
   */
  enableDynamicPricing: process.env.NEXT_PUBLIC_ENABLE_DYNAMIC_PRICING === 'true',

  /**
   * ADMIN_PANEL_ENABLED
   *
   * When enabled, shows the admin panel link and allows admin access.
   */
  adminPanelEnabled: process.env.NEXT_PUBLIC_ADMIN_PANEL_ENABLED !== 'false', // Enabled by default

  /**
   * SHOW_AUDIT_LOGS
   *
   * When enabled, shows audit logs in the admin panel.
   */
  showAuditLogs: process.env.NEXT_PUBLIC_SHOW_AUDIT_LOGS !== 'false', // Enabled by default
} as const;

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof featureFlags): boolean {
  return featureFlags[feature];
}

/**
 * Get all feature flags (useful for debugging)
 */
export function getAllFeatureFlags() {
  return featureFlags;
}

/**
 * Log feature flags on app start (development only)
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Feature Flags:', featureFlags);
}
