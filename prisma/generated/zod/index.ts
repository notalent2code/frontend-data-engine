import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// DECIMAL
//------------------------------------------------------

export const DecimalJSLikeSchema: z.ZodType<Prisma.DecimalJsLike> = z.object({ d: z.array(z.number()), e: z.number(), s: z.number(), toFixed: z.function().args().returns(z.string()), });

export const DecimalJSLikeListSchema: z.ZodType<Prisma.DecimalJsLike[]> = z.object({ d: z.array(z.number()), e: z.number(), s: z.number(), toFixed: z.function().args().returns(z.string()), }).array();

export const DECIMAL_STRING_REGEX = /^[0-9.,e+-bxffo_cp]+$|Infinity|NaN/;

export const isValidDecimalInput =
  (v?: null | string | number | Prisma.DecimalJsLike): v is string | number | Prisma.DecimalJsLike => {
    if (v === undefined || v === null) return false;
    return (
      (typeof v === 'object' && 'd' in v && 'e' in v && 's' in v && 'toFixed' in v) ||
      (typeof v === 'string' && DECIMAL_STRING_REGEX.test(v)) ||
      typeof v === 'number'
    )
  };

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted', 'ReadCommitted', 'RepeatableRead', 'Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id', 'first_name', 'last_name', 'phone_number', 'email', 'password', 'role', 'status', 'refresh_token', 'created_at', 'updated_at']);

export const PasswordResetsScalarFieldEnumSchema = z.enum(['id', 'email', 'token', 'created_at']);

export const InvestorScalarFieldEnumSchema = z.enum(['id', 'user_id', 'name', 'appetites', 'instrument_type', 'investment_stage', 'investment_syndication', 'investor_classification', 'focused_sectors', 'remarks', 'ticket_size_min', 'ticket_size_max', 'created_at', 'updated_at']);

export const StartupToInvestScalarFieldEnumSchema = z.enum(['id', 'startup_id', 'investor_id', 'progress', 'detail', 'created_at', 'updated_at']);

export const StartupScalarFieldEnumSchema = z.enum(['id', 'name', 'description', 'category', 'latest_stage', 'status', 'intake_type', 'intake_year', 'pitchdeck_url', 'website_url', 'logo_url', 'created_at', 'updated_at']);

export const LocationScalarFieldEnumSchema = z.enum(['id', 'startup_id', 'address', 'latitude', 'longitude', 'created_at', 'updated_at']);

export const PeopleScalarFieldEnumSchema = z.enum(['id', 'startup_id', 'name', 'phone_number', 'email', 'job_title', 'privy_id', 'photo_url', 'qr_code_url', 'linkedin_url', 'created_at', 'updated_at']);

export const PerformanceScalarFieldEnumSchema = z.enum(['id', 'startup_id', 'year', 'performance_update', 'people_update', 'product_update', 'action_plan', 'created_at', 'updated_at']);

export const ContractScalarFieldEnumSchema = z.enum(['id', 'startup_id', 'pks_number', 'signed_pks_date', 'closing_bak_date', 'total_funding', 'convertible_note', 'convertible_note_year', 'convertible_note_months', 'convertible_note_status', 'created_at', 'updated_at']);

export const FinancialReportScalarFieldEnumSchema = z.enum(['id', 'startup_id', 'year', 'yearly_revenue', 'monthly_revenue', 'valuation', 'created_at', 'updated_at']);

export const SynergyScalarFieldEnumSchema = z.enum(['id', 'startup_id', 'telkom_group', 'entity', 'model', 'description', 'progress', 'lead_time_week', 'output', 'confidence_level', 'project_status', 'initiation_date', 'created_at', 'updated_at']);

export const StrategicScalarFieldEnumSchema = z.enum(['id', 'startup_id', 'business_point', 'description', 'created_at', 'updated_at']);

export const ServiceScalarFieldEnumSchema = z.enum(['id', 'startup_id', 'title', 'revenue_percentage', 'created_at', 'updated_at']);

