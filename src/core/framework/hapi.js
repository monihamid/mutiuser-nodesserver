const Hapi = require('hapi')
const Inert = require('inert')
const Vision = require('vision')
const fs = require('fs')
//const Bell = require('bell');
const {config} = require( '../config')
const {NODE_ENV} = require('../config')
const HapiSwagger = require('hapi-swagger');
const routesFolder = __dirname + '../routes';
const path = require('path')
const Pack = require('../../../package')

let server;
//let plugins;
const defaultRoutes = path.resolve(__dirname, '../routes')
let authRoutes = path.resolve(__dirname, '../../api/routes')
const routes = [];

// fs.readdirSync(__dirname)
//   //.filter(file => file != 'index.js')
//   .forEach(file => {
//
//     routes = routes.concat(require(__dirname, '../routes' +`${file}`))
//
//   });



module.exports = routes;

const plugins = [
  {
    plugin: require('hapi-api-version'),
    options: {
      validVersions: [1],
      defaultVersion: 1,
      vendorName: 'NodeSetUp'
    }
  },
  //require('hapi-auth-cookie-jwt')
];
plugins.push(Inert)
plugins.push(Vision)

plugins.push({
  plugin: HapiSwagger,
      options: {
        debug: true,
        host: config.default.hapi.swagger.host,
        schemes: config.default.hapi.swagger.schemes,
        info: {
          'title': 'Node set-up Documentation',
          'version': Pack.version
        },
        // securityDefinitions: {
        //   jwt: {
        //     type: 'apiKey',
        //     name: 'Authorization',
        //     in: 'header'
        //   }
        // },
        pathPrefixSize: 3
      }
})




//process.setMaxListeners(20);
const hapi = {
//export default {
  start: async (routeDirs) => {
      // if (server)
      //   return server
        routeDirs = routeDirs || []
        routeDirs.push(defaultRoutes)
      try {
        let connection = {port:config.default.hapi.port, host: config.default.hapi.host, routes: {cors: {origin: ['*'], credentials: true}}}
        server = new Hapi.Server(connection)
        server.realm.modifiers.route.prefix = config.default.hapi.prefix   //'/api/v1';
        //console.log(`Server prefix ${config.default.hapi.prefix}`);
        await server.register(plugins)
        //await server.register(Bell)  // for authenticate with facebook or...
        //setupAuth(server)
        await server.start()
        //logger.info(`API Server running at: ${server.info.uri}`)
        console.log(`Server is running at ${server.info.uri}`);
        createRoutes(server, routeDirs);
        //server.route(routes);
        return server
      } catch (e) {
        //logger.error(e);
        throw e
      }
    }

  }

  function createRoutes (server, routeDirs) {
  routeDirs.forEach(route => {
    let files = fs.readdirSync(route)
    files.forEach(file => {
      if (file.indexOf('.js') > -1) {
        routesFolder.server       //routeFolder is filepaths
        //require(route + '/' + file).default(server)
      }
    })
  })
}

//require('./app/routes')(app, passport).

function setupAuthRoute (server, authRoutes) {
  server.route({
    method: 'GET',
    path: '/.well-known/acme-challenge',
    handler: function (request, reply) {
      var req = request.raw.req
      var res = request.raw.res

      reply.close(false)
      acme(req, res)
    }
  })
}
//module.exports.server = server;


  module.exports.hapi = hapi;
  
