import { ApplicationError } from '@/protocols';

export function notFoundError(resource?: string): ApplicationError {
  return {
    name: 'notFoundError',
    message: `${resource || 'Not found!'}`,
  };
}
