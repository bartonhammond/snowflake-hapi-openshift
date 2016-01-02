/**
 * # general/handlers.js
 *
 * Simple display of status and the environment we're running in
 *
 */
'use strict';

/**
* ## Declaration
*
*/
var internals = {};

/**
* ## status - are we alive?
*
*/
internals.index = function (req, reply) {
  reply('<h1>Hello Openshift!</h1>');
};
/**
* ## status - are we alive?
*
*/
internals.status = function (req, reply) {
  reply( {"status": "ok"} );
};

/**
* ## env - display the environment variables available
*
*/
internals.env = function (req, reply) {
  var content = 'Version: ' + process.version + '\n<br/>\n' +
        'Env: {<br/>\n<pre>';
  //  Add env entries.
  for (var k in process.env) {
    content += '   ' + k + ': ' + process.env[k] + '\n';
  }
  content += '}\n</pre><br/>\n';
  reply('<html>\n' +
        '  <head><title>Node.js Process Env</title></head>\n' +
        '  <body>\n<br/>\n' + content + '</body>\n</html>');

}

module.exports = internals;
