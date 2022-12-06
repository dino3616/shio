<h1 align="center">manaslu</h1>
<h2 align="center">Boilerplate for developers using Next.js and NestJS in monorepo.</h2>

![banner](./doc/banner.jpg)

## Features

Manaslu is a boilerplate for developers using Next.js and NestJS in monorepo.  
The goal is to increase development efficiency by focusing on modern technologies.  
Come on, let's go climbing!

### frontend

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Storybook](https://storybook.js.org/)
- [Chromatic](https://www.chromatic.com/)
- [URQL](https://formidable.com/open-source/urql/)
- [graphql-codegen](https://graphql-code-generator.com/)

### backend

- [NestJS](https://nestjs.com/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [GraphQL](https://graphql.org/)

### infrastructure

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [devcontainer](https://code.visualstudio.com/docs/remote/containers)
- [GitHub Codespaces](https://github.com/features/codespaces)

### other

- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Husky](https://typicode.github.io/husky/)

## Setup MongoDB as Replica Set

```powershell
docker compose -f "./docker/docker-compose.development.yml" -p manaslu exec mongo mongosh --eval "rs.initiate({_id: 'rs-manaslu', members: [{_id: 0, host: 'mongo:27017'}]});"
```
