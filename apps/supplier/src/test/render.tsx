import { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from '@energyiq/store';
import { uiSlice } from '@energyiq/store';

// ════════════════════════════════════════════════════════════════
// renderWithProviders — wraps component with Redux + Query + Router.
// Use this for ALL component/form/page tests.
// ════════════════════════════════════════════════════════════════

function createTestStore() {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
      ui: uiSlice.reducer,
    },
  });
}

type TestStore = ReturnType<typeof createTestStore>;

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: TestStore;
  route?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    store = createTestStore(),
    route = '/',
    ...renderOptions
  }: RenderWithProvidersOptions = {},
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={[route]}>
            {children}
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );
  }

  return {
    store,
    queryClient,
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
