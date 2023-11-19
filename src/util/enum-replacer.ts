import { SynergyConfidenceLevel } from "@prisma/client";

export const enumReplacer = (value: string) => {
  return value.replace(/_/g, ' ').toUpperCase();
}

export const parseSynergyConfidenceLevel = (value: SynergyConfidenceLevel) => {
  switch (value) {
    case SynergyConfidenceLevel.PERCENT_0_TO_20:
      return '0 - 20 %';
    case SynergyConfidenceLevel.PERCENT_21_TO_40:
      return '21 - 40 %';
    case SynergyConfidenceLevel.PERCENT_41_TO_60:
      return '41 - 60 %';
    case SynergyConfidenceLevel.PERCENT_61_TO_80:
      return '61 - 80 %';
    case SynergyConfidenceLevel.PERCENT_81_TO_100:
      return '81 - 100 %';
    default:
      return 'Unknown';
  }
}
