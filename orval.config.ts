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
        // Our custom `fetcher` mutator always throws on non-2xx responses
        // (see packages/api/src/fetcher.ts), so a query's resolved `data`
        // can never actually be one of the documented error schemas. Without
        // this, orval types every query's TData as `Success | Error` purely
        // from the swagger's documented status codes, forcing every call
        // site to narrow away an error variant that can never occur.
        fetch: {
          forceSuccessResponse: true,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'echo "Generated client into packages/api/src/generated"',
    },
  },
});
