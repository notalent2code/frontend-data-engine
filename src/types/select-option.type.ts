import { enumReplacer } from "@/util";
import { InstrumentType, Role, StartupCategory, StartupStage, StartupStatus } from "@prisma/client";

const startupCategoryValues = Object.values(StartupCategory);
const startupStageValues = Object.values(StartupStage);
const startupStatusValues = Object.values(StartupStatus);

const investorTypeValues = Object.values(InstrumentType);

const userRoleValues = Object.values(Role);

export type StartupSelectOption = {
  label: string;
  value: StartupCategory | StartupStage | StartupStatus;
};

export type InvestorSelectOption = {
  label: string;
  value: InstrumentType;
};

export type UserRoleSelectOption = {
  label: string;
  value: Role;
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

export const userRoleOptions: UserRoleSelectOption[] = userRoleValues.map(
  (value) => ({
    value,
    label: enumReplacer(value),
  })
);