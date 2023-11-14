const enumReplacer = (value: string) => {
  return value.replace(/_/g, ' ').toUpperCase();
}

export default enumReplacer;