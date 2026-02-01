import type { Question, DimensionInfo } from '@/types/assessment';

export const dimensions: DimensionInfo[] = [
  {
    key: 'crmHealth',
    label: 'CRM Health',
    shortLabel: 'CRM',
    description: 'The structural integrity and maintainability of your Salesforce instance',
    icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4',
  },
  {
    key: 'dataQuality',
    label: 'Data Quality',
    shortLabel: 'Data',
    description: 'How trustworthy and actionable your revenue data is',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    key: 'processMaturity',
    label: 'Process Automation',
    shortLabel: 'Process',
    description: 'The efficiency and automation level of your revenue operations workflows',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    key: 'integrationHealth',
    label: 'Integration Health',
    shortLabel: 'Integrations',
    description: 'How well your tools communicate and share data across the revenue stack',
    icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
  },
  {
    key: 'teamEnablement',
    label: 'Team Enablement',
    shortLabel: 'Team',
    description: 'How well your team is equipped to operate and evolve your revenue systems',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  },
];

export const questions: Question[] = [
  // CRM Health (2 questions)
  {
    id: 'crm-age',
    dimension: 'crmHealth',
    text: 'How long has your Salesforce instance been in production?',
    subtext: 'Older instances tend to accumulate technical debt that impacts performance.',
    options: [
      { label: 'Less than 1 year', value: 5, detail: 'Fresh start' },
      { label: '1–3 years', value: 4, detail: 'Still young' },
      { label: '3–5 years', value: 3, detail: 'Maturing' },
      { label: '5–8 years', value: 2, detail: 'Getting complex' },
      { label: '8+ years', value: 1, detail: 'Legacy territory' },
    ],
  },
  {
    id: 'crm-audit',
    dimension: 'crmHealth',
    text: 'When was your last comprehensive CRM audit or cleanup?',
    subtext: 'Regular audits prevent data rot and process drift.',
    options: [
      { label: 'Within the last 3 months', value: 5 },
      { label: '3–6 months ago', value: 4 },
      { label: '6–12 months ago', value: 3 },
      { label: 'Over a year ago', value: 2 },
      { label: 'Never / Not sure', value: 1 },
    ],
  },

  // Data Quality (2 questions)
  {
    id: 'data-trust',
    dimension: 'dataQuality',
    text: 'How much does your leadership team trust pipeline numbers?',
    subtext: 'If leaders don\'t trust the data, they build shadow systems.',
    options: [
      { label: 'Complete trust — decisions are data-driven', value: 5 },
      { label: 'Mostly trust, with occasional manual verification', value: 4 },
      { label: 'Some trust, but managers keep their own spreadsheets', value: 3 },
      { label: 'Low trust — we rely more on gut feel', value: 2 },
      { label: 'No one trusts the numbers', value: 1 },
    ],
  },
  {
    id: 'data-forecast',
    dimension: 'dataQuality',
    text: 'How often do your revenue forecasts match actual results (within 10%)?',
    subtext: 'Forecast accuracy is a direct measure of data and process quality.',
    options: [
      { label: 'Almost always (90%+ of quarters)', value: 5 },
      { label: 'Usually (70–90% of quarters)', value: 4 },
      { label: 'Sometimes (40–70% of quarters)', value: 3 },
      { label: 'Rarely (under 40% of quarters)', value: 2 },
      { label: 'We don\'t formally forecast', value: 1 },
    ],
  },

  // Process Maturity (2 questions)
  {
    id: 'process-routing',
    dimension: 'processMaturity',
    text: 'How are new leads routed to the right sales rep?',
    subtext: 'Lead routing speed directly impacts conversion rates.',
    options: [
      { label: 'Fully automated with intelligent rules and round-robin', value: 5 },
      { label: 'Mostly automated with some manual exceptions', value: 4 },
      { label: 'Semi-automated — basic rules, but lots of manual fixes', value: 3 },
      { label: 'Mostly manual — managers assign leads', value: 2 },
      { label: 'Ad hoc — no consistent process', value: 1 },
    ],
  },
  {
    id: 'process-handoff',
    dimension: 'processMaturity',
    text: 'How smooth is your marketing-to-sales handoff process?',
    subtext: 'Poor handoffs cause leads to fall through cracks and create friction.',
    options: [
      { label: 'Seamless — automated SLAs, alerts, and tracking', value: 5 },
      { label: 'Mostly smooth — defined process with good compliance', value: 4 },
      { label: 'Okay — process exists but isn\'t always followed', value: 3 },
      { label: 'Rough — frequent miscommunication and dropped leads', value: 2 },
      { label: 'No defined process', value: 1 },
    ],
  },

  // Integration Health (2 questions)
  {
    id: 'integration-count',
    dimension: 'integrationHealth',
    text: 'How many tools connect to your CRM (directly or via middleware)?',
    subtext: 'More connections means more potential failure points.',
    options: [
      { label: '1–3 tools, well-documented', value: 5 },
      { label: '4–7 tools, mostly managed', value: 4 },
      { label: '8–12 tools, some undocumented', value: 3 },
      { label: '13–20 tools, many unknown', value: 2 },
      { label: '20+ tools — it\'s a jungle', value: 1 },
    ],
  },
  {
    id: 'integration-reliability',
    dimension: 'integrationHealth',
    text: 'How often do your integrations fail or produce data errors?',
    subtext: 'Integration reliability determines how much time your team spends firefighting.',
    options: [
      { label: 'Rarely — we have monitoring and auto-recovery', value: 5 },
      { label: 'Occasionally — maybe once a month', value: 4 },
      { label: 'Regularly — a few times a month', value: 3 },
      { label: 'Frequently — weekly firefighting', value: 2 },
      { label: 'Constantly — it\'s our biggest pain point', value: 1 },
    ],
  },

  // Team Enablement (2 questions)
  {
    id: 'team-docs',
    dimension: 'teamEnablement',
    text: 'How well-documented are your revenue operations processes?',
    subtext: 'Documentation is the difference between tribal knowledge and a scalable team.',
    options: [
      { label: 'Comprehensive — runbooks, SOPs, and training materials', value: 5 },
      { label: 'Good — most major processes are documented', value: 4 },
      { label: 'Partial — some docs exist but many are outdated', value: 3 },
      { label: 'Minimal — a few key people hold all the knowledge', value: 2 },
      { label: 'None — it\'s all tribal knowledge', value: 1 },
    ],
  },
  {
    id: 'team-capacity',
    dimension: 'teamEnablement',
    text: 'How would you describe your RevOps team\'s capacity?',
    subtext: 'Overloaded teams can\'t improve — they can only maintain.',
    options: [
      { label: 'Well-staffed — we have capacity for strategic projects', value: 5 },
      { label: 'Adequate — keeping up but not getting ahead', value: 4 },
      { label: 'Stretched — handling day-to-day with little room for improvement', value: 3 },
      { label: 'Under-resourced — constantly behind on requests', value: 2 },
      { label: 'No dedicated RevOps — it\'s a side job for someone', value: 1 },
    ],
  },
];
