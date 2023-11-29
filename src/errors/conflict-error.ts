export function conflictError(resource?: string) {
  return {
    name: 'conflictError',
    message: `${resource || 'Already exixts!'}`,
  };
}
