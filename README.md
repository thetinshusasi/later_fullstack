## Installation

### 1. Install pnpm and Nest CLI

Before setting up the project, make sure you have `pnpm` and `Nest CLI` installed on your system.

#### 1.1 Install pnpm

If `pnpm` is not already installed, you can install it globally using the following command:

```bash
npm install -g pnpm
pnpm --version

npm install -g @nestjs/cli

nest --version

```

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ docker-compose up -d pgadmin db
$ pnpm run start


# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

This Markdown content provides clear instructions for installing necessary tools and setting up the development environment.
