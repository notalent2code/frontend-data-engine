import { StartupCategory } from "@prisma/client";

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
