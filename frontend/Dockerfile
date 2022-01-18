FROM node:16

WORKDIR /app/common

COPY ./common .

WORKDIR /app/frontend

# copy both 'package.json' and 'package-lock.json' (if available)
COPY ./frontend/package*.json ./

# install project dependencies
RUN npm install

COPY ./frontend .

RUN npm run build

EXPOSE 5000

CMD [ "./startup-frontend.sh" ]
