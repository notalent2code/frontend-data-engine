import { enumReplacer } from "@/util";
import { StartupCategory } from "@prisma/client";

const startupCategoryValues = Object.values(StartupCategory);

export type SelectOption = {
  label: string;
  value: StartupCategory;
};

export const startupCategoryOptions: SelectOption[] = startupCategoryValues.map(
  (value) => ({
    value,
    label: enumReplacer(value),
  })
);