const multer = require('fastify-multer');
const path = require('path');
const {writeFile} = require('node:fs/promises');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // TODO: Check the existence of jobs
    cb(null, path.resolve(__dirname, './jobs'));
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

module.exports = async function(server, opts, done) {
  server.register(multer.contentParser);

  server.post('/add',
      {
        preHandler: upload.any(),
      },
      async (request, reply) => {
        let config = await server.config();
        config.push(request.body);
        config = JSON.stringify(config, null, 2);

        // TODO: Check conflicting file name
        await writeFile(
            path.resolve(__dirname, './jobs/config.json'),
            config,
        );

        await server.bree.add(request.body.name);
        await server.bree.start(request.body.name);

        reply.status(200).send('Sucess added job');
      });

  server.delete('/remove/:name', async (request, reply) => {
    let config = await server.config();

    for (let i = 0; i < config.length; i++) {
      if (config[i].name === request.params.name) {
        server.bree.stop(request.params.name);
        config.splice(i, 1);
        config = JSON.stringify(config, null, 2);
        await writeFile(path.resolve(__dirname, './jobs/config.json'), config);
      }
    }
    reply.status(200).send('Success deleting job');
  });

  server.put('/edit', async (request, reply) => {
    let config = await server.config();

    config.forEach((e, index) => {
      if (e.name === request.body.name) {
        const reqKeys = Object.keys(request.body);

        reqKeys.forEach((key) => {
          config[index][key] = request.body[key];
        });
      }
    });
    config = JSON.stringify(config, null, 2);
    await writeFile(path.resolve(__dirname, './jobs/config.json'), config);
    reply.status(200).send('Job edited');
  });
  done();
};
