import {InjectionToken} from '@angular/core';

export let ENDPOINTS_CONFIG = new InjectionToken('endpoints.config');

export const EndpointsConfig: any = {
  orders: {
    list: 'orders',
    detail: getOrderDetail
  }
};

export function getOrderDetail(id) {
  return `/orders/${id}`;
}
