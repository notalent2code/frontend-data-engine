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
