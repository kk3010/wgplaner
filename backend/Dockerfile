FROM node:lts-alpine

WORKDIR /app/common

COPY ./common .

WORKDIR /app/backend

# copy both 'package.json' and 'package-lock.json' (if available)
COPY ./backend/package*.json ./

# install project dependencies
RUN npm install

COPY ./backend .

RUN npm run build

EXPOSE 5000

CMD [ "npm", "run", "start:prod" ]
