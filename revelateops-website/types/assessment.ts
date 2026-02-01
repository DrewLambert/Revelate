// RevOps Health Assessment Types

export type Dimension =
  | 'crmHealth'
  | 'dataQuality'
  | 'processMaturity'
  | 'integrationHealth'
  | 'teamEnablement';

export interface DimensionInfo {
  key: Dimension;
  label: string;
  shortLabel: string;
  description: string;
  icon: string; // SVG path data
}

export interface AnswerOption {
  label: string;
  value: number; // 1-5
  detail?: string;
}

export interface Question {
  id: string;
  dimension: Dimension;
  text: string;
  subtext?: string;
  options: AnswerOption[];
}

export interface AssessmentAnswers {
  [questionId: string]: number;
}

export interface DimensionScore {
  dimension: Dimension;
  label: string;
  score: number; // 0-100
  maxScore: number;
  rawScore: number;
  questionCount: number;
}

export type Tier = 'critical' | 'needsWork' | 'solidFoundation' | 'optimized';

export interface TierInfo {
  tier: Tier;
  label: string;
  range: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  urgency: string;
  cta: string;
}

export interface AssessmentResult {
  overallScore: number;
  tier: Tier;
  dimensionScores: DimensionScore[];
  recommendations: Recommendation[];
  timestamp: string;
}

export interface Recommendation {
  dimension: Dimension;
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
}

export interface LeadCapture {
  name: string;
  email: string;
  company: string;
  role?: string;
}

export interface AssessmentSubmission extends LeadCapture {
  result: AssessmentResult;
  answers: AssessmentAnswers;
  submittedAt: string;
}
