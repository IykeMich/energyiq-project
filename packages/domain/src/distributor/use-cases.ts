import type { DistributorApi } from './ports';
import type {
  Distributor,
  DistributorUpsertRequest,
  DistributorListParams,
  DistributorListResult,
} from './types';

// ════════════════════════════════════════════════════════════════
// Distributor use cases — thin orchestration over the DistributorApi port.
// Pure TypeScript. No React. No HTTP.
// ════════════════════════════════════════════════════════════════

export class DistributorUseCases {
  private api: DistributorApi;

  constructor(api: DistributorApi) {
    this.api = api;
  }

  async createDistributor(req: DistributorUpsertRequest): Promise<Distributor> {
    return this.api.createDistributor(req);
  }

  async getDistributor(id: string): Promise<Distributor> {
    return this.api.getDistributor(id);
  }

  async updateDistributor(id: string, req: DistributorUpsertRequest): Promise<Distributor> {
    return this.api.updateDistributor(id, req);
  }

  async deleteDistributor(id: string): Promise<void> {
    return this.api.deleteDistributor(id);
  }

  async listDistributors(params?: DistributorListParams): Promise<DistributorListResult> {
    return this.api.listDistributors(params);
  }

  async activateDistributor(id: string): Promise<Distributor> {
    return this.api.activateDistributor(id);
  }
}
