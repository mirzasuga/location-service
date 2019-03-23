FROM node:latest

RUN mkdir -p /usr/src/location-service
WORKDIR /usr/src/location-service

COPY package.json /usr/src/location-service
RUN npm install --silent

COPY . /usr/src/location-service

EXPOSE 3001

CMD ["npm", "start"]
