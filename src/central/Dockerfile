FROM node:slim
WORKDIR /whatsapp

COPY package*.json /whatsapp
COPY src/wrapper.js /whatsapp
RUN npm install fastify axios --ignore-scripts && npm cache clean --force

RUN mkdir /whatsapp/server
COPY src/wrapper.js /whatsapp
COPY src/central/ /whatsapp/server

EXPOSE $PORT_CENTRAL

USER node
CMD ["node", "server/server.js"]
