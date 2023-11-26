export const parseInvestorArray = (focusedSectors: string[]): string[] => {
  if (focusedSectors.length === 1) {
    // Regular expression to match commas that are not inside parentheses
    const regex = /,(?![^(]*\))/g;
    return focusedSectors[0].split(regex).map(sector => sector.trim());
  }
  return focusedSectors;
}

export const createCommaSeparatedArray = (inputString: string): string[] => {
  const upperCaseInput = inputString.toUpperCase();
  const sectorsArray = upperCaseInput.split(',').map(sector => sector.trim());
  return sectorsArray.filter(sector => sector !== '');
}
