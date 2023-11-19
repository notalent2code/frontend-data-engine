import { enumReplacer } from "@/util";
import { InstrumentType, StartupCategory, StartupStage, StartupStatus } from "@prisma/client";

const startupCategoryValues = Object.values(StartupCategory);
const startupStageValues = Object.values(StartupStage);
const startupStatusValues = Object.values(StartupStatus);

const investorTypeValues = Object.values(InstrumentType);

export type StartupSelectOption = {
  label: string;
  value: StartupCategory | StartupStage | StartupStatus;
};

export type InvestorSelectOption = {
  label: string;
  value: InstrumentType;
};

export const startupCategoryOptions: StartupSelectOption[] = startupCategoryValues.map(
  (value) => ({
    value,
    label: enumReplacer(value),
  })
);

export const startupStageOptions: StartupSelectOption[] = startupStageValues.map(
  (value) => ({
    value,
    label: enumReplacer(value),
  })
);

export const startupStatusOptions: StartupSelectOption[] = startupStatusValues.map(
  (value) => ({
    value,
    label: enumReplacer(value),
  })
);

export const investorTypeOptions: InvestorSelectOption[] = investorTypeValues.map(
  (value) => ({
    value,
    label: enumReplacer(value),
  })
);