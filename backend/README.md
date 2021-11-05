# WG Planer Backend

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Migrations

For local development you may set `TYPEORM_SYNCHRONIZE` to `true`

### Generation

It is advisable to use migrations for production environments.
So here's how to generate migrations in two simple steps

1. `npm run build` to generate .js files from the entities
2. `typeorm migration:generate -n <EntityName>` - this generates the migration file under `src/migrations`

The next time `npm run build` is run the migration files will be compiled to the `dist/migrations` directory and will be applied automatically on startup due to the `TYPEORM_MIGRATIONS_RUN` variable being set to `true`

## License

Nest is [MIT licensed](LICENSE).
