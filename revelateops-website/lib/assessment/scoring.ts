import type {
  AssessmentAnswers,
  AssessmentResult,
  DimensionScore,
  Dimension,
  Tier,
  TierInfo,
  Recommendation,
} from '@/types/assessment';
import { questions, dimensions } from './questions';

export const tierInfo: Record<Tier, TierInfo> = {
  critical: {
    tier: 'critical',
    label: 'Critical',
    range: '0–40',
    color: '#f87171',
    bgColor: 'rgba(248, 113, 113, 0.1)',
    borderColor: 'rgba(248, 113, 113, 0.3)',
    description:
      'Your revenue operations have significant gaps that are likely costing you deals and creating unreliable data. Immediate intervention is recommended.',
    urgency:
      'Every week you wait, pipeline leaks and bad data compound. This needs attention now.',
    cta: 'Book an Emergency Diagnostic',
  },
  needsWork: {
    tier: 'needsWork',
    label: 'Needs Work',
    range: '41–60',
    color: '#fbbf24',
    bgColor: 'rgba(251, 191, 36, 0.1)',
    borderColor: 'rgba(251, 191, 36, 0.3)',
    description:
      'You have some foundations in place, but key areas need improvement to support your growth trajectory. Targeted fixes could unlock significant value.',
    urgency:
      'You\'re leaving revenue on the table. A focused 8-week engagement could transform your operations.',
    cta: 'Book a Strategy Session',
  },
  solidFoundation: {
    tier: 'solidFoundation',
    label: 'Solid Foundation',
    range: '61–80',
    color: '#22d3ee',
    bgColor: 'rgba(34, 211, 238, 0.1)',
    borderColor: 'rgba(34, 211, 238, 0.3)',
    description:
      'Your operations are in good shape with room for optimization. Strategic improvements could take you from good to great.',
    urgency:
      'You\'re well-positioned to move from reactive to proactive operations. Let\'s identify the highest-impact opportunities.',
    cta: 'Book an Optimization Call',
  },
  optimized: {
    tier: 'optimized',
    label: 'Optimized',
    range: '81–100',
    color: '#4ade80',
    bgColor: 'rgba(74, 222, 128, 0.1)',
    borderColor: 'rgba(74, 222, 128, 0.3)',
    description:
      'Your revenue operations are running at a high level. Focus on continuous improvement and staying ahead of scale challenges.',
    urgency:
      'You\'re ahead of most. Let\'s make sure your systems scale as fast as your business.',
    cta: 'Book an Advisory Session',
  },
};

function getTier(score: number): Tier {
  if (score <= 40) return 'critical';
  if (score <= 60) return 'needsWork';
  if (score <= 80) return 'solidFoundation';
  return 'optimized';
}

function calculateDimensionScores(answers: AssessmentAnswers): DimensionScore[] {
  return dimensions.map((dim) => {
    const dimQuestions = questions.filter((q) => q.dimension === dim.key);
    const answered = dimQuestions.filter((q) => answers[q.id] !== undefined);

    if (answered.length === 0) {
      return {
        dimension: dim.key,
        label: dim.label,
        score: 0,
        maxScore: 100,
        rawScore: 0,
        questionCount: dimQuestions.length,
      };
    }

    const rawScore = answered.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    const maxRaw = answered.length * 5;
    const score = Math.round((rawScore / maxRaw) * 100);

    return {
      dimension: dim.key,
      label: dim.label,
      score,
      maxScore: 100,
      rawScore,
      questionCount: dimQuestions.length,
    };
  });
}

