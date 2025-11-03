import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';
import { logAdminChange } from './audit';

/**
 * Scoping Repository
 *
 * Handles scoping factors (quiz questions) and scoping rules (pricing/timeline logic).
 * Includes dynamic price/timeline calculation based on user inputs.
 */

export type ScopingFactor = Prisma.ScopingFactorGetPayload<{}>;
export type ScopingRule = Prisma.ScopingRuleGetPayload<{}>;

export interface CreateScopingFactorInput {
  packageId: string;
  factorKey: string;
  questionText: string;
  helpText?: string;
  inputType: 'select' | 'number' | 'boolean' | 'range';
  options?: Array<{ value: string; label: string }>;
  isRequired?: boolean;
  displayOrder?: number;
}

export interface UpdateScopingFactorInput {
  factorKey?: string;
  questionText?: string;
  helpText?: string;
  inputType?: 'select' | 'number' | 'boolean' | 'range';
  options?: Array<{ value: string; label: string }>;
  isRequired?: boolean;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CreateScopingRuleInput {
  packageId: string;
  ruleName: string;
  factorKey: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'in_range' | 'contains';
  conditionValue: Record<string, unknown>;
  priceAdjustmentType?: 'multiplier' | 'fixed_add' | 'fixed_subtract';
  priceAdjustmentValue?: number;
  timelineAdjustmentWeeks?: number;
  adjustmentLabel?: string;
  priority?: number;
}

export interface UpdateScopingRuleInput {
  ruleName?: string;
  factorKey?: string;
  operator?: 'equals' | 'greater_than' | 'less_than' | 'in_range' | 'contains';
  conditionValue?: Record<string, unknown>;
  priceAdjustmentType?: 'multiplier' | 'fixed_add' | 'fixed_subtract';
  priceAdjustmentValue?: number;
  timelineAdjustmentWeeks?: number;
  adjustmentLabel?: string;
  priority?: number;
  isActive?: boolean;
}

export interface ScopingInputs {
  [factorKey: string]: string | number | boolean;
}

export interface ScopingCalculationResult {
  basePrice: number;
  adjustedPrice: number;
  baseTimelineWeeks: number;
  adjustedTimelineWeeks: number;
  appliedRules: Array<{
    ruleName: string;
    adjustmentLabel?: string;
    priceAdjustment?: number;
    timelineAdjustment?: number;
  }>;
}

/**
 * Get scoping factors for a package
 */
export async function getScopingFactorsForPackage(
  packageId: string,
  activeOnly = true
): Promise<ScopingFactor[]> {
  const startTime = performance.now();

  try {
    const factors = await prisma.scopingFactor.findMany({
      where: {
        packageId,
        ...(activeOnly && { isActive: true }),
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getScopingFactorsForPackage',
        package_id: packageId,
        factor_count: factors.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${factors.length} scoping factors for package`
    );

    return factors;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getScopingFactorsForPackage',
        package_id: packageId,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get scoping factors'
    );
    throw error;
  }
}

/**
 * Get scoping rules for a package
 */
export async function getScopingRulesForPackage(
  packageId: string,
  activeOnly = true
): Promise<ScopingRule[]> {
  const startTime = performance.now();

  try {
    const rules = await prisma.scopingRule.findMany({
      where: {
        packageId,
        ...(activeOnly && { isActive: true }),
      },
      orderBy: {
        priority: 'asc',
      },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getScopingRulesForPackage',
        package_id: packageId,
        rule_count: rules.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${rules.length} scoping rules for package`
    );

    return rules;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getScopingRulesForPackage',
        package_id: packageId,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get scoping rules'
    );
    throw error;
  }
}

/**
 * Calculate price and timeline based on scoping inputs
 */
export async function calculateScope(
  packageId: string,
  inputs: ScopingInputs
): Promise<ScopingCalculationResult> {
  const startTime = performance.now();

  try {
    // Get package base price and timeline
    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      throw new Error(`Package not found: ${packageId}`);
    }

    const basePrice = Number(pkg.basePrice);
    const baseTimelineWeeks = Number(pkg.timelineWeeksMin ?? 0);

    // Get active scoping rules
    const rules = await getScopingRulesForPackage(packageId, true);

    // Apply rules in priority order
    let adjustedPrice = basePrice;
    let adjustedTimelineWeeks = baseTimelineWeeks;
    const appliedRules: ScopingCalculationResult['appliedRules'] = [];

    for (const rule of rules) {
      // Check if rule condition is met
      const inputValue = inputs[rule.factorKey];
      if (inputValue === undefined) continue;

      const conditionMet = evaluateCondition(
        inputValue,
        rule.operator as 'equals' | 'greater_than' | 'less_than' | 'in_range' | 'contains',
        rule.conditionValue as Record<string, unknown>
      );

      if (conditionMet) {
        // Apply price adjustment
        if (rule.priceAdjustmentType && rule.priceAdjustmentValue !== null) {
          const adjustmentValue = Number(rule.priceAdjustmentValue);

          switch (rule.priceAdjustmentType) {
            case 'multiplier':
              adjustedPrice *= adjustmentValue;
              break;
            case 'fixed_add':
              adjustedPrice += adjustmentValue;
              break;
            case 'fixed_subtract':
              adjustedPrice -= adjustmentValue;
              break;
          }
        }

        // Apply timeline adjustment
        if (rule.timelineAdjustmentWeeks !== null) {
          adjustedTimelineWeeks += Number(rule.timelineAdjustmentWeeks);
        }

        // Record applied rule
        appliedRules.push({
          ruleName: rule.ruleName,
          adjustmentLabel: rule.adjustmentLabel ?? undefined,
          priceAdjustment:
            rule.priceAdjustmentValue !== null
              ? Number(rule.priceAdjustmentValue)
              : undefined,
          timelineAdjustment:
            rule.timelineAdjustmentWeeks !== null
              ? Number(rule.timelineAdjustmentWeeks)
              : undefined,
        });
      }
    }

    const result: ScopingCalculationResult = {
      basePrice,
      adjustedPrice: Math.round(adjustedPrice),
      baseTimelineWeeks,
      adjustedTimelineWeeks: Math.max(0, adjustedTimelineWeeks),
      appliedRules,
    };

    logger.info(
      createLogContext({
        action: 'scoping_calculated',
        package_id: packageId,
        base_price: basePrice,
        adjusted_price: result.adjustedPrice,
        base_timeline: baseTimelineWeeks,
        adjusted_timeline: result.adjustedTimelineWeeks,
        rules_applied: appliedRules.length,
        duration_ms: performance.now() - startTime,
      }),
      `Scoping calculated: ${appliedRules.length} rules applied`
    );

    return result;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'scoping_calculation_failed',
        package_id: packageId,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to calculate scoping'
    );
    throw error;
  }
}

