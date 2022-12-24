FROM node:slim
WORKDIR /whatsapp

COPY package*.json /whatsapp
RUN npm install --omit=dev --ignore-scripts && npm cache clean --force

RUN mkdir server
COPY src/scheduler/ server
COPY src/wrapper.js /whatsapp

EXPOSE $PORT_EVENT

USER node
CMD ["node", "server/server.js"]
