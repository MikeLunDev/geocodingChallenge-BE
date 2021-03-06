# Project Title

Back end of the coding challenge for Medwing.

# Project Description

This is a simple backend done with NodeJs and Express. 
It contains the CRUD for creating Markers that will be lately displayed on the map and also save them on a DB using mongoose.<br>
Front end repository [HERE](https://github.com/MikeLunDev/geocodingChallenge-FE)<br>
Live demo of the project [HERE](https://geocoding-markers-fe.herokuapp.com/)

## Running locally

**Clone the repository and install the dependencies:**

```sh
git clone https://github.com/MikeLunDev/geocodingChallenge-BE.git
cd geocodingChallenge-BE
npm i
```

**Run a mongo istance if you have mongo as a service:**

```sh
mongod
```

**Create a .env file with:**

- CONNECT_STRING_DB // will be the the mongo atlas connection string
- WHITE_LIST_ONLINE //address online that is whitelisted by cors() (not mandatory)
- WHITE_LIST_LOCAL //localhost address that is whitelisted by cors() (not mandatory)


**Run the server:**

```sh
npm run dev
```

## Running the tests

Test are made with [jest](https://www.npmjs.com/package/jest) and [supertest](https://www.npmjs.com/package/supertest).<br>
They are end to end testing the whole application.

**To run test start the mongo database istance:** (if you don't have mongo as a service you don't need this)

```sh
mongod
```

**Run the tests:**

```sh
npm run test
```

## Built With

* [Mongoose](https://www.npmjs.com/package/mongoose) 
* [NodeJs](https://nodejs.org/it/)
* [Express](https://www.npmjs.com/package/express) 

## DOCS

Docs can be found [HERE](https://geocoding-markers-be.herokuapp.com/docs).
They are written with OpenApi 3.0.1 leveraging on [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) and [yamljs](https://www.npmjs.com/package/yamljs) used to run yaml file in a NodeJs environment.


## Author

[Michele Lunati](https://github.com/MikeLunDev)
