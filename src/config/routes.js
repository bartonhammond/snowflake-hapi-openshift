var AccountRoutes = require('../routes/account/endpoints'),
    GeneralRoutes = require('../routes/general/endpoints'),
    RestrictedRoutes = require('../routes/restricted/endpoints');

var internals = {};

internals.routes = [].concat(AccountRoutes.endpoints,
                             GeneralRoutes.endpoints,
                             RestrictedRoutes.endpoints);

internals.init = function (server) {

  server.route(internals.routes);
};

module.exports = internals;
