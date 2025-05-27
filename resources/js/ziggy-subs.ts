export const subRoutes = {

 'superadmin.subs.index': {
    uri: 'superadmin/subs/view/{catid?}',
    methods: ['GET'],
    parameters: ['catid'],
  },

  'superadmin.sub.edit': {
    uri: 'superadmin/sub/{id}/edit',
    methods: ['GET'],
    parameters: ['id'],
  },
  'superadmin.sub.update': {
    uri: 'superadmin/sub/update/{id}',
    methods: ['POST', 'PUT'],
    parameters: ['id'],
  },

  'superadmin.sub.destroy': {
    uri: 'superadmin/sub/delete/{id}',
    methods: ['DELETE'],
    parameters: ['id'],
  },
  'superadmin.subs.destroyAll': {
    uri: 'superadmin/subs/delete-multiple',
    methods: ['POST'],
    parameters: [],
  },

}