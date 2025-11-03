import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.packageService.deleteMany();
  await prisma.scopingRule.deleteMany();
  await prisma.scopingFactor.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.package.deleteMany();
  await prisma.service.deleteMany();
  await prisma.adminAuditLog.deleteMany();

  // Create Services
  console.log('📦 Creating services...');
  const services = await Promise.all([
    // Architecture Category
    prisma.service.create({
      data: {
        name: 'Salesforce Architecture & Design',
        slug: 'architecture',
        shortDescription: 'Custom object modeling, data architecture, and scalable system design',
        fullDescription: 'Design a scalable Salesforce architecture from the ground up. We analyze your revenue operations, map data flows, design custom objects, and create a system architecture that supports growth from $10M to $50M ARR without requiring a rebuild. Includes ERD diagrams, field-level design, relationship modeling, and scalability planning.',
        basePrice: 15000,
        category: 'architecture',
        icon: '🏗️',
        isActive: true,
        displayOrder: 1,
      },
    }),
    prisma.service.create({
      data: {
        name: 'AI & AgentForce Implementation',
        slug: 'ai',
        shortDescription: 'Deploy Salesforce AI agents for predictive insights and automation',
        fullDescription: 'Deploy Salesforce AI and AgentForce to automate revenue operations with artificial intelligence. We configure Einstein Forecasting, implement AgentForce for lead scoring and opportunity insights, and build custom AI models for your specific use cases. Includes training data preparation and accuracy monitoring.',
        basePrice: 18000,
        category: 'architecture',
        icon: '🤖',
        isActive: true,
        displayOrder: 2,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Custom Lightning Components',
        slug: 'lightning',
        shortDescription: 'Bespoke UI components for unique business processes',
        fullDescription: 'Build custom Lightning Web Components for business processes that don\'t fit standard Salesforce UI. We design and develop custom interfaces, interactive dashboards, and specialized tools tailored to your workflows. Includes responsive design, accessibility compliance, and performance optimization.',
        basePrice: 12000,
        category: 'architecture',
        icon: '⚡',
        isActive: true,
        displayOrder: 3,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Migration & Data Import',
        slug: 'migration',
        shortDescription: 'Brownfield migrations, legacy system data cleanup, and validation',
        fullDescription: 'Migrate data from legacy systems or consolidate multiple Salesforce orgs. We handle data extraction, transformation, deduplication, validation, and import with zero data loss. Includes data quality checks, rollback planning, and post-migration validation to ensure accuracy.',
        basePrice: 14000,
        category: 'architecture',
        icon: '📥',
        isActive: true,
        displayOrder: 4,
      },
    }),

    // Revenue Category
    prisma.service.create({
      data: {
        name: 'Revenue Forecasting Setup',
        slug: 'forecasting',
        shortDescription: 'Predictive analytics, pipeline management, and board-ready reporting',
        fullDescription: 'Build a forecasting system that gives your board confidence in your revenue projections. We configure opportunity stages, probability models, forecast categories, and create custom reports that show pipeline health, win rates, and revenue predictions. Includes historical data analysis and forecast accuracy tracking.',
        basePrice: 10000,
        category: 'revenue',
        icon: '📊',
        isActive: true,
        displayOrder: 5,
      },
    }),
    prisma.service.create({
      data: {
        name: 'CPQ & Quote Configuration',
        slug: 'cpq',
        shortDescription: 'Configure-Price-Quote setup for complex product catalogs',
        fullDescription: 'Implement Salesforce CPQ for complex product catalogs and pricing models. We configure product bundles, pricing rules, discount schedules, approval workflows, and quote templates. Includes subscription pricing, usage-based billing, and multi-currency support for global sales teams.',
        basePrice: 16000,
        category: 'revenue',
        icon: '💰',
        isActive: true,
        displayOrder: 6,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Lead Routing & Assignment',
        slug: 'leadrouting',
        shortDescription: 'Automated lead distribution, round-robin assignment, and territory rules',
        fullDescription: 'Get leads to the right rep at the right time. We design and implement automated lead routing based on geography, industry, company size, or custom criteria. Includes round-robin distribution, territory-based assignment, overflow rules, and SLA monitoring to ensure no lead falls through the cracks.',
        basePrice: 8000,
        category: 'revenue',
        icon: '🎯',
        isActive: true,
        displayOrder: 7,
      },
    }),

    // Data Category
    prisma.service.create({
      data: {
        name: 'Data Cloud Integration',
        slug: 'datacloud',
        shortDescription: 'AWS Data Cloud, real-time data sync, and unified customer profiles',
        fullDescription: 'Integrate Salesforce with AWS Data Cloud or Salesforce Data Cloud to create a unified view of your customers. We connect data sources, configure real-time sync, build unified customer profiles, and create analytics dashboards. Includes data mapping, identity resolution, and data quality monitoring.',
        basePrice: 17000,
        category: 'data',
        icon: '☁️',
        isActive: true,
        displayOrder: 8,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Custom Reports & Dashboards',
        slug: 'reporting',
        shortDescription: 'Executive dashboards, pipeline reports, and board-ready analytics',
        fullDescription: 'Build custom reports and dashboards that give leadership real-time visibility into revenue operations. We design executive dashboards, pipeline reports, forecast analytics, and board presentations that tell your revenue story. Includes chart optimization, scheduled reports, and mobile dashboard configuration.',
        basePrice: 7000,
        category: 'data',
        icon: '📈',
        isActive: true,
        displayOrder: 9,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Data Quality & Deduplication',
        slug: 'dataquality',
        shortDescription: 'Clean duplicate records, standardize data, and enforce quality rules',
        fullDescription: 'Clean up messy data that undermines trust in your CRM. We identify and merge duplicate records, standardize data formats, set up matching rules to prevent future duplicates, and create validation rules to enforce data quality standards. Includes mass data updates and ongoing quality monitoring.',
        basePrice: 6000,
        category: 'data',
        icon: '✓',
        isActive: true,
        displayOrder: 10,
      },
    }),

    // System Category
    prisma.service.create({
      data: {
        name: 'Technical Debt Cleanup',
        slug: 'cleanup',
        shortDescription: 'Remove unused fields, workflows, and redundant automation',
        fullDescription: 'Clean up years of organic growth and technical debt. We audit your Salesforce instance, identify unused fields/objects/workflows, document dependencies, and systematically remove or consolidate redundant automation. Includes data migration for consolidated fields and validation rule cleanup.',
        basePrice: 9000,
        category: 'system',
        icon: '🔧',
        isActive: true,
        displayOrder: 11,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Security & Compliance',
        slug: 'security',
        shortDescription: 'Role hierarchies, field-level security, and audit trail setup',
        fullDescription: 'Secure your Salesforce instance with proper role hierarchies, profiles, permission sets, and field-level security. We audit existing permissions, design a security model aligned with your org structure, and implement compliance controls for SOC 2, GDPR, or industry regulations. Includes audit trail setup and security testing.',
        basePrice: 11000,
        category: 'system',
        icon: '🔒',
        isActive: true,
        displayOrder: 12,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Error Troubleshooting & Bug Fixes',
        slug: 'troubleshooting',
        shortDescription: 'Debug broken workflows, fix integration errors, and resolve system issues',
        fullDescription: 'Fix what\'s broken. We troubleshoot and resolve errors in workflows, process builder, flows, integrations, and custom code. Includes root cause analysis, bug fixes, testing, and documentation to prevent future issues. Perfect for inherited Salesforce instances with mysterious errors.',
        basePrice: 5000,
        category: 'system',
        icon: '⚠️',
        isActive: true,
        displayOrder: 13,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Salesforce Health Check & Audit',
        slug: 'healthcheck',
        shortDescription: 'Comprehensive org assessment, best practice review, and optimization plan',
        fullDescription: 'Get a complete picture of your Salesforce health. We audit your entire org against best practices, identify technical debt, assess security risks, evaluate data quality, and create a prioritized roadmap for improvements. Perfect for new leadership inheriting an existing instance or preparing for growth.',
        basePrice: 8000,
        category: 'system',
        icon: '💊',
        isActive: true,
        displayOrder: 14,
      },
    }),

    // Automation Category
    prisma.service.create({
      data: {
        name: 'Process Automation',
        slug: 'automation',
        shortDescription: 'Flows, approval processes, and workflow rules that eliminate manual work',
        fullDescription: 'Automate repetitive tasks that waste your team\'s time. We design and build Flows, approval processes, and workflow rules that handle everything from lead assignment to contract approvals. Includes process mapping, automation design, testing, and user training.',
        basePrice: 9000,
        category: 'automation',
        icon: '⚙️',
        isActive: true,
        displayOrder: 15,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Third-Party Integrations',
        slug: 'integrations',
        shortDescription: 'Connect Salesforce to your revenue stack: HubSpot, Stripe, AWS, and more',
        fullDescription: 'Create a unified revenue stack by connecting Salesforce to your other tools. We build integrations with marketing automation (HubSpot, Marketo), billing systems (Stripe, Chargebee), data warehouses (AWS, Snowflake), and customer success platforms. Includes API development, data sync configuration, and error handling.',
        basePrice: 12000,
        category: 'automation',
        icon: '🔗',
        isActive: true,
        displayOrder: 16,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Document & Contract Automation',
        slug: 'document',
        shortDescription: 'DocuSign, PandaDoc, and automated document generation',
        fullDescription: 'Eliminate manual document creation. We integrate document generation tools (DocuSign, PandaDoc, Conga) with Salesforce to auto-populate contracts, proposals, and agreements from your CRM data. Includes template design, merge field mapping, approval workflows, and e-signature automation.',
        basePrice: 10000,
        category: 'automation',
        icon: '📄',
        isActive: true,
        displayOrder: 17,
      },
    }),

    // Experience Category
    prisma.service.create({
      data: {
        name: 'Sales Team Training',
        slug: 'training',
        shortDescription: 'User adoption, best practices, and change management',
        fullDescription: 'Drive user adoption with comprehensive training programs. We create role-based training materials, conduct hands-on workshops, and provide ongoing support during the transition period. Includes admin training, end-user training, and change management strategies to ensure your team actually uses the new system.',
        basePrice: 6000,
        category: 'experience',
        icon: '👥',
        isActive: true,
        displayOrder: 18,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Page Layout & UI Optimization',
        slug: 'pagelayouts',
        shortDescription: 'Streamline layouts, optimize mobile experience, and improve usability',
        fullDescription: 'Make Salesforce easier to use. We streamline page layouts to show only what matters, optimize for mobile devices, redesign record pages for better workflow, and improve overall user experience. Includes field reordering, section organization, related list optimization, and mobile layout configuration.',
        basePrice: 5000,
        category: 'experience',
        icon: '🎨',
        isActive: true,
        displayOrder: 19,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Email Templates & Communication',
        slug: 'emailtemplates',
        shortDescription: 'Professional email templates, auto-responses, and drip campaigns',
        fullDescription: 'Professionalize your Salesforce communications. We design branded email templates for sales outreach, customer service responses, and automated notifications. Includes HTML email design, merge field configuration, template folders, and integration with email marketing tools.',
        basePrice: 4000,
        category: 'experience',
        icon: '✉️',
        isActive: true,
        displayOrder: 20,
      },
    }),
  ]);

  console.log(`✅ Created ${services.length} services`);

  // Create a lookup map for services by slug
  const serviceMap = new Map(services.map(s => [s.slug, s]));

  // Create Packages
  console.log('📦 Creating packages...');

  // Package 1: Revenue Operations Architecture
  const revopsPackage = await prisma.package.create({
    data: {
      name: 'Revenue Operations Architecture',
      slug: 'revops',
      type: 'stage',
      stage: 'series-b',
      targetArrMin: BigInt(10000000), // $10M
      targetArrMax: BigInt(50000000), // $50M
      tagline: 'Building RevOps from scratch or scaling from $10M to $50M ARR',
      shortDescription: 'For Series B SaaS scaling from $10M to $50M ARR',
      fullDescription: 'Comprehensive revenue operations transformation including architecture design, forecasting setup, automation, integrations, and team training. Perfect for Series B companies experiencing scale pain.',
      basePrice: 52500,
      discountPercentage: 0,
      timelineWeeksMin: 8,
      timelineWeeksMax: 16,
      icon: '🏗️',
      badge: 'Most Popular',
      inputsDescription: 'Current Salesforce setup, revenue processes, team size, existing integrations, and growth targets.',
      deliveryRhythmDescription: 'Weekly strategy calls, bi-weekly reviews, continuous deployment, and daily Slack support.',
      outputsDescription: 'Scalable Salesforce architecture, automated workflows, integrated revenue stack, trained team, and comprehensive documentation.',
      successCriteriaDescription: 'Forecast accuracy >85%, team productivity increase >30%, data entry time reduced by >50%, and board-ready reporting.',
      guaranteeDescription: 'We guarantee measurable improvements in forecast accuracy and team productivity within the first 8 weeks, or we continue working at no additional cost until targets are met.',
      isActive: true,
      isFeatured: true,
      displayOrder: 1,
    },
  });

  // Add services to RevOps package
  await prisma.packageService.createMany({
    data: [
      { packageId: revopsPackage.id, serviceId: serviceMap.get('architecture')!.id, isCore: true, displayOrder: 1 },
      { packageId: revopsPackage.id, serviceId: serviceMap.get('forecasting')!.id, isCore: true, displayOrder: 2 },
      { packageId: revopsPackage.id, serviceId: serviceMap.get('automation')!.id, isCore: true, displayOrder: 3 },
      { packageId: revopsPackage.id, serviceId: serviceMap.get('integrations')!.id, isCore: true, displayOrder: 4 },
      { packageId: revopsPackage.id, serviceId: serviceMap.get('training')!.id, isCore: true, displayOrder: 5 },
    ],
  });

  // Package 2: Salesforce Cleanup & Repair
  const cleanupPackage = await prisma.package.create({
    data: {
      name: 'Salesforce Cleanup & Repair',
      slug: 'cleanup',
      type: 'targeted',
      stage: 'series-b',
      targetArrMin: BigInt(10000000),
      targetArrMax: BigInt(50000000),
      tagline: 'Fixing broken Salesforce instances that grew organically without a plan',
      shortDescription: 'For Series B SaaS with technical debt from rapid growth',
      fullDescription: 'Complete cleanup and repair of brownfield Salesforce instances. Remove technical debt, consolidate automation, migrate clean data, implement security, and train your team on the improved system.',
      basePrice: 37500,
      discountPercentage: 0,
      timelineWeeksMin: 6,
      timelineWeeksMax: 12,
      icon: '🔧',
      badge: null,
      inputsDescription: 'Current Salesforce org access, pain points, broken workflows, and desired end state.',
      deliveryRhythmDescription: 'Audit in week 1, weekly cleanup sprints, daily progress updates, and final validation testing.',
      outputsDescription: 'Clean Salesforce instance, consolidated automation, migrated data, documented security model, and trained team.',
      successCriteriaDescription: 'Technical debt reduced >60%, manual data entry time reduced >40%, and zero critical bugs remaining.',
      guaranteeDescription: 'We guarantee identification and remediation of all critical technical debt, or we continue working until your instance meets production-ready standards.',
      isActive: true,
      isFeatured: false,
      displayOrder: 2,
    },
  });

  // Add services to Cleanup package
  await prisma.packageService.createMany({
    data: [
      { packageId: cleanupPackage.id, serviceId: serviceMap.get('cleanup')!.id, isCore: true, displayOrder: 1 },
      { packageId: cleanupPackage.id, serviceId: serviceMap.get('automation')!.id, isCore: true, displayOrder: 2 },
      { packageId: cleanupPackage.id, serviceId: serviceMap.get('migration')!.id, isCore: true, displayOrder: 3 },
      { packageId: cleanupPackage.id, serviceId: serviceMap.get('training')!.id, isCore: true, displayOrder: 4 },
      { packageId: cleanupPackage.id, serviceId: serviceMap.get('security')!.id, isCore: true, displayOrder: 5 },
    ],
  });

  // Package 3: AI & Data Cloud Integration
  const aiPackage = await prisma.package.create({
    data: {
      name: 'AI & Data Cloud Integration',
      slug: 'ai',
      type: 'targeted',
      stage: 'series-b',
      targetArrMin: BigInt(10000000),
      targetArrMax: BigInt(50000000),
      tagline: 'Competing with enterprise players using AI-powered revenue operations',
      shortDescription: 'For Series B SaaS competing with enterprise players',
      fullDescription: 'Deploy cutting-edge AI and Data Cloud capabilities to compete with enterprise players. Includes AgentForce implementation, Data Cloud integration, advanced forecasting, integrations, and custom Lightning components for AI-powered workflows.',
      basePrice: 55000,
      discountPercentage: 0,
      timelineWeeksMin: 10,
      timelineWeeksMax: 16,
      icon: '🤖',
      badge: null,
      inputsDescription: 'Current tech stack, data sources, AI use cases, competitive landscape, and desired outcomes.',
      deliveryRhythmDescription: 'AI strategy workshop, bi-weekly model training reviews, continuous integration, and performance monitoring.',
      outputsDescription: 'Deployed AI agents, unified data cloud, predictive forecasting, integrated systems, and custom AI-powered interfaces.',
      successCriteriaDescription: 'AI model accuracy >90%, data unification complete, predictive insights actionable, and competitive feature parity achieved.',
      guaranteeDescription: 'We guarantee functional AI deployment with measurable performance improvements, or we optimize until accuracy targets are met.',
      isActive: true,
      isFeatured: false,
      displayOrder: 3,
    },
  });

  // Add services to AI package
  await prisma.packageService.createMany({
    data: [
      { packageId: aiPackage.id, serviceId: serviceMap.get('ai')!.id, isCore: true, displayOrder: 1 },
      { packageId: aiPackage.id, serviceId: serviceMap.get('datacloud')!.id, isCore: true, displayOrder: 2 },
      { packageId: aiPackage.id, serviceId: serviceMap.get('forecasting')!.id, isCore: true, displayOrder: 3 },
      { packageId: aiPackage.id, serviceId: serviceMap.get('integrations')!.id, isCore: true, displayOrder: 4 },
      { packageId: aiPackage.id, serviceId: serviceMap.get('lightning')!.id, isCore: true, displayOrder: 5 },
    ],
  });

  console.log(`✅ Created 3 packages with service associations`);

  console.log('\n✨ Database seed completed successfully!');
  console.log('📊 Summary:');
  console.log(`   - ${services.length} services created`);
  console.log(`   - 3 packages created`);
  console.log(`   - Package-service associations created`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
