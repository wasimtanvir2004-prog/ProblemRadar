import { Problem, FilterOptions, ProblemStats, AgentInputSchemaField } from '../types';

/**
 * Calculates a composite commercial & practical opportunity score (1-100)
 * Weights: Willingness to pay (40%), Frequency of problem occurrence (35%), AI feasibility (25%)
 */
export function calculateOpportunityScore(
  frequency: number,
  willingnessToPay: number,
  solvability: number
): number {
  const f = Math.max(0, Math.min(100, frequency));
  const w = Math.max(0, Math.min(100, willingnessToPay));
  const s = Math.max(0, Math.min(100, solvability));

  const weighted = f * 0.35 + w * 0.40 + s * 0.25;
  return Math.round(weighted);
}

/**
 * Estimates hours saved per month by solving this problem with an AI Agent or automation.
 */
export function estimateSavedHoursPerMonth(problem: Problem): number {
  const baseHours = problem.domain === 'business' ? 24 : 12;
  const severityMultiplier = problem.severity === 'critical' ? 1.5 : problem.severity === 'high' ? 1.2 : 0.8;
  const frequencyFactor = (problem.frequencyScore / 100);
  return Math.max(2, Math.round(baseHours * severityMultiplier * frequencyFactor));
}

/**
 * Format currency to human readable string (e.g. $18,500/mo)
 */
export function formatMRR(amount: number | undefined): string {
  if (!amount || amount === 0) return 'Pre-revenue / New';
  return `$${amount.toLocaleString()}/mo`;
}

/**
 * Filters a list of problems based on domain, category, search query, severity, time range, and revenue tier.
 */