/**
 * Evaluate a rule condition
 */
function evaluateCondition(
  inputValue: string | number | boolean,
  operator: 'equals' | 'greater_than' | 'less_than' | 'in_range' | 'contains',
  conditionValue: Record<string, unknown>
): boolean {
  switch (operator) {
    case 'equals':
      return inputValue === conditionValue.value;

    case 'greater_than':
      return typeof inputValue === 'number' && inputValue > (conditionValue.value as number);

    case 'less_than':
      return typeof inputValue === 'number' && inputValue < (conditionValue.value as number);

    case 'in_range':
      return (
        typeof inputValue === 'number' &&
        inputValue >= (conditionValue.min as number) &&
        inputValue <= (conditionValue.max as number)
      );

    case 'contains':
      if (typeof inputValue === 'string' && typeof conditionValue.value === 'string') {
        return inputValue.includes(conditionValue.value);
      }
      if (Array.isArray(inputValue) && conditionValue.value !== undefined) {
        return inputValue.includes(conditionValue.value);
      }
      return false;

    default:
      return false;
  }
}

/**
 * Create a scoping factor
 */
export async function createScopingFactor(
  data: CreateScopingFactorInput,
  createdBy: string
): Promise<ScopingFactor> {
  const startTime = performance.now();

  try {
    const factor = await prisma.scopingFactor.create({
      data: {
        packageId: data.packageId,
        factorKey: data.factorKey,
        questionText: data.questionText,
        helpText: data.helpText,
        inputType: data.inputType,
        options: data.options,
        isRequired: data.isRequired ?? true,
        displayOrder: data.displayOrder ?? 0,
      },
    });

    // Log admin action
    await logAdminChange({
      tableName: 'scoping_factors',
      recordId: factor.id,
      action: 'create',
      changedBy: createdBy,
      changedFields: {
        factorKey: { new: factor.factorKey },
        questionText: { new: factor.questionText },
      },
    });

    logger.info(
      createLogContext({
        action: 'db_query_executed',
        query: 'createScopingFactor',
        factor_id: factor.id,
        package_id: data.packageId,
        created_by: createdBy,
        duration_ms: performance.now() - startTime,
      }),
      `Scoping factor created: ${factor.factorKey}`
    );

    return factor;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'createScopingFactor',
        package_id: data.packageId,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to create scoping factor'
    );
    throw error;
  }
}

/**
 * Update a scoping factor
 */
