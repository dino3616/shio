// eslint-disable-next-line import/no-extraneous-dependencies
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000/graphql',
  documents: ['src/infra/graphql/document/**/*.gql'],
  generates: {
    './src/infra/graphql/generated/graphql.ts': {
      config: {
        scalars: {
          DateTime: Date,
        },
      },
      plugins: ['typescript', 'typescript-operations', 'typescript-urql'],
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;
