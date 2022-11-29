export const isDateObject = (value: unknown): value is Date =>
  value instanceof Date;

export default isDateObject;
