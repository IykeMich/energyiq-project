import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { auth } from '@energyiq/domain';
import { authUseCases } from '../config';

// ════════════════════════════════════════════════════════════════
// State
// ════════════════════════════════════════════════════════════════

interface AuthState {
  user: auth.AuthUser | null;
  loginType: auth.LoginType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  registrationToken: string | null;
  accountNumber: string | null;
  slug: string | null;
}

const initialState: AuthState = {
  user: null,
  loginType: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  registrationToken: null,
  accountNumber: null,
  slug: null,
};

// ════════════════════════════════════════════════════════════════
// Thunks
// ════════════════════════════════════════════════════════════════

export const initiate = createAsyncThunk(
  'auth/initiate',
  async (req: auth.InitiateRequest, { rejectWithValue }) => {
    try {
      return await authUseCases().initiate(req);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

export const complete = createAsyncThunk(
  'auth/complete',
  async (otpCode: string, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.registrationToken;
    if (!token) return rejectWithValue('No registration token');

    try {
      return await authUseCases().complete({
        registration_token: token,
        otp_code: otpCode,
      });
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async (req: auth.LoginRequest, { rejectWithValue }) => {
    try {
      return await authUseCases().login(req);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// Slice
// ════════════════════════════════════════════════════════════════

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      authUseCases().logout();
      Object.assign(state, initialState);
    },
    clearError(state) {
      state.error = null;
    },
    hydrate(state) {
      const s = authUseCases().getState();
      state.user = s.user;
      state.loginType = s.loginType;
      state.isAuthenticated = s.isAuthenticated;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initiate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registrationToken = action.payload.registration_token;
        state.accountNumber = action.payload.account_number;
        state.slug = action.payload.slug;
      })
      .addCase(initiate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(complete.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(complete.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.loginType = 'account';
        state.registrationToken = null;
        state.user = {
          id: action.payload.supplier.id,
          name: '',
          email: '',
          role: 'owner',
          entity_type: 'supplier',
          entity_id: action.payload.supplier.id,
          account_number: action.payload.supplier.account_number,
          slug: action.payload.supplier.slug,
        };
      })
      .addCase(complete.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.loginType = action.payload.login_type;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, hydrate } = authSlice.actions;
