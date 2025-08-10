export const toStartCaseStr = (str: string) => {
  try {
    return str
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, (str, $1, $2) => $1 + " " + $2)
      .replace(/(\s|^)(\w)/g, (str, $1, $2) => $1 + $2.toUpperCase());
  } catch (error) {
    return str;
  }
};
