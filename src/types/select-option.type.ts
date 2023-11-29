import { enumReplacer } from "@/util";
import { AlumniCluster, AlumniFundingStage, AlumniIndustryCluster, AlumniProductCluster, InstrumentType, Role, StartupCategory, StartupIntake, StartupStage, StartupStatus } from "@prisma/client";

const startupCategoryValues = Object.values(StartupCategory);
const startupStageValues = Object.values(StartupStage);
const startupStatusValues = Object.values(StartupStatus);
const startupIntakeValues = Object.values(StartupIntake);

const alumniClusterValues = Object.values(AlumniCluster);
const alumniProductClusterValues = Object.values(AlumniProductCluster);
const alumniIndustryClusterValues = Object.values(AlumniIndustryCluster);
const alumniFundingStageValues = Object.values(AlumniFundingStage);

const instrumentTypeValues = Object.values(InstrumentType);

const userRoleValues = Object.values(Role);

export type StartupSelectOption = {
  label: string;
  value: StartupCategory | StartupStage | StartupStatus | StartupIntake
  | AlumniCluster | AlumniFundingStage | AlumniProductCluster | AlumniIndustryCluster
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

export const startupIntakeOptions: StartupSelectOption[] = startupIntakeValues.map(
  (value) => ({
    value,
    label: enumReplacer(value),
  })
);

export const AlumniClusterOptions: StartupSelectOption[] = alumniClusterValues.map(
  (value) => ({
    value,
    label: enumReplacer(value),
  })
);

export const AlumniProductClusterOptions: StartupSelectOption[] = alumniProductClusterValues.map(
  (value) => ({
    value,
    label: enumReplacer(value),
  })
);

export const AlumniIndustryClusterOptions: StartupSelectOption[] = alumniIndustryClusterValues.map(
  (value) => ({
    value,
    label: enumReplacer(value),
  })
);

export const AlumniFundingStageOptions: StartupSelectOption[] = alumniFundingStageValues.map(
  (value) => ({
    value,
    label: enumReplacer(value),
  })
);

export const instrumentTypeOptions: InvestorSelectOption[] = instrumentTypeValues.map(
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