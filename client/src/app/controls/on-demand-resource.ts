import { signal, ResourceStatus, Resource } from '@angular/core';

export type DemandResource<T, P> = Omit<Resource<T>, 'hasValue'> & {
  reload: (params: P) => Promise<void>;
};

export const demandResource = <T, P>(options: {
  defaultValue: NoInfer<T>;
  loader: (params: P) => Promise<T>;
}): DemandResource<T, P> => {
  const isLoading = signal(false);
  const error = signal<Error | undefined>(undefined);
  const status = signal<ResourceStatus>('idle');
  const value = signal<T>(options.defaultValue);

  return {
    isLoading,
    value,
    status,
    error,
    reload: async (params: P) => {
      value.set(options.defaultValue);
      error.set(undefined);
      isLoading.set(true);
      status.set('loading');

      try {
        const result = await options.loader(params);
        value.set(result);
      } catch (ex) {
        if (ex instanceof Error) {
          error.set(ex);
        } else {
          error.set(new Error(<any>ex));
        }
        status.set('error');
      } finally {
        isLoading.set(false);
      }

      status.set('resolved');
    },
  };
};
