// Orval refuses to generate from a Swagger 2.0 doc that has any path with an
// empty `responses: {}` object (invalid per spec). A handful of stub backend
// endpoints (Approval, Authorization, Branding, Tenant) haven't had their
// response schemas written yet and ship that way. Rather than touch the
// backend-owned source doc, patch a local copy with a placeholder response
// for those endpoints only, and point orval at the copy.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.resolve(rootDir, '../../energyiq-swagger.json');
const outputDir = path.resolve(rootDir, '../.orval-input');
const outputPath = path.join(outputDir, 'energyiq-swagger.json');

const swagger = JSON.parse(readFileSync(sourcePath, 'utf-8'));

let patchedCount = 0;

// A few presign endpoints (Distributor/Own Onboarding) $ref a shared
// "APIResponse" base envelope via `allOf` that the backend's swagger export
// never actually defines under `definitions`, which orval refuses to
// generate from. Patch in the same envelope shape every other response uses
// (see e.g. `EmptyResponse`) rather than touching the backend-owned source doc.
if (!swagger.definitions?.APIResponse) {
  swagger.definitions ??= {};
  swagger.definitions.APIResponse = {
    type: 'object',
    properties: {
      responseCode: { type: 'string', example: 'EIQ-0000' },
      responseMessage: { type: 'string', example: 'Request successful' },
    },
  };
  patchedCount += 1;
}

for (const [pathTemplate, pathItem] of Object.entries(swagger.paths ?? {})) {
  const pathParamNames = [...pathTemplate.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]);

  for (const operation of Object.values(pathItem)) {
    if (operation?.responses && Object.keys(operation.responses).length === 0) {
      operation.responses = {
        200: { description: 'Not yet documented by the backend.' },
      };
      patchedCount += 1;
    }

    if (pathParamNames.length > 0) {
      operation.parameters ??= [];
      const declaredNames = new Set(
        operation.parameters.filter((param) => param.in === 'path').map((param) => param.name),
      );
      for (const paramName of pathParamNames) {
        if (!declaredNames.has(paramName)) {
          operation.parameters.push({
            name: paramName,
            in: 'path',
            required: true,
            type: 'string',
          });
          patchedCount += 1;
        }
      }
    }
  }
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputPath, JSON.stringify(swagger, null, 2));

console.log(`Patched ${patchedCount} stub endpoint(s) with empty responses; wrote ${outputPath}`);
