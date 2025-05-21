// resources/js/ziggy-config.ts
import type { Config } from 'ziggy-js';

export const Ziggy: Config = {
  url: 'http://127.0.0.1:8000',
  port: 8000,
  defaults: {},
  routes: {
    /*
    'superadmin.user.update': {
      uri: 'superadmin/user/update/{id}',
      methods: ['POST', 'PUT'],
      parameters: ['id'],
    }, */
  
    'superadmin.user.create': {
    uri: 'superadmin/adduser',
    methods: ['GET'],
    parameters: [],
  },
  'superadmin.users.index': {
    uri: 'superadmin/users',
    methods: ['GET'],
    parameters: [],
  },
  'superadmin.user.store': {
    uri: 'superadmin/user/add',
    methods: ['POST'],
    parameters: [],
  },
  'superadmin.users.checkEmail': {
    uri: 'superadmin/users/check-email',
    methods: ['POST'],
    parameters: [],
  },
  'superadmin.user.edit': {
    uri: 'superadmin/user/{id}/edit',
    methods: ['GET'],
    parameters: ['id'],
  },
  'superadmin.user.update': {
    uri: 'superadmin/user/update/{id}',
    methods: ['POST', 'PUT'],
    parameters: ['id'],
  },
  'superadmin.users.destroy': {
    uri: 'superadmin/users/delete/{id}',
    methods: ['DELETE'],
    parameters: ['id'],
  },
  'superadmin.users.destroyAll': {
    uri: 'superadmin/users/delete-multiple',
    methods: ['POST'],
    parameters: [],
  },
    

  },
};
export const baseUrl = Ziggy.url;
export const port = Ziggy.port;