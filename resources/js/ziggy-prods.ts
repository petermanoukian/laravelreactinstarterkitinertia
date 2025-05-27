export const prodRoutes = {


  'superadmin.prods.index': {
    uri: 'superadmin/prods/view/{catid?}/{subid?}',
    methods: ['GET'],
    parameters: ['catid', 'subid'],
  },


   'superadmin.prod.edit': {
    uri: 'superadmin/prod/{id}/edit',
    methods: ['GET'],
    parameters: ['id'],
  },
  'superadmin.prod.update': {
    uri: 'superadmin/prod/update/{id}',
    methods: ['POST', 'PUT'],
    parameters: ['id'],
  },

  'superadmin.prod.destroy': {
    uri: 'superadmin/prod/delete/{id}',
    methods: ['DELETE'],
    parameters: ['id'],
  },
  'superadmin.prods.destroyAll': {
    uri: 'superadmin/prods/delete-multiple',
    methods: ['POST'],
    parameters: [],
  },
  
};