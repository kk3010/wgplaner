# WG Planer

### Members:

| name               | abbreviation |
| ------------------ | ------------ |
| Chris Robin Ennen  | ce053        |
| Karyna Kachanovska | kk153        |
| Chris Heinz        | ch148        |
| Kai Schwabe        | ks204        |
| Marc Müller        | mm338        |

### Project abstract

The goal of our app is to make the life in a WG (shared apartment) easier.
For that purpose our app offers a shopping list feature, where the users can add items to a shared shopping list. Our Split feature allows the user to split up costs they have as a household and so always track who paid for what and who owes how much to whom.
In the shopping list view the users can easily add purchased items directly to split.

Our tech stack consists of NestJS with PostgreSQL in the backend and VueJS in the frontend. Both are including TypeScript support. For our testing we decided to use Jest.
We use SSE (Server Sent Events) to update changes from one user directly to all other users of a flat.

### Getting Started 🚀

Prerequisites: You should have node and

1. Clone the project with one of the following two commands into a directory of your choice.

   ```shell
   # with https
   $ git clone https://gitlab.mi.hdm-stuttgart.de/mwa/ws21/wgplaner.git
   # with ssh
   $ git clone git@gitlab.mi.hdm-stuttgart.de:mwa/ws21/wgplaner.git
   ```

2. You can start the project with docker by running the following command in the project directory.

   ```shell
    $ docker-compose up
   ```

   For development you can also use the _docker-compose.development.yml_ file to start the containers.

   ```shell
   $ docker-compose -f docker-compose.yml -f docker-compose.development.yml up
   ```

3. If you want to populate the database with example data run while the backend container is running.

   ```shell
   $ docker-compose exec backend npm run seeddevelopment.yml up
   ```

4. Open the following links in your browser

- http://localhost:4000 to see the project in your browser
- http://localhost:5000 to view the OpenAPI schema of the backend
- http://localhost:8080 for an interface to interact with the database

Now you can create a new account with a new flat or join an existing one. Enjoy trying out our application!