export function filterProblems(problems: Problem[], filters: FilterOptions): Problem[] {
  const now = new Date('2026-10-21T09:45:00Z').getTime();

  return problems.filter((problem) => {
    // Domain match
    if (filters.domain !== 'all' && problem.domain !== filters.domain) {
      return false;
    }

    // Category match
    if (filters.category !== 'all' && problem.category !== filters.category) {
      return false;
    }

    // Severity match
    if (filters.severity !== 'all' && problem.severity !== filters.severity) {
      return false;
    }

    // Revenue Tier match
    if (filters.revenueTier && filters.revenueTier !== 'all') {
      const rev = problem.onlineBusiness?.monthlyRevenue || 0;
      if (filters.revenueTier === 'high_mrr' && rev < 20000) return false;
      if (filters.revenueTier === 'mid_mrr' && (rev < 5000 || rev >= 20000)) return false;
      if (filters.revenueTier === 'starter_mrr' && rev >= 5000) return false;
    }

    // Source Type match: live vs 1-year historical archive
    if (filters.sourceType && filters.sourceType !== 'all') {
      const isLiveItem = problem.isLive === true || 
                         problem.id.startsWith('prob-discovered-') || 
                         problem.id.startsWith('prob-custom-') || 
                         new Date(problem.source.postedAt).getTime() > (now - 14 * 24 * 60 * 60 * 1000);
      if (filters.sourceType === 'live' && !isLiveItem) return false;
      if (filters.sourceType === 'archive' && isLiveItem) return false;
    }

    // Time Range match across past 1 year timeline
    if (filters.timeRange && filters.timeRange !== 'all_year') {
      const problemTime = new Date(problem.source.postedAt).getTime();
      const diffDays = Math.max(0, Math.floor((now - problemTime) / (1000 * 60 * 60 * 24)));

      if (filters.timeRange === 'last_30_days' && diffDays > 30) return false;
      if (filters.timeRange === 'last_90_days' && diffDays > 90) return false;
      if (filters.timeRange === 'last_6_months' && diffDays > 180) return false;
      if (filters.timeRange === 'last_1_year' && diffDays > 365) return false;

      // Check if specific month format YYYY-MM
      if (filters.timeRange.includes('-')) {
        const monthPrefix = problem.source.postedAt.slice(0, 7);
        if (monthPrefix !== filters.timeRange) return false;
      }
    }

    // Search query match (title, description, frustration keywords, business name, subreddit)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const inTitle = problem.title.toLowerCase().includes(q);
      const inDesc = problem.description.toLowerCase().includes(q);
      const inSubreddit = (problem.source.subreddit || '').toLowerCase().includes(q);
      const inAudience = problem.targetAudience.toLowerCase().includes(q);
      const inKeywords = problem.frustrationKeywords.some((kw) => kw.toLowerCase().includes(q));
      const inBusiness = problem.onlineBusiness?.businessName.toLowerCase().includes(q);
      const inModel = problem.onlineBusiness?.businessModel.toLowerCase().includes(q);

      if (!inTitle && !inDesc && !inSubreddit && !inAudience && !inKeywords && !inBusiness && !inModel) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sorts problems according to chosen strategy
 */
export function sortProblems(problems: Problem[], sortBy: FilterOptions['sortBy']): Problem[] {
  return [...problems].sort((a, b) => {
    switch (sortBy) {
      case 'revenue':
        return (b.onlineBusiness?.monthlyRevenue || 0) - (a.onlineBusiness?.monthlyRevenue || 0);
      case 'opportunity':
        return b.opportunityScore - a.opportunityScore;
      case 'trending':
        return (b.source.upvotes + b.source.commentCount * 2) - (a.source.upvotes + a.source.commentCount * 2);
      case 'newest':
        return new Date(b.source.postedAt).getTime() - new Date(a.source.postedAt).getTime();
      case 'solvability':
        return b.aiSolvability.score - a.aiSolvability.score;
      default:
        return 0;
    }
  });
}

/**
 * Computes aggregated metrics for the problems dashboard
 */
export function calculateStats(problems: Problem[]): ProblemStats {
  const totalTracked = problems.length;
  if (totalTracked === 0) {
    return {
      totalTracked: 0,
      dailyLifeCount: 0,
      businessCount: 0,
      agentReadyCount: 0,
      estimatedMonthlyHoursSavable: 0,
      avgSolvabilityScore: 0,
      totalMonthlyRevenueTracked: 0,
      avgMonthlyRevenue: 0,
      topEarningBusiness: { name: 'None', revenue: 0 },
    };
  }

  const dailyLifeCount = problems.filter((p) => p.domain === 'daily_life').length;
  const businessCount = problems.filter((p) => p.domain === 'business').length;
  const agentReadyCount = problems.filter((p) => p.status === 'agent_ready' || p.status === 'agent_deployed').length;

  const totalHours = problems.reduce((acc, p) => acc + estimateSavedHoursPerMonth(p), 0);
  const totalSolvability = problems.reduce((acc, p) => acc + p.aiSolvability.score, 0);

  // Online business revenue stats
  let totalRevenue = 0;
  let revenueCount = 0;
  let topBusiness = { name: 'None', revenue: 0 };

  for (const p of problems) {
    if (p.onlineBusiness && p.onlineBusiness.monthlyRevenue > 0) {
      totalRevenue += p.onlineBusiness.monthlyRevenue;
      revenueCount++;
      if (p.onlineBusiness.monthlyRevenue > topBusiness.revenue) {
        topBusiness = {
          name: p.onlineBusiness.businessName,
          revenue: p.onlineBusiness.monthlyRevenue,
        };
      }
    }
  }

  return {
    totalTracked,
    dailyLifeCount,
    businessCount,
    agentReadyCount,
    estimatedMonthlyHoursSavable: totalHours,
    avgSolvabilityScore: Math.round(totalSolvability / totalTracked),
    totalMonthlyRevenueTracked: totalRevenue,
    avgMonthlyRevenue: revenueCount > 0 ? Math.round(totalRevenue / revenueCount) : 0,
    topEarningBusiness: topBusiness,
  };
}

/**
 * Validates inputs against an agent's schema
 */
export function validateAgentInputs(
  schema: AgentInputSchemaField[],
  inputs: Record<string, any>
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  for (const field of schema) {
    const val = inputs[field.key];
    if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
      errors[field.key] = `${field.label} is required`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Format timestamp into relative display string
 */
export function formatTimeAgo(postedAt: string): string {
  try {
    const now = new Date('2026-10-21T09:45:00Z');
    const then = new Date(postedAt);
    const diffMs = now.getTime() - then.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    const months = Math.floor(diffDays / 30);
    if (months === 1) return '1 month ago';
    if (months < 12) return `${months} months ago`;
    return '1 year ago';
  } catch {
    return 'Past year';
  }
}
