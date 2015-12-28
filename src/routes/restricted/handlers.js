var internals = {};

internals.restrictedArea = function (req, reply) {

  reply({ message: req.auth.credentials.username + ', welcome to restricted area!' });
};

module.exports = internals;
