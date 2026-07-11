import { defineConfig } from 'orval';

// One Orval generation feeds both apps via the @energyiq/api package.
// Run `yarn generate` from the repo root after the backend regenerates
// energyiq-swagger.json.
export default defineConfig({
  energyiq: {
    input: './.orval-input/energyiq-swagger.json',
    output: {
      mode: 'tags-split',
      target: './packages/api/src/generated',
      schemas: './packages/api/src/generated/schemas',
      client: 'react-query',
      httpClient: 'fetch',
      override: {
        mutator: {
          path: './packages/api/src/fetcher.ts',
          name: 'fetcher',
        },
        query: {
          useQuery: true,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'echo "Generated client into packages/api/src/generated"',
    },
  },
});