export async function updateScopingFactor(
  id: string,
  data: UpdateScopingFactorInput,
  updatedBy: string
): Promise<ScopingFactor> {
  const startTime = performance.now();

  try {
    const factor = await prisma.scopingFactor.update({
      where: { id },
      data: {
        ...(data.factorKey !== undefined && { factorKey: data.factorKey }),
        ...(data.questionText !== undefined && { questionText: data.questionText }),
        ...(data.helpText !== undefined && { helpText: data.helpText }),
        ...(data.inputType !== undefined && { inputType: data.inputType }),
        ...(data.options !== undefined && { options: data.options }),
        ...(data.isRequired !== undefined && { isRequired: data.isRequired }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    logger.info(
      createLogContext({
        action: 'db_query_executed',
        query: 'updateScopingFactor',
        factor_id: id,
        updated_by: updatedBy,
        duration_ms: performance.now() - startTime,
      }),
      `Scoping factor updated: ${factor.factorKey}`
    );

    return factor;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'updateScopingFactor',
        factor_id: id,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to update scoping factor'
    );
    throw error;
  }
}

/**
 * Delete a scoping factor
 */
export async function deleteScopingFactor(id: string, deletedBy: string): Promise<void> {
  const startTime = performance.now();

  try {
    await prisma.scopingFactor.delete({
      where: { id },
    });

    // Log admin action
    await logAdminChange({
      tableName: 'scoping_factors',
      recordId: id,
      action: 'delete',
      changedBy: deletedBy,
      changedFields: {},
    });

    logger.info(
      createLogContext({
        action: 'db_query_executed',
        query: 'deleteScopingFactor',
        factor_id: id,
        deleted_by: deletedBy,
        duration_ms: performance.now() - startTime,
      }),
      'Scoping factor deleted'
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'deleteScopingFactor',
        factor_id: id,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to delete scoping factor'
    );
    throw error;
  }
}

/**
 * Create a scoping rule
 */
export async function createScopingRule(
  data: CreateScopingRuleInput,
  createdBy: string
): Promise<ScopingRule> {
  const startTime = performance.now();

  try {
    const rule = await prisma.scopingRule.create({
      data: {
        packageId: data.packageId,
        ruleName: data.ruleName,
        factorKey: data.factorKey,
        operator: data.operator,
        conditionValue: data.conditionValue,
        priceAdjustmentType: data.priceAdjustmentType,
        priceAdjustmentValue: data.priceAdjustmentValue,
        timelineAdjustmentWeeks: data.timelineAdjustmentWeeks,
        adjustmentLabel: data.adjustmentLabel,
        priority: data.priority ?? 0,
      },
    });

    // Log admin action
    await logAdminChange({
      tableName: 'scoping_rules',
      recordId: rule.id,
      action: 'create',
      changedBy: createdBy,
      changedFields: {
        ruleName: { new: rule.ruleName },
        factorKey: { new: rule.factorKey },
      },
    });

    logger.info(
      createLogContext({
        action: 'db_query_executed',
        query: 'createScopingRule',
        rule_id: rule.id,
        package_id: data.packageId,
        created_by: createdBy,
        duration_ms: performance.now() - startTime,
      }),
      `Scoping rule created: ${rule.ruleName}`
    );

    return rule;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'createScopingRule',
        package_id: data.packageId,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to create scoping rule'
    );
    throw error;
  }
}

/**
 * Update a scoping rule
 */
export async function updateScopingRule(
  id: string,
  data: UpdateScopingRuleInput,
  updatedBy: string
): Promise<ScopingRule> {
  const startTime = performance.now();

  try {
    const rule = await prisma.scopingRule.update({
      where: { id },
      data: {
        ...(data.ruleName !== undefined && { ruleName: data.ruleName }),
        ...(data.factorKey !== undefined && { factorKey: data.factorKey }),
        ...(data.operator !== undefined && { operator: data.operator }),
        ...(data.conditionValue !== undefined && { conditionValue: data.conditionValue }),
        ...(data.priceAdjustmentType !== undefined && {
          priceAdjustmentType: data.priceAdjustmentType,
        }),
        ...(data.priceAdjustmentValue !== undefined && {
          priceAdjustmentValue: data.priceAdjustmentValue,
        }),
        ...(data.timelineAdjustmentWeeks !== undefined && {
          timelineAdjustmentWeeks: data.timelineAdjustmentWeeks,
        }),
        ...(data.adjustmentLabel !== undefined && { adjustmentLabel: data.adjustmentLabel }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    logger.info(
      createLogContext({
        action: 'db_query_executed',
        query: 'updateScopingRule',
        rule_id: id,
        updated_by: updatedBy,
        duration_ms: performance.now() - startTime,
      }),
      `Scoping rule updated: ${rule.ruleName}`
    );

    return rule;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'updateScopingRule',
        rule_id: id,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to update scoping rule'
    );
    throw error;
  }
}

/**
 * Delete a scoping rule
 */
export async function deleteScopingRule(id: string, deletedBy: string): Promise<void> {
  const startTime = performance.now();

  try {
    await prisma.scopingRule.delete({
      where: { id },
    });

    // Log admin action
    await logAdminChange({
      tableName: 'scoping_rules',
      recordId: id,
      action: 'delete',
      changedBy: deletedBy,
      changedFields: {},
    });

    logger.info(
      createLogContext({
        action: 'db_query_executed',
        query: 'deleteScopingRule',
        rule_id: id,
        deleted_by: deletedBy,
        duration_ms: performance.now() - startTime,
      }),
      'Scoping rule deleted'
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'deleteScopingRule',
        rule_id: id,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to delete scoping rule'
    );
    throw error;
  }
}
