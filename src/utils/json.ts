/**
 * obj => json string
 */
export function jsonEncode(obj: any, init = '{}', prettier = false): string {
  try {
    return prettier ? JSON.stringify(obj, undefined, 4) : JSON.stringify(obj);
  } catch (error) {
    return init;
  }
}

/**
 * json string => obj
 */
export function jsonDecode(json: string, defaultValue = {}): any {
  try {
    return JSON.parse(json);
  } catch (error) {
    return defaultValue;
  }
}
