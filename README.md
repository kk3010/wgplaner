
# WG Planer

### Members: 
| name  | abbreviation  |
| ------------ | ------------ |
| Chris Robin Ennen  | ce053  |
| Karyna  Kachanovska  | kk153  |
|  Chris Heinz | ch148 |
|  Kai Schwabe |  ks204 |
|  Marc Müller | mm338 |


### Project abstract
The goal of our app is to make the life in a WG (Shared apartment) easier.
For that purpose our app offer a shopping list feature, where the users can add items to a shared shopping list. Our Split feature allows the user to split up costs they have as a household and so always track who paied what and who owes what to whom. 
In the shoppinglist view the users can easily add bought items directly to split.

Our Techstack consists of NestJS (using typescript) with PostgreSQL in the Backend and VueJS (using typescript) in the frontend. For our testing we decided to use Jest.
We use SSE (Server Sent Events) to update changes from one user to all users directly.

### Getting started Guide
Note: for this guide we asume basic computersience and development knowledge

1. Clone the Projekt with one of the following two commands in your local Filesystem: 
`git clone https://gitlab.mi.hdm-stuttgart.de/mwa/ws21/wgplaner.git`
or with ssh:
`git clone git@gitlab.mi.hdm-stuttgart.de:mwa/ws21/wgplaner.git`

2.  Open the directory you cloned the files into with a command shell and deploy the project via docker-compose use
` docker-compose up -d`

3. (Optional) If you want to populate the database with example data run
`docker-compose exec backend npm run seed`

4. Open the url: http://localhost:3000 in your Browser

5. Now you can Create a new account and create a new flat or join an existing one.