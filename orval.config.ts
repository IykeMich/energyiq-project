import { defineConfig } from 'orval';

export default defineConfig({
  energyiq: {
    input: {
      // Points to the Go backend's generated swagger spec
      // In dev: http://localhost:8080/openapi.json
      // In CI: use the file path from the backend repo
      target: '../energyiq-api/docs/swagger.json',
    },
    output: {
      // Generated code goes into the adapter layer
      target: './src/adapter/api/generated',
      schemas: './src/adapter/api/generated/schemas',
      mode: 'tags-split', // one file per tag (Auth, Distributor, Order, etc.)
      client: 'react-query',
      override: {
        mutator: {
          path: './src/adapter/api/fetcher.ts',
          name: 'fetcher',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },
});
