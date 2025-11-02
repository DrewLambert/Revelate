/**
 * Repository Index
 *
 * Central export point for all database repositories.
 * Import repositories using: import { serviceRepo, packageRepo } from '@/lib/db/repositories'
 */

// Services Repository
export * as serviceRepo from './services';
export type {
  Service,
  ServiceWithPackages,
  CreateServiceInput,
  UpdateServiceInput,
} from './services';

// Packages Repository
export * as packageRepo from './packages';
export type {
  Package,
  PackageWithServices,
  PackageWithAll,
  CreatePackageInput,
  UpdatePackageInput,
  PackageServiceInput,
} from './packages';

// Scoping Repository
export * as scopingRepo from './scoping';
export type {
  ScopingFactor,
  ScopingRule,
  CreateScopingFactorInput,
  UpdateScopingFactorInput,
  CreateScopingRuleInput,
  UpdateScopingRuleInput,
  ScopingInputs,
  ScopingCalculationResult,
} from './scoping';

// Quotes Repository
export * as quoteRepo from './quotes';
export type {
  Quote,
  QuoteWithPackage,
  CreateQuoteInput,
  UpdateQuoteInput,
} from './quotes';

// Audit Repository
export * as auditRepo from './audit';
export type { AdminAuditLog, LogAdminChangeInput } from './audit';
