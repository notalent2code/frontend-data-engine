export const enumReplacer = (value: string) => {
  return value.replace(/_/g, ' ').toUpperCase();
}
