import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOpportunityScore,
  estimateSavedHoursPerMonth,
  filterProblems,
  sortProblems,
  calculateStats,
  formatMRR,
} from './problemRules';
import { Problem, FilterOptions } from '../types';

const mockProblems: Problem[] = [
  {
    id: 'prob-1',
    title: 'Chasing unpaid invoices for freelance design clients',
    description: 'Clients take 60-90 days to pay. Awkward manual emails waste 8 hours every week.',
    originalQuote: 'I hate having to play collection agency every Friday afternoon.',
    source: {
      platform: 'reddit',
      subreddit: 'r/freelance',
      author: 'u/pixelcraft',
      postedAt: '2026-10-15T10:00:00Z', // Recent (Last 30 days)
      upvotes: 1420,
      commentCount: 95,
    },
    domain: 'business',
    category: 'freelance',
    severity: 'critical',
    monetizationPotential: 'very_high',
    frequencyScore: 90,
    willingnessToPayScore: 85,
    opportunityScore: 87,
    frustrationKeywords: ['late payments', 'invoice chasing'],
    targetAudience: 'Freelancers & Boutique Agencies',
    aiSolvability: {
      score: 92,
      bestApproach: 'autonomous_agent',
      estimatedBuildTime: '1-2 days',
      recommendedStack: ['Gmail API', 'Quickbooks/Stripe', 'Gemini Agent'],
    },
    status: 'unsolved',
    onlineBusiness: {
      businessName: 'PaidNice AI',
      businessModel: 'micro_saas',
      monthlyRevenue: 34500, // $34,500/mo (High MRR)
      pricingModel: '$49/mo - $149/mo',
      activeCustomers: 380,
      launchTimeframe: '10 days',
      monetizationStrategy: 'Monthly SaaS fee charging businesses to automate overdue accounts receivable.',
      founderStoryOrTraction: 'Scaled from Reddit post in r/freelance to $34k MRR in 8 months.',
      acquisitionChannel: 'QuickBooks app store & Reddit r/freelance',
      cloneBlueprint: ['Connect Stripe Webhook', 'Deploy Gemini escalation sequencer', 'Launch on Stripe App Marketplace'],
    },
  },
  {
    id: 'prob-2',
    title: 'Weekly grocery meal planning with fridge inventory waste',
    description: 'Food rots in the back of fridge because planning meals around existing ingredients is mentally exhausting.',
    originalQuote: 'I throw away $50 of fresh vegetables every single Sunday.',
    source: {
      platform: 'reddit',
      subreddit: 'r/lifehacks',
      author: 'u/ecocook',
      postedAt: '2026-04-10T08:00:00Z', // 6 months ago
      upvotes: 850,
      commentCount: 140,
    },
    domain: 'daily_life',
    category: 'lifestyle',
    severity: 'medium',
    monetizationPotential: 'medium',
    frequencyScore: 80,
    willingnessToPayScore: 40,
    opportunityScore: 57,
    frustrationKeywords: ['food waste', 'dinner fatigue'],
    targetAudience: 'Busy professionals and parents',
    aiSolvability: {
      score: 88,
      bestApproach: 'rag_assistant',
      estimatedBuildTime: '1 day',
      recommendedStack: ['Vision API', 'Gemini Flash', 'Recipe DB'],
    },
    status: 'agent_ready',
    onlineBusiness: {
      businessName: 'SuperCook Pro',
      businessModel: 'productized_service',
      monthlyRevenue: 12800, // $12,800/mo (Mid MRR)
      pricingModel: '$9.99/mo or $79/year',
      activeCustomers: 1420,
      launchTimeframe: '14 days',
      monetizationStrategy: 'Subscription app with camera ingredient scanning and customized meal plans.',
      founderStoryOrTraction: '14k downloads on iOS with $12.8k MRR.',
      acquisitionChannel: 'TikTok viral fridge cleanout videos',
      cloneBlueprint: ['Build simple Telegram bot', 'Use Gemini 3.8 Flash Vision', 'Sell $7/mo subscription via Stripe'],
    },
  },
  {
    id: 'prob-3',
    title: 'Apartment lease fine print deposit deductions',
    description: 'Landlords withholding security deposits with illegal clauses.',
    originalQuote: 'Landlord stole my entire $1800 deposit with fine print.',
    source: {
      platform: 'reddit',
      subreddit: 'r/AskReddit',
      author: 'u/renter99',
      postedAt: '2025-11-20T14:00:00Z', // 11 months ago (past 1 year archive)
      upvotes: 4100,
      commentCount: 600,
    },
    domain: 'daily_life',
    category: 'legal',
    severity: 'critical',
    monetizationPotential: 'high',
    frequencyScore: 85,
    willingnessToPayScore: 70,
    opportunityScore: 78,
    frustrationKeywords: ['deposit theft', 'lease fine print'],
    targetAudience: 'Tenants moving into new leases',
    aiSolvability: {
      score: 93,
      bestApproach: 'autonomous_agent',
      estimatedBuildTime: '1 day',
      recommendedStack: ['PDF OCR', 'Gemini 3.8 Flash'],
    },
    status: 'unsolved',
    onlineBusiness: {
      businessName: 'LeaseCheck AI',
      businessModel: 'api_service',
      monthlyRevenue: 8500, // $8,500/mo (Mid MRR)
      pricingModel: '$29 per lease audit',
      activeCustomers: 290,
      launchTimeframe: '5 days',
      monetizationStrategy: 'Pay-per-scan tool for prospective renters reviewing lease PDF agreements.',
      founderStoryOrTraction: 'Featured on r/personalfinance, generating $8.5k/mo on autopilot.',
      acquisitionChannel: 'University student Facebook groups and Reddit city subreddits',
      cloneBlueprint: ['PDF drag-and-drop landing page', 'Run Gemini red-flag clause extraction', 'Charge $29 via LemonSqueezy'],
    },
  },
];

