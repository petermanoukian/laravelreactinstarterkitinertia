export const taggRoutes = 
{
   'superadmin.taggs.index': {
    uri: 'superadmin/taggs/view',
    methods: ['GET'],
    parameters: [],
  },


   'superadmin.tagg.edit': {
    uri: 'superadmin/tagg/{id}/edit',
    methods: ['GET'],
    parameters: ['id'],
  },
  'superadmin.tagg.update': {
    uri: 'superadmin/tagg/update/{id}',
    methods: ['POST', 'PUT'],
    parameters: ['id'],
  },

  'superadmin.tagg.destroy': {
    uri: 'superadmin/tagg/delete/{id}',
    methods: ['DELETE'],
    parameters: ['id'],
  },
  'superadmin.taggs.destroyAll': {
    uri: 'superadmin/taggs/delete-multiple',
    methods: ['POST'],
    parameters: [],
  },
}