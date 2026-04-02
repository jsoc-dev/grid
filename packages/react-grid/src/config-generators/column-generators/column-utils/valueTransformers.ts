import { encode, type UJSONValue } from "@jsoc/utils";

export const booleanToString = (value: boolean) => {
  return value.toString();
};

/**
 * Converts a string date to a Date object for use in date columns.
 * Note: No validation is performed on the string date. Since this
 * function is supposed to be used in `stringDateColumnGenerator`,
 * we can assume that the string date is already validated.
 */
export const stringDateToDate = (value: string) => {
  return new Date(value);
};

export const ujsonValueToString = (value: UJSONValue) => {
  return encode(value);
};