export const ProblemSolutionFitScalarFieldEnumSchema = z.enum(['id', 'startup_id', 'title', 'description', 'created_at', 'updated_at']);

export const GrowthStrategyScalarFieldEnumSchema = z.enum(['id', 'startup_id', 'description', 'created_at', 'updated_at']);

export const RevenueModelScalarFieldEnumSchema = z.enum(['id', 'startup_id', 'description', 'created_at', 'updated_at']);

export const AlumniScalarFieldEnumSchema = z.enum(['id', 'startup_id', 'cluster', 'product_cluster', 'industry_cluster', 'current_funding_stage', 'is_product_stopped_or_vacuum', 'is_product_active_but_not_developed', 'is_startup_disband', 'is_startup_developed_other_product', 'created_at', 'updated_at']);

export const SortOrderSchema = z.enum(['asc', 'desc']);

export const QueryModeSchema = z.enum(['default', 'insensitive']);

export const NullsOrderSchema = z.enum(['first', 'last']);

export const InvestmentProgressSchema = z.enum(['STOP_NOT_INTEREST', 'DUE_DILIGENCE_DATAROOM', 'INTRO', 'FOLLOW_UP_MEETING', 'OFFERING']);

export type InvestmentProgressType = `${z.infer<typeof InvestmentProgressSchema>}`

export const StrategicBusinessPointSchema = z.enum(['TRACTION', 'PARTNERSHIP', 'BUSINESS_MODEL']);

export type StrategicBusinessPointType = `${z.infer<typeof StrategicBusinessPointSchema>}`

export const ProjectStatusSchema = z.enum(['APPROACHING', 'CONTRACT_DEAL_SIGN', 'DELIVERY_OGP', 'POC', 'PRICE_CONTRACT_NEGO', 'SOLUTION_OFFERING']);

export type ProjectStatusType = `${z.infer<typeof ProjectStatusSchema>}`

export const SynergyConfidenceLevelSchema = z.enum(['PERCENT_0_TO_20', 'PERCENT_21_TO_40', 'PERCENT_41_TO_60', 'PERCENT_61_TO_80', 'PERCENT_81_TO_100']);

export type SynergyConfidenceLevelType = `${z.infer<typeof SynergyConfidenceLevelSchema>}`

export const SynergyOutputSchema = z.enum(['MOM_KESEPAKATAN', 'PKS', 'INVOICE', 'BAK', 'NDA', 'OGP', 'SPK', 'BAK_HARGA', 'MOU', 'SPH', 'DIGITAL_TOUCH_POINT', 'HOLD']);

export type SynergyOutputType = `${z.infer<typeof SynergyOutputSchema>}`

export const SynergyProgressSchema = z.enum(['DONE', 'ADMINISTRATION_FOLLOW_UP', 'TECHNICAL_FOLLOW_UP', 'INITIAL_MEETING', 'DROP', 'HOLD']);

export type SynergyProgressType = `${z.infer<typeof SynergyProgressSchema>}`

export const SynergyModelSchema = z.enum(['CO_CREATION', 'TELKOM_SERVICE', 'VENDORSHIP', 'GO_TO_MARKET']);

export type SynergyModelType = `${z.infer<typeof SynergyModelSchema>}`

export const ContractStatusSchema = z.enum(['AKTIF', 'DIBEBANKAN', 'ALIH_KELOLA']);

export type ContractStatusType = `${z.infer<typeof ContractStatusSchema>}`

export const PeopleJobTitleSchema = z.enum(['CEO', 'CTO', 'CIO', 'COO', 'CPO', 'CBO', 'CFO', 'CMO', 'CCO', 'CRO', 'CMS', 'FOUNDER', 'CO_FOUNDER', 'PRESIDENT_FOUNDER', 'CEO_FOUNDER', 'CHAIR_WOMAN', 'MANAGING_DIRECTOR', 'APP_SUPPORT', 'GENERAL_AFFAIRS', 'BUSINESS_SALES', 'PRODUCT_CREATIVE', 'RESEARCH_DEVELOPMENT']);

