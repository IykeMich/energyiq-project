import {
  auth,
  distributor,
  employee,
  order,
  product,
  warehouse,
} from '@energyiq/domain';

import {
  AuthApiAdapter,
  DistributorApiAdapter,
  EmployeeApiAdapter,
  OrderApiAdapter,
  ProductApiAdapter,
  WarehouseApiAdapter,
  configureClient,
  configureEnv,
  configureFetcher,
} from '@energyiq/api';
import { configureStore } from '@energyiq/store';
import { LocalTokenStorage } from '@/adapter/storage/token';
import { LocalUserStorage } from '@/adapter/storage/user';
import { env } from './env';

// ════════════════════════════════════════════════════════════════
// Composition root — wire adapters to domain use cases.
// The ONLY place that knows about concrete implementations.
// Everything else depends on ports.
// ════════════════════════════════════════════════════════════════

// Inject the API base URL into @energyiq/api before any HTTP call.
configureEnv(env.apiBaseUrl);

// Adapters
const tokenStorage = new LocalTokenStorage();
const userStorage = new LocalUserStorage();
const authApi = new AuthApiAdapter();
const employeeApi = new EmployeeApiAdapter();
const orderApi = new OrderApiAdapter();
const productApi = new ProductApiAdapter();
const warehouseApi = new WarehouseApiAdapter();
const distributorApi = new DistributorApiAdapter();

// Domain use cases
export const authUseCases = new auth.AuthUseCases(authApi, tokenStorage, userStorage);
export const distributorUseCases = new distributor.DistributorUseCases(distributorApi);
export const employeeUseCases = new employee.EmployeeUseCases(employeeApi);
export const orderUseCases = new order.OrderUseCases(orderApi);
export const productUseCases = new product.ProductUseCases(productApi);
export const warehouseUseCases = new warehouse.WarehouseUseCases(warehouseApi);

// Wire token getter + refresh into both HTTP clients (manual + Orval).
configureClient(
  () => tokenStorage.getAccessToken(),
  () => authUseCases.refresh(),
);
configureFetcher(
  () => tokenStorage.getAccessToken(),
  () => authUseCases.refresh(),
);

// Hand the use-cases instance to @energyiq/store so its thunks can call them.
configureStore(authUseCases);
