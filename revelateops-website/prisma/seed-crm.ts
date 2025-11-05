import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CRM seed...');

  // Create Companies
  console.log('🏢 Creating companies...');

  const acmeCorp = await prisma.company.create({
    data: {
      name: 'Acme Corporation',
      website: 'https://acme.com',
      industry: 'SaaS',
      size: 'medium',
      arrRange: '$5-10M',
      phone: '555-0100',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      notes: 'B2B SaaS company focused on project management',
      tags: ['saas', 'b2b', 'high-priority'],
      createdBy: 'seed',
    },
  });

  const techStartup = await prisma.company.create({
    data: {
      name: 'TechStartup Inc',
      website: 'https://techstartup.io',
      industry: 'Technology',
      size: 'startup',
      arrRange: '$1-5M',
      phone: '555-0200',
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      notes: 'Early-stage startup building AI tools',
      tags: ['startup', 'ai', 'seed-stage'],
      createdBy: 'seed',
    },
  });

  const growthCo = await prisma.company.create({
    data: {
      name: 'GrowthCo Solutions',
      website: 'https://growthco.com',
      industry: 'Marketing',
      size: 'medium',
      arrRange: '$10-25M',
      phone: '555-0300',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      notes: 'Marketing automation platform',
      tags: ['marketing', 'b2b', 'series-b'],
      createdBy: 'seed',
    },
  });

  console.log(`✅ Created ${3} companies`);

  // Create Contacts
  console.log('👥 Creating contacts...');

  const contact1 = await prisma.contact.create({
    data: {
      companyId: acmeCorp.id,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@acme.com',
      phone: '555-0101',
      title: 'VP of Sales',
      linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
      isPrimary: true,
      notes: 'Primary decision maker for RevOps projects',
      tags: ['decision-maker', 'champion'],
      createdBy: 'seed',
    },
  });

  const contact2 = await prisma.contact.create({
    data: {
      companyId: acmeCorp.id,
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@acme.com',
      phone: '555-0102',
      title: 'RevOps Manager',
      isPrimary: false,
      notes: 'Technical point of contact',
      tags: ['technical', 'end-user'],
      createdBy: 'seed',
    },
  });

  const contact3 = await prisma.contact.create({
    data: {
      companyId: techStartup.id,
      firstName: 'Emily',
      lastName: 'Rodriguez',
      email: 'emily@techstartup.io',
      phone: '555-0201',
      title: 'CEO',
      isPrimary: true,
      notes: 'Founder looking to scale sales operations',
      tags: ['founder', 'decision-maker'],
      createdBy: 'seed',
    },
  });

  const contact4 = await prisma.contact.create({
    data: {
      companyId: growthCo.id,
      firstName: 'David',
      lastName: 'Park',
      email: 'dpark@growthco.com',
      phone: '555-0301',
      title: 'CRO',
      isPrimary: true,
      notes: 'Looking for Salesforce optimization',
      tags: ['c-level', 'revenue-leader'],
      createdBy: 'seed',
    },
  });

  console.log(`✅ Created ${4} contacts`);

  // Create Deals
  console.log('💰 Creating deals...');

  const deal1 = await prisma.deal.create({
    data: {
      companyId: acmeCorp.id,
      contactId: contact1.id,
      name: 'Acme Salesforce Implementation',
      description: 'Full Salesforce implementation with custom objects and automation',
      value: 45000,
      stage: 'proposal',
      probability: 60,
      expectedCloseDate: new Date('2025-12-15'),
      notes: 'Proposal sent, waiting for feedback',
      tags: ['salesforce', 'implementation'],
      createdBy: 'seed',
    },
  });

  const deal2 = await prisma.deal.create({
    data: {
      companyId: techStartup.id,
      contactId: contact3.id,
      name: 'TechStartup RevOps Setup',
      description: 'Initial RevOps foundation for Series A company',
      value: 25000,
      stage: 'qualified',
      probability: 40,
      expectedCloseDate: new Date('2026-01-30'),
      notes: 'Qualified lead, scheduling discovery call',
      tags: ['startup', 'revops'],
      createdBy: 'seed',
    },
  });

  const deal3 = await prisma.deal.create({
    data: {
      companyId: growthCo.id,
      contactId: contact4.id,
      name: 'GrowthCo Salesforce Optimization',
      description: 'Optimize existing Salesforce instance and add AI features',
      value: 35000,
      stage: 'negotiation',
      probability: 75,
      expectedCloseDate: new Date('2025-11-30'),
      notes: 'In final negotiations on scope',
      tags: ['optimization', 'ai'],
      createdBy: 'seed',
    },
  });

  console.log(`✅ Created ${3} deals`);

  // Create Projects
  console.log('📁 Creating projects...');

  const project1 = await prisma.project.create({
    data: {
      companyId: acmeCorp.id,
      dealId: deal1.id,
      name: 'Acme Salesforce Deployment',
      description: 'Deploy custom Salesforce instance with automation',
      status: 'in_progress',
      startDate: new Date('2025-11-01'),
      dueDate: new Date('2026-02-01'),
      budget: 45000,
      progressPercent: 35,
      notes: 'Phase 1 complete, moving to Phase 2',
      tags: ['salesforce', 'deployment'],
      createdBy: 'seed',
    },
  });

  const project2 = await prisma.project.create({
    data: {
      companyId: growthCo.id,
      dealId: deal3.id,
      name: 'GrowthCo AI Integration',
      description: 'Integrate Einstein AI and AgentForce',
      status: 'planning',
      startDate: new Date('2025-12-01'),
      dueDate: new Date('2026-03-01'),
      budget: 35000,
      progressPercent: 0,
      notes: 'Awaiting contract signature',
      tags: ['ai', 'einstein'],
      createdBy: 'seed',
    },
  });

  console.log(`✅ Created ${2} projects`);

  // Create Tasks
  console.log('✅ Creating tasks...');

  await prisma.task.create({
    data: {
      projectId: project1.id,
      title: 'Design custom object schema',
      description: 'Create ERD for custom objects and relationships',
      priority: 'high',
      status: 'completed',
      dueDate: new Date('2025-11-15'),
      completedAt: new Date('2025-11-12'),
      notes: 'Completed ahead of schedule',
      tags: ['architecture', 'design'],
      createdBy: 'seed',
    },
  });

  await prisma.task.create({
    data: {
      projectId: project1.id,
      title: 'Build custom objects in Salesforce',
      description: 'Implement custom objects, fields, and relationships',
      priority: 'high',
      status: 'in_progress',
      dueDate: new Date('2025-11-25'),
      notes: '60% complete',
      tags: ['development', 'salesforce'],
      createdBy: 'seed',
    },
  });

  await prisma.task.create({
    data: {
      projectId: project1.id,
      title: 'Configure automation rules',
      description: 'Set up Process Builder and Flow automation',
      priority: 'medium',
      status: 'todo',
      dueDate: new Date('2025-12-05'),
      tags: ['automation', 'flows'],
      createdBy: 'seed',
    },
  });

  await prisma.task.create({
    data: {
      projectId: project1.id,
      title: 'User acceptance testing',
      description: 'Conduct UAT with Acme team',
      priority: 'high',
      status: 'todo',
      dueDate: new Date('2026-01-15'),
      tags: ['testing', 'uat'],
      createdBy: 'seed',
    },
  });

  await prisma.task.create({
    data: {
      dealId: deal2.id,
      title: 'Schedule discovery call with Emily',
      description: 'Initial discovery call to understand TechStartup needs',
      priority: 'urgent',
      status: 'todo',
      dueDate: new Date('2025-11-10'),
      tags: ['sales', 'discovery'],
      createdBy: 'seed',
    },
  });

  await prisma.task.create({
    data: {
      projectId: project2.id,
      title: 'Einstein AI requirements gathering',
      description: 'Document AI use cases and requirements',
      priority: 'high',
      status: 'todo',
      dueDate: new Date('2025-12-10'),
      tags: ['ai', 'requirements'],
      createdBy: 'seed',
    },
  });

  console.log(`✅ Created ${6} tasks`);

  // Create Activities
  console.log('📝 Creating activities...');

  await prisma.activity.create({
    data: {
      companyId: acmeCorp.id,
      contactId: contact1.id,
      dealId: deal1.id,
      type: 'meeting',
      subject: 'Kickoff meeting with Acme team',
      description: 'Discussed project scope, timeline, and success criteria',
      activityDate: new Date('2025-11-01'),
      createdBy: 'seed',
    },
  });

  await prisma.activity.create({
    data: {
      companyId: acmeCorp.id,
      dealId: deal1.id,
      type: 'note',
      subject: 'Proposal submitted',
      description: 'Sent detailed proposal with pricing and timeline',
      activityDate: new Date('2025-10-25'),
      createdBy: 'seed',
    },
  });

  await prisma.activity.create({
    data: {
      companyId: techStartup.id,
      contactId: contact3.id,
      dealId: deal2.id,
      type: 'call',
      subject: 'Initial outreach call',
      description: 'Spoke with Emily about their RevOps needs',
      activityDate: new Date('2025-10-15'),
      createdBy: 'seed',
    },
  });

  await prisma.activity.create({
    data: {
      companyId: growthCo.id,
      contactId: contact4.id,
      dealId: deal3.id,
      type: 'email',
      subject: 'Follow-up on contract',
      description: 'Sent contract for review',
      activityDate: new Date('2025-11-03'),
      createdBy: 'seed',
    },
  });

  console.log(`✅ Created ${4} activities`);

  console.log('\n✨ CRM seed completed successfully!');
  console.log('\nSummary:');
  console.log(`- 3 companies created`);
  console.log(`- 4 contacts created`);
  console.log(`- 3 deals created ($105k total pipeline)`);
  console.log(`- 2 projects created`);
  console.log(`- 6 tasks created`);
  console.log(`- 4 activities created`);
  console.log('\n🚀 You can now explore the CRM at http://localhost:3000/crm');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding CRM data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
