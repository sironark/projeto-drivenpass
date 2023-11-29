export function notFoundError(resource?: string) {
  return {
    name: 'notFoundError',
    message: `${resource || 'Not found!'}`,
  };
}