export type PeopleJobTitleType = `${z.infer<typeof PeopleJobTitleSchema>}`

export const AlumniFundingStageSchema = z.enum(['PRE_SEED', 'SEED', 'ANGEL']);

export type AlumniFundingStageType = `${z.infer<typeof AlumniFundingStageSchema>}`

export const AlumniIndustryClusterSchema = z.enum(['MSME', 'FARMING', 'ENTERPRISE', 'ENVIRONMENT_AND_SUSTAINABILITY', 'AGRICULTURE', 'EDUCATION', 'LOGISTIC', 'FISHERIES', 'SMART_CITY', 'LIFESTYLE', 'MOBILE_GAMES', 'IT_SECURITY', 'TRAVEL_AND_TOURISM', 'FINANCE_AND_BANKING', 'HEALTH', 'PROPERTY', 'GOV_AND_PUBLIC_SERVICE', 'MEDIA', 'LEGAL_AND_PARTNERSHIP', 'OTHERS', 'PC_GAMES']);

export type AlumniIndustryClusterType = `${z.infer<typeof AlumniIndustryClusterSchema>}`

export const AlumniProductClusterSchema = z.enum(['SAAS', 'FINTECH', 'MARKET_PLACE', 'IOT', 'APPLICATION', 'BIGDATA_AI', 'VR_AR', 'EDUCATION']);

export type AlumniProductClusterType = `${z.infer<typeof AlumniProductClusterSchema>}`

export const AlumniClusterSchema = z.enum(['DOG', 'QUESTION_MARK', 'CASHCOW', 'STAR']);

export type AlumniClusterType = `${z.infer<typeof AlumniClusterSchema>}`

export const StartupStatusSchema = z.enum(['AKTIF', 'ALUMNI', 'DIBEBANKAN', 'TRANSFER', 'FOF']);

export type StartupStatusType = `${z.infer<typeof StartupStatusSchema>}`

export const StartupIntakeSchema = z.enum(['REGULAR', 'GAMES', 'INCIDENTAL']);

export type StartupIntakeType = `${z.infer<typeof StartupIntakeSchema>}`

export const StartupStageSchema = z.enum(['PV_STAGE', 'BMV_STAGE', 'MV_STAGE', 'ALPHA_STAGE', 'BETA_STAGE', 'GOLD_STAGE', 'CV_STAGE', 'MDI']);

export type StartupStageType = `${z.infer<typeof StartupStageSchema>}`

export const StartupCategorySchema = z.enum(['AGRICULTURE', 'BIG_DATA', 'EDUCATION', 'ECOMMERCE', 'ENTERPRISE', 'FINTECH', 'GAMES', 'HEALTH', 'HRIS', 'IOT', 'LOGISTIC', 'SMART_CITY', 'SME', 'TRAVEL_TOURISM', 'VIRTUALIZATION', 'ADTECH_ENTERPRISE']);

export type StartupCategoryType = `${z.infer<typeof StartupCategorySchema>}`

export const InstrumentTypeSchema = z.enum(['CN', 'EQUITY', 'CN_EQUITY']);

export type InstrumentTypeType = `${z.infer<typeof InstrumentTypeSchema>}`

export const InvestmentStageSchema = z.enum(['PRE_SEED', 'SEED', 'PRE_SERIES_A', 'SERIES_A', 'SERIES_B', 'ABOVE_SERIES_B', 'PRE_IPO', 'SECONDARIES', 'UNDISCLOSED']);

export type InvestmentStageType = `${z.infer<typeof InvestmentStageSchema>}`

export const InvestmentSyndicationSchema = z.enum(['FOLLOW', 'LEAD', 'DOMINANT_FOLLOW', 'DOMINANT_LEAD']);