function generateRecommendations(
  dimensionScores: DimensionScore[],
  answers: AssessmentAnswers
): Recommendation[] {
  const recs: Recommendation[] = [];

  const recMap: Record<Dimension, { low: Recommendation; mid: Recommendation }> = {
    crmHealth: {
      low: {
        dimension: 'crmHealth',
        priority: 'critical',
        title: 'CRM Architecture Overhaul',
        description:
          'Your Salesforce instance needs a comprehensive audit and cleanup. Technical debt is likely causing data issues, slow performance, and team frustration.',
        impact:
          'Reduce admin overhead by 40%+ and create a scalable foundation for growth.',
      },
      mid: {
        dimension: 'crmHealth',
        priority: 'medium',
        title: 'CRM Health Check & Optimization',
        description:
          'A targeted audit would identify quick wins — unused fields, redundant automations, and optimization opportunities.',
        impact:
          'Improve system performance and reduce maintenance burden.',
      },
    },
    dataQuality: {
      low: {
        dimension: 'dataQuality',
        priority: 'critical',
        title: 'Data Trust Restoration',
        description:
          'Leadership doesn\'t trust your pipeline data, which means shadow spreadsheets and gut-feel decisions. You need validation rules, deduplication, and a data governance framework.',
        impact:
          'Enable data-driven forecasting and eliminate "spreadsheet culture."',
      },
      mid: {
        dimension: 'dataQuality',
        priority: 'high',
        title: 'Forecast Accuracy Program',
        description:
          'Your data is partially trusted but forecasts still miss. Implementing stage validation, pipeline hygiene rules, and snapshot tracking would close the gap.',
        impact:
          'Improve forecast accuracy to within 10% of actuals consistently.',
      },
    },
    processMaturity: {
      low: {
        dimension: 'processMaturity',
        priority: 'critical',
        title: 'Lead Routing & Handoff Automation',
        description:
          'Manual processes are causing leads to go cold and deals to stall. Automated routing and handoff workflows could immediately improve conversion rates.',
        impact:
          'Reduce lead response time from hours to minutes — a proven 66% sales acceleration.',
      },
      mid: {
        dimension: 'processMaturity',
        priority: 'high',
        title: 'Process Standardization',
        description:
          'Your core processes exist but aren\'t consistently followed. Adding SLAs, automated enforcement, and exception handling would improve reliability.',
        impact:
          'Reduce dropped leads by 30%+ and improve rep productivity.',
      },
    },
    integrationHealth: {
      low: {
        dimension: 'integrationHealth',
        priority: 'critical',
        title: 'Integration Consolidation & Monitoring',
        description:
          'Your integration landscape is creating data inconsistencies and firefighting. You need an integration audit, consolidation plan, and monitoring layer.',
        impact:
          'Eliminate data sync issues and save 10+ hours/week on troubleshooting.',
      },
      mid: {
        dimension: 'integrationHealth',
        priority: 'medium',
        title: 'Integration Monitoring & Documentation',
        description:
          'Your integrations mostly work but lack visibility. Adding monitoring, error alerts, and documentation would prevent issues before they impact data.',
        impact:
          'Catch integration failures in minutes instead of discovering them days later.',
      },
    },
    teamEnablement: {
      low: {
        dimension: 'teamEnablement',
        priority: 'high',
        title: 'RevOps Knowledge Transfer & Documentation',
        description:
          'Critical knowledge lives in people\'s heads. If your key ops person leaves, your systems become a black box. You need runbooks, SOPs, and cross-training.',
        impact:
          'Eliminate single points of failure and reduce onboarding time by 50%.',
      },
      mid: {
        dimension: 'teamEnablement',
        priority: 'medium',
        title: 'Team Capacity & Enablement Plan',
        description:
          'Your team is capable but stretched thin. Strategic documentation and workflow automation would free up capacity for high-impact projects.',
        impact:
          'Reclaim 20%+ of team time from reactive work to strategic initiatives.',
      },
    },
  };

  // Sort dimensions by score (worst first)
  const sorted = [...dimensionScores].sort((a, b) => a.score - b.score);

  for (const ds of sorted) {
    const mapping = recMap[ds.dimension];
    if (ds.score <= 50) {
      recs.push(mapping.low);
    } else if (ds.score <= 75) {
      recs.push(mapping.mid);
    }
    // Score > 75: no recommendation needed
  }

  return recs;
}

export function calculateResults(answers: AssessmentAnswers): AssessmentResult {
  const dimensionScores = calculateDimensionScores(answers);
  const overallScore = Math.round(
    dimensionScores.reduce((sum, ds) => sum + ds.score, 0) / dimensionScores.length
  );
  const tier = getTier(overallScore);
  const recommendations = generateRecommendations(dimensionScores, answers);

  return {
    overallScore,
    tier,
    dimensionScores,
    recommendations,
    timestamp: new Date().toISOString(),
  };
}
