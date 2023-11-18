import {
  Alumni, Contract, FinancialReport, GrowthStrategy,
  Location, People, Performance, ProblemSolutionFit,
  RevenueModel, Service, StartupCategory,
  StartupIntake,
  StartupStage,
  StartupStatus,
  StartupToInvest, Strategic, Synergy
} from '@prisma/client';

export type StartupSummary = {
  count: number;
  incubation: number;
  acceleration: number;
  alumni: number;
  games: number;
  fund_of_funds: number;
  active: number;
  partnership: number;
  total_revenue: bigint;
  total_funding: bigint;
};

export type StartupSectors = Record<StartupCategory, {
  PV: number;
  BMV: number;
  MV: number;
}>;

export type GameStages = {
  total: number;
  alpha_stage: number;
  beta_stage: number;
  gold_stage: number;
};

export type StartupRevenue = {
  startup_id: number;
  startup_name: string;
  startup_logo_url: string;
  yearly_revenue: string;
  year: number;
};

export type StartupDetail = {
  id: number;
  name: string;
  description: string;
  category: StartupCategory;
  latest_stage: StartupStage;
  status: StartupStatus;
  intake_type: StartupIntake;
  intake_year: number;
  pitchdeck_url: string;
  website_url: string;
  logo_url: string;
  created_at: Date;
  updated_at: Date;
  Location: Location;
  Alumni: Alumni;
  Contract: Contract;
  FinancialReport: FinancialReport[];
  GrowthStrategy: GrowthStrategy[];
  People: People[];
  Performance: Performance[];
  ProblemSolutionFit: ProblemSolutionFit[];
  RevenueModel: RevenueModel[];
  Service: Service[];
  StartupToInvest: StartupToInvest[];
  Strategic: Strategic[];
  Synergy: Synergy[];
};