import type {
  Distributor,
  DistributorUpsertRequest,
  DistributorListParams,
} from './types';

// ════════════════════════════════════════════════════════════════
// Outbound port — interface the distributor domain needs.
// Implemented by the DistributorApiAdapter in @energyiq/api.
// ════════════════════════════════════════════════════════════════

export interface DistributorApi {
  createDistributor(req: DistributorUpsertRequest): Promise<Distributor>;
  getDistributor(id: string): Promise<Distributor>;
  updateDistributor(id: string, req: DistributorUpsertRequest): Promise<Distributor>;
  deleteDistributor(id: string): Promise<void>;
  listDistributors(params?: DistributorListParams): Promise<Distributor[]>;
  activateDistributor(id: string): Promise<Distributor>;
}
