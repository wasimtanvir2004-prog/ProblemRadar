export type ProblemDomain = 'all' | 'business' | 'daily_life';

export type ProblemCategory = 
  | 'operations'
  | 'productivity'
  | 'ecommerce'
  | 'freelance'
  | 'finance'
  | 'lifestyle'
  | 'health'
  | 'marketing'
  | 'legal'
  | 'real_estate';

export type SeverityLevel = 'critical' | 'high' | 'medium';
export type MonetizationPotential = 'very_high' | 'high' | 'medium' | 'low';

export interface ProblemSource {
  platform: 'reddit' | 'hackernews' | 'twitter' | 'forum';
  subreddit?: string;
  author?: string;
  url?: string;
  postedAt: string; // ISO string across past 1 year
  upvotes: number;
  commentCount: number;
}

export interface AISolvability {
  score: number; // 0 - 100
  bestApproach: 'autonomous_agent' | 'scheduled_automation' | 'browser_extension' | 'webhook_pipeline' | 'rag_assistant';
  estimatedBuildTime: string;
  recommendedStack: string[];
}

export interface AgentArchitectureStep {
  stepNumber: number;
  title: string;
  toolOrAction: string;
  description: string;
}

export interface AgentInputSchemaField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  placeholder?: string;
  defaultValue?: string;
  options?: string[];
  helpText?: string;
}

export interface AgentExecutionResult {
  runId: string;
  timestamp: string;
  input: Record<string, any>;
  output: string;
  executionSteps: Array<{
    stepNumber: number;
    title: string;
    status: 'completed' | 'in_progress' | 'failed';
    durationMs: number;
    detail: string;
  }>;
  timeSavedEstimate: string;
  deliverables?: Array<{
    name: string;
    type: 'markdown' | 'json' | 'email' | 'table';
    content: string;
  }>;
}

export interface AgentSolution {
  problemId: string;
  agentName: string;
  tagline: string;
  overview: string;
  architecture: {
    triggers: string[];
    steps: AgentArchitectureStep[];
    outputs: string[];
  };
  systemPrompt: string;
  inputSchema: AgentInputSchemaField[];
  samplePayload: Record<string, any>;
  automationCode: {
    pythonScript: string;
    n8nWorkflowJson: string;
    webhookCurl: string;
  };
  createdDate: string;
  lastRunResult?: AgentExecutionResult;
  isDeployed?: boolean;
}

export interface OnlineBusinessSolution {
  businessName: string;
  businessModel: 'micro_saas' | 'productized_service' | 'ai_automation_agency' | 'chrome_extension' | 'api_service' | 'workflow_template';
  monthlyRevenue: number; // Monthly recurring revenue in USD (e.g., 18500 = $18,500/mo)
  pricingModel: string; // e.g. "$49/month or $490/year"
  activeCustomers: number; // e.g. 340 paying users
  launchTimeframe: string; // e.g. "7 - 14 days"
  monetizationStrategy: string; // Clear explanation of how they make money
  founderStoryOrTraction: string; // Real or benchmarked traction proof
  acquisitionChannel: string; // Where customers come from (e.g. SEO, Reddit organic, Cold DM)
  cloneBlueprint: string[]; // Practical steps for the user to launch this online business
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  originalQuote: string;
  source: ProblemSource;
  domain: 'business' | 'daily_life';
  category: ProblemCategory;
  severity: SeverityLevel;
  monetizationPotential: MonetizationPotential;
  frequencyScore: number; // 1-100
  willingnessToPayScore: number; // 1-100
  opportunityScore: number; // Computed metric 1-100
  frustrationKeywords: string[];
  targetAudience: string;
  aiSolvability: AISolvability;
  status: 'unsolved' | 'analyzing' | 'agent_ready' | 'agent_deployed';
  isSaved?: boolean;
  agentSolution?: AgentSolution;
  onlineBusiness?: OnlineBusinessSolution; // Online business making money from solving this problem
}

export interface FilterOptions {
  domain: ProblemDomain;
  category: string;
  searchQuery: string;
  severity: string;
  sortBy: 'opportunity' | 'revenue' | 'trending' | 'newest' | 'solvability';
  timeRange: 'all_year' | 'last_30_days' | 'last_90_days' | 'last_6_months' | 'last_1_year' | string;
  revenueTier: 'all' | 'high_mrr' | 'mid_mrr' | 'starter_mrr';
}

export interface ProblemStats {
  totalTracked: number;
  dailyLifeCount: number;
  businessCount: number;
  agentReadyCount: number;
  estimatedMonthlyHoursSavable: number;
  avgSolvabilityScore: number;
  totalMonthlyRevenueTracked: number; // Total MRR of all businesses in catalog
  avgMonthlyRevenue: number; // Average MRR
  topEarningBusiness: {
    name: string;
    revenue: number;
  };
}
