export function isString(value: unknown) {
  return typeof value === 'string';
}

export function isNumber(value: unknown) {
  return typeof value === 'number';
}

export function isBoolean(value: unknown) {
  return typeof value === 'boolean';
}

export function isUndefined(value: unknown) {
  return typeof value === 'undefined';
}

export function isObject(value: unknown) {
  return typeof value === 'object' && value !== null;
}

export function isFunction(value: unknown) {
  return typeof value === 'function';
}