test('filterProblems filters by revenueTier', () => {
  const baseFilter: FilterOptions = {
    domain: 'all',
    category: 'all',
    searchQuery: '',
    severity: 'all',
    sortBy: 'opportunity',
    timeRange: 'all_year',
    revenueTier: 'high_mrr',
  };

  const highMrr = filterProblems(mockProblems, baseFilter);
  assert.equal(highMrr.length, 1);
  assert.equal(highMrr[0].onlineBusiness?.businessName, 'PaidNice AI');

  const midMrr = filterProblems(mockProblems, { ...baseFilter, revenueTier: 'mid_mrr' });
  assert.equal(midMrr.length, 2); // $12,800 and $8,500
});

test('filterProblems filters by past 1 year time ranges', () => {
  const baseFilter: FilterOptions = {
    domain: 'all',
    category: 'all',
    searchQuery: '',
    severity: 'all',
    sortBy: 'opportunity',
    timeRange: 'last_30_days',
    revenueTier: 'all',
  };

  const last30 = filterProblems(mockProblems, baseFilter);
  assert.equal(last30.length, 1);
  assert.equal(last30[0].id, 'prob-1');

  const last1Year = filterProblems(mockProblems, { ...baseFilter, timeRange: 'last_1_year' });
  assert.equal(last1Year.length, 3); // All 3 problems are within past 1 year

  // Test specific month filter '2025-11'
  const specificMonth = filterProblems(mockProblems, { ...baseFilter, timeRange: '2025-11' });
  assert.equal(specificMonth.length, 1);
  assert.equal(specificMonth[0].id, 'prob-3');
});

test('sortProblems sorts by monthly revenue', () => {
  const sorted = sortProblems(mockProblems, 'revenue');
  assert.equal(sorted[0].onlineBusiness?.monthlyRevenue, 34500);
  assert.equal(sorted[1].onlineBusiness?.monthlyRevenue, 12800);
  assert.equal(sorted[2].onlineBusiness?.monthlyRevenue, 8500);
});

test('calculateStats aggregates online business MRR and top earner', () => {
  const stats = calculateStats(mockProblems);
  // Total MRR: 34500 + 12800 + 8500 = 55800
  assert.equal(stats.totalMonthlyRevenueTracked, 55800);
  assert.equal(stats.avgMonthlyRevenue, Math.round(55800 / 3));
  assert.equal(stats.topEarningBusiness.name, 'PaidNice AI');
  assert.equal(stats.topEarningBusiness.revenue, 34500);
});

test('formatMRR formats currency figures properly', () => {
  assert.equal(formatMRR(34500), '$34,500/mo');
  assert.equal(formatMRR(0), 'Pre-revenue / New');
});

test('filterProblems filters by sourceType live vs archive', () => {
  const baseFilter: FilterOptions = {
    domain: 'all',
    category: 'all',
    searchQuery: '',
    severity: 'all',
    sortBy: 'opportunity',
    timeRange: 'all_year',
    revenueTier: 'all',
  };

  const live = filterProblems(mockProblems, { ...baseFilter, sourceType: 'live' });
  // prob-1 is from 2026-10-15 (within last 14 days)
  assert.equal(live.length, 1);
  assert.equal(live[0].id, 'prob-1');

  const archive = filterProblems(mockProblems, { ...baseFilter, sourceType: 'archive' });
  // prob-2 (April 2026) and prob-3 (Nov 2025) are historical
  assert.equal(archive.length, 2);
});