export type InvestmentSyndicationType = `${z.infer<typeof InvestmentSyndicationSchema>}`

export const InvestorClassificationSchema = z.enum(['MAINSTREAM_AGNOSTIC', 'SPECIFIC_SECTOR', 'IMPACT_INVESTMENT']);

export type InvestorClassificationType = `${z.infer<typeof InvestorClassificationSchema>}`

export const RoleSchema = z.enum(['INVESTOR', 'ADMIN']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

export const StatusSchema = z.enum(['ACTIVE', 'INACTIVE']);

export type StatusType = `${z.infer<typeof StatusSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: RoleSchema,
  status: StatusSchema,
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  phone_number: z.string(),
  email: z.string(),
  password: z.string(),
  refresh_token: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// PASSWORD RESETS SCHEMA
/////////////////////////////////////////

export const PasswordResetsSchema = z.object({
  id: z.number().int(),
  email: z.string(),
  token: z.string(),
  created_at: z.coerce.date(),
})

export type PasswordResets = z.infer<typeof PasswordResetsSchema>

/////////////////////////////////////////
// INVESTOR SCHEMA
/////////////////////////////////////////

export const InvestorSchema = z.object({
  instrument_type: InstrumentTypeSchema,
  investment_stage: InvestmentStageSchema.array(),
  investment_syndication: InvestmentSyndicationSchema,
  investor_classification: InvestorClassificationSchema,
  id: z.string(),
  user_id: z.string().nullable(),
  name: z.string(),
  appetites: z.string(),
  focused_sectors: z.string().array(),
  remarks: z.string(),
  ticket_size_min: z.bigint(),
  ticket_size_max: z.bigint(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

export type Investor = z.infer<typeof InvestorSchema>

/////////////////////////////////////////
// STARTUP TO INVEST SCHEMA
/////////////////////////////////////////

export const StartupToInvestSchema = z.object({
  progress: InvestmentProgressSchema,
  id: z.string(),
  startup_id: z.number().int(),
  investor_id: z.string(),
  detail: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

export type StartupToInvest = z.infer<typeof StartupToInvestSchema>

/////////////////////////////////////////
// STARTUP SCHEMA
/////////////////////////////////////////

export const StartupSchema = z.object({
  category: StartupCategorySchema,
  latest_stage: StartupStageSchema,
  status: StartupStatusSchema,
  intake_type: StartupIntakeSchema,
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  intake_year: z.number().int(),
  pitchdeck_url: z.string(),
  website_url: z.string(),
  logo_url: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

export type Startup = z.infer<typeof StartupSchema>

/////////////////////////////////////////
// LOCATION SCHEMA
/////////////////////////////////////////

export const LocationSchema = z.object({
  id: z.string(),
  startup_id: z.number().int(),
  address: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

export type Location = z.infer<typeof LocationSchema>

/////////////////////////////////////////
// PEOPLE SCHEMA
/////////////////////////////////////////

export const PeopleSchema = z.object({
  job_title: PeopleJobTitleSchema,
  id: z.string(),
  startup_id: z.number().int(),
  name: z.string(),
  phone_number: z.string().nullable(),
  email: z.string().nullable(),
  privy_id: z.string().nullable(),
  photo_url: z.string().nullable(),
  qr_code_url: z.string().nullable(),
  linkedin_url: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

export type People = z.infer<typeof PeopleSchema>

/////////////////////////////////////////
// PERFORMANCE SCHEMA
/////////////////////////////////////////

export const PerformanceSchema = z.object({
  id: z.string(),
  startup_id: z.number().int(),
  year: z.number().int(),
  performance_update: z.string().nullable(),
  people_update: z.string().nullable(),
  product_update: z.string().nullable(),
  action_plan: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

export type Performance = z.infer<typeof PerformanceSchema>

/////////////////////////////////////////
// CONTRACT SCHEMA
/////////////////////////////////////////

export const ContractSchema = z.object({
  convertible_note_status: ContractStatusSchema,
  id: z.string(),
  startup_id: z.number().int(),
  pks_number: z.string(),
  signed_pks_date: z.coerce.date(),
  closing_bak_date: z.coerce.date(),
  total_funding: z.bigint(),
  convertible_note: z.union([z.number(), z.string(), DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: "Field 'convertible_note' must be a Decimal. Location: ['Models', 'Contract']", }),
  convertible_note_year: z.number().int(),
  convertible_note_months: z.number().int(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

export type Contract = z.infer<typeof ContractSchema>

/////////////////////////////////////////
// FINANCIAL REPORT SCHEMA
/////////////////////////////////////////

export const FinancialReportSchema = z.object({
  id: z.string(),
  startup_id: z.number().int(),
  year: z.number().int(),
  yearly_revenue: z.bigint(),
  monthly_revenue: z.bigint(),
  valuation: z.bigint(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

export type FinancialReport = z.infer<typeof FinancialReportSchema>

/////////////////////////////////////////
// SYNERGY SCHEMA
/////////////////////////////////////////

export const SynergySchema = z.object({
  model: SynergyModelSchema,
  progress: SynergyProgressSchema,
  output: SynergyOutputSchema,
  confidence_level: SynergyConfidenceLevelSchema,
  project_status: ProjectStatusSchema,
  id: z.string(),
  startup_id: z.number().int(),
  telkom_group: z.string(),
  entity: z.string(),
  description: z.string(),
  lead_time_week: z.number().int(),
  initiation_date: z.coerce.date(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

export type Synergy = z.infer<typeof SynergySchema>

/////////////////////////////////////////
// STRATEGIC SCHEMA
/////////////////////////////////////////

export const StrategicSchema = z.object({
  business_point: StrategicBusinessPointSchema,
  id: z.string(),
  startup_id: z.number().int(),
  description: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

export type Strategic = z.infer<typeof StrategicSchema>

/////////////////////////////////////////
// SERVICE SCHEMA
/////////////////////////////////////////

export const ServiceSchema = z.object({
  id: z.string(),
  startup_id: z.number().int(),
  title: z.string(),
  revenue_percentage: z.number().int(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

export type Service = z.infer<typeof ServiceSchema>

/////////////////////////////////////////
// PROBLEM SOLUTION FIT SCHEMA
/////////////////////////////////////////

export const ProblemSolutionFitSchema = z.object({
  id: z.string(),
  startup_id: z.number().int(),
  title: z.string(),
  description: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

export type ProblemSolutionFit = z.infer<typeof ProblemSolutionFitSchema>

/////////////////////////////////////////
// GROWTH STRATEGY SCHEMA
/////////////////////////////////////////

export const GrowthStrategySchema = z.object({
  id: z.string(),
  startup_id: z.number().int(),
  description: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

export type GrowthStrategy = z.infer<typeof GrowthStrategySchema>

/////////////////////////////////////////
// REVENUE MODEL SCHEMA
/////////////////////////////////////////

export const RevenueModelSchema = z.object({
  id: z.string(),
  startup_id: z.number().int(),
  description: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

export type RevenueModel = z.infer<typeof RevenueModelSchema>

/////////////////////////////////////////
// ALUMNI SCHEMA
/////////////////////////////////////////

export const AlumniSchema = z.object({
  cluster: AlumniClusterSchema,
  product_cluster: AlumniProductClusterSchema,
  industry_cluster: AlumniIndustryClusterSchema,
  current_funding_stage: AlumniFundingStageSchema,
  id: z.string(),
  startup_id: z.number().int(),
  is_product_stopped_or_vacuum: z.boolean(),
  is_product_active_but_not_developed: z.boolean(),
  is_startup_disband: z.boolean(),
  is_startup_developed_other_product: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

export type Alumni = z.infer<typeof AlumniSchema>
