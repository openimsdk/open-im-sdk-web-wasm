export function formatResponse(
  data: unknown,
  errCode?: number,
  errMsg?: string
): any {
  let serializedData = data;
  if (typeof data === 'object') {
    serializedData = JSON.stringify(data);
  }

  return {
    data: data !== undefined ? serializedData : '{}',
    errCode: errCode || 0,
    errMsg: errMsg || '',
  };
}
