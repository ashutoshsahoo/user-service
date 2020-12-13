# user-service

Sample Node.js Rest API project.

## Start application

```sh
docker-compose up -d
```

## Stop application

```sh
docker-compose down
```

Use provided postman collection to create user and get a token to verify end points.

## Run application in dev or test mode

To run application in dev or test mode, first start a mongodb server and update the url in `.env` file.

```sh
npm test
npm run dev
```

## Update dependencies

- Discover new releases of the packages.

  ```sh
  npm outdated
  ```

- Update to a new major version.

  ```sh
  npm install -g npm-check-updates
  ```

- Upgrade all the version hints.

  ```sh
  ncu -u
  npm update
  npm install
  ```
