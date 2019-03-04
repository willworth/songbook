# Songbook

This is a simple CRUD application built with Node, EJS and mongoDB.

To run the app yourself, you will need to set up your own database connection, which you can do for free with [mongodb atlas](https://www.mongodb.com/cloud/atlas).

## dot env files

For security, sensitive data is not (or, least, shouldn't be) stored on github.  One way to organise this is with a .env file.  These aren't added to git repos, and so the data isn't shared.  There's a good beginner's article about env files [here](https://medium.com/@thejasonfile/using-dotenv-package-to-create-environment-variables-33da4ac4ea8f).

For this project, that means that you'll need a mongo cloud atlas connection string (as linked above) and you need to save your string in the env file in this format:
```bash
dbstring=mongodb+srv://YOURPERSONALSTRINGHERE
```
If you need help, please ask! :)

```bash

npm i
npm run dev // runs nodemon for hot reloading.
```