export function invalidParamError(resource?: string) {
  return {
    name: 'invalidParamError',
    message: `${resource || 'Invalid params error'} `,
  };
}
