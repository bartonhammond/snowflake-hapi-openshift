var internals = {};

internals.plugins = function () {
  return [
    {
      register: require('hapi-auth-jwt'),
      options: {}
    },
    {
      register: require('good'),
      options: {
        opsInterval: 1000,
        reporters: [{
          reporter: require('good-console'),
          events: { log: '*', response: '*', request: '*' }
        }]
      }
    }
  ];
};

module.exports.get = internals.plugins;
