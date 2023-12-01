import { enumReplacer, parseSynergyConfidenceLevel } from "@/util";
import { AlumniCluster, AlumniFundingStage, AlumniIndustryCluster, AlumniProductCluster, ContractStatus, InstrumentType, PeopleJobTitle, ProjectStatus, Role, StartupCategory, StartupIntake, StartupStage, StartupStatus, StrategicBusinessPoint, SynergyConfidenceLevel, SynergyModel, SynergyOutput, SynergyProgress } from "@prisma/client";

const startupCategoryValues = Object.values(StartupCategory);
const startupStageValues = Object.values(StartupStage);
const startupStatusValues = Object.values(StartupStatus);
const startupIntakeValues = Object.values(StartupIntake);

const alumniClusterValues = Object.values(AlumniCluster);
const alumniProductClusterValues = Object.values(AlumniProductCluster);
const alumniIndustryClusterValues = Object.values(AlumniIndustryCluster);
const alumniFundingStageValues = Object.values(AlumniFundingStage);

const peopleJobTitleValues = Object.values(PeopleJobTitle);

const contractStatusValues = Object.values(ContractStatus);

const instrumentTypeValues = Object.values(InstrumentType);

const synergyProgressValues = Object.values(SynergyProgress);
const synergyModelValues = Object.values(SynergyModel);
const synergyOutputValues = Object.values(SynergyOutput);
const synergyConfidenceLevelValues = Object.values(SynergyConfidenceLevel);
const synergyProjectStatusValues = Object.values(ProjectStatus);

const strategicBusinessPointValues = Object.values(StrategicBusinessPoint);

const userRoleValues = Object.values(Role);

export type StartupSelectOption = {
  label: string;
  value: StartupCategory | StartupStage | StartupStatus | StartupIntake
  | AlumniCluster | AlumniFundingStage | AlumniProductCluster | AlumniIndustryCluster
};

export type PeopleSelectOption = {
  label: string;
  value: PeopleJobTitle;
};

export type ContractSelectOption = {
  label: string;
  value: ContractStatus;
};

export type InvestorSelectOption = {
  label: string;
  value: InstrumentType;
};

export type SynergySelectOption = {
  label: string;
  value: SynergyProgress | SynergyModel | SynergyOutput
  | SynergyConfidenceLevel | ProjectStatus;
};

export type StrategicSelectOption = {
  label: string;
  value: StrategicBusinessPoint;
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

export const alumniClusterOptions: StartupSelectOption[] = alumniClusterValues.map(
  (value) => ({
    value,
    label: enumReplacer(value),
  })
);

export const alumniProductClusterOptions: StartupSelectOption[] = alumniProductClusterValues.map(
  (value) => ({
    value,
    label: enumReplacer(value),
  })
);

export const alumniIndustryClusterOptions: StartupSelectOption[] = alumniIndustryClusterValues.map(
  (value) => ({
    value,
    label: enumReplacer(value),
  })
);

export const alumniFundingStageOptions: StartupSelectOption[] = alumniFundingStageValues.map(
  (value) => ({
    value,
    label: enumReplacer(value),
  })
);

export const peopleJobTitleOptions: PeopleSelectOption[] = peopleJobTitleValues.map(
  (value) => ({
    value,
    label: enumReplacer(value),
  })
);

export const contractStatusOptions: ContractSelectOption[] = contractStatusValues.map(
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

export const synergyProgressOptions: SynergySelectOption[] = synergyProgressValues.map(
  (value) => ({
    value,
    label: enumReplacer(value),
  })
);

export const synergyModelOptions: SynergySelectOption[] = synergyModelValues.map(
  (value) => ({
    value,
    label: enumReplacer(value),
  })
);

export const synergyOutputOptions: SynergySelectOption[] = synergyOutputValues.map(
  (value) => ({
    value,
    label: enumReplacer(value),
  })
);

export const synergyConfidenceLevelOptions: SynergySelectOption[] = synergyConfidenceLevelValues.map(
  (value) => ({
    value,
    label: parseSynergyConfidenceLevel(value),
  })
);

export const synergyProjectStatusOptions: SynergySelectOption[] = synergyProjectStatusValues.map(
  (value) => ({
    value,
    label: enumReplacer(value),
  })
);

export const strategicBusinessPointOptions: StrategicSelectOption[] = strategicBusinessPointValues.map(
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