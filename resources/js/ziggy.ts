// resources/js/ziggy.ts
import { Config, RouteParamsWithQueryOverload, route as ziggyRoute } from 'ziggy-js';
import { Ziggy } from './ziggy-config';

export const route = (name: Parameters<typeof ziggyRoute>[0], params?: RouteParamsWithQueryOverload, absolute?: boolean) =>
  ziggyRoute(name, params, absolute, Ziggy);

export { Ziggy };
export type { Config as ZiggyConfig } from 'ziggy-js';
export type { RouteParamsWithQueryOverload } from 'ziggy-js';