import {InjectionToken} from '@angular/core';

export let ROUTES_CONFIG = new InjectionToken('routes.config');

const basePaths = {
  orders: 'orders',
};

const routesNames = {
  home: '',
  error404: '404',
  orders: {
    basePath: basePaths.orders
  }
};

export const RoutesConfig: any = {
  routesNames,
  routes: {
    home: `/${routesNames.home}`,
    error404: `/${routesNames.error404}`,
    orders: {
      detail: getOrderDetail
    }
  }
};

export function getOrderDetail(id) {
  return `/${basePaths.orders}/${id}`;
}
