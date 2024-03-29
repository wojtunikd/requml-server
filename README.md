# ReqUML Public Server

This is the public server of the ReqUML application whose main role is to accept new orders with user stories, save them to the database, initiate new orders by communicating with the protected server (Flask) and inform users via email once their analysis is complete.


# Installation

Run the following command to install all the packages required to start the server. These are all open-source MIT-licenced packages that are core for Express.js (Node.js) applications.
> npm install

  
## Environment variables

These are the environment variable required to run the application:
> CAPTCHA_API=
> CAPTCHA_SECRET=
> MONGODB_CONNECTION=
> SENDGRID_KEY=
> JWT_TOKEN=
> PYEMAIL=
> PYPASSWORD=
> API_URL=

# Running the server

To run the server after installing the packages and filling in the environment variables with correct values, run the following command:
> npm start
  

# API Endpoints

> POST /api/stories

This route triggers a function which validates new user stories, verifies the CAPTCHA, sanitizes text of each story, creates a new Order object with all user stories and inserts it to the MongoDB database.

> GET /api/orders/uc/:ucParam

This route is used for retrieving all analysed use cases for a specific order based on a unique use case parameter from the URL.

> GET /api/orders/class/:classParam

This route is used for retrieving all analysed classes for a specific order based on a unique class parameter from the URL.


# Folder structure and files

Folder *middleware* contains files with helper functions for some operations on data before it reaches to actual route function. Files:

 1. input-sanitize.js: contains the sanitizeText function 

Folder *models* contains files with the mongoose schemas of objects that will be stored in the database. Files:

 1. order.js: contains the Order schema for the MongoDB database
 2. process.js: contains the Process schema for the MongoDB database
 3. user-story.js: contains the User Story schema which is part of Order

Folder *routes* contains a file that defines the routes of the API and the specific functions that are invoked when a route is called. Files:

 1. routes.js: contains all the API routes available and the functions that handle the request, database connection and the response

Folder *utils* contains files with helper services and constant string messages (for errors or HTTP responses). Folders and files:

 1. emails > mailingService.js: contains the Email service that sends an email to the user once their analysis is complete
 2. scheduler > initiateOrder.js: contains the function that initiates the analysis of new orders and invokes the Email service once the analysis is complete
 3. response-messages.js: contains a list of string messages for HTTP responses

*Root* folder mostly contains core Express.js files required for the normal operation of the application. Files:

 1. .env: contains all environment variables of the application
 2. .gitignore: contains a list of folders and files that should not be pushed to the Git repository
 3. app.js: the main entry point of the application where the database connection is established and the server starts listening on a given port
 4. Avowal.txt: the statement certifying that the project is my own work
 5. package-log.json: Node.js config file
 6. package.json: Node.js config file
 7. Procfile: Heroku config file
 8. README: the current file

 # Deployment

 The server is deployed on Heroku and can be accessed via URL:
 > https://requml-node.herokuapp.com