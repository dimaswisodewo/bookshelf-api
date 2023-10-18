const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const Qs = require('qs');

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
    query: {
      parser: (query) => Qs.parse(query),
    },
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
