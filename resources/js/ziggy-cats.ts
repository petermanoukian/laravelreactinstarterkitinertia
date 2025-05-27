export const catRoutes = {

'superadmin.cats.index': {
    uri: 'superadmin/cats/view',
    methods: ['GET'],
    parameters: [],
  },

  'superadmin.cat.edit': {
    uri: 'superadmin/cat/{id}/edit',
    methods: ['GET'],
    parameters: ['id'],
  },
  'superadmin.cat.update': {
    uri: 'superadmin/cat/update/{id}',
    methods: ['POST', 'PUT'],
    parameters: ['id'],
  },

  'superadmin.cat.destroy': {
    uri: 'superadmin/cat/delete/{id}',
    methods: ['DELETE'],
    parameters: ['id'],
  },
  'superadmin.cats.destroyAll': {
    uri: 'superadmin/cats/delete-multiple',
    methods: ['POST'],
    parameters: [],
  },





}