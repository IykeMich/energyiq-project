import { configureStore as rtkConfigureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { authSlice } from './slices/auth';
import { uiSlice } from './slices/ui';

export const store = rtkConfigureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks — apps import from @energyiq/store.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// Re-exports for convenience.
export { configureStore } from './config';
export * from './slices/auth';
export * from './slices/ui';
