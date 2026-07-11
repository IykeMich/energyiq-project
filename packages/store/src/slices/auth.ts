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
  distributor: auth.Distributor | null;
  invitation: auth.Invitation | null;
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
  distributor: null,
  invitation: null,
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

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (_: void, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.registrationToken;
    if (!token) return rejectWithValue('No registration token');

    try {
      return await authUseCases().resendOtp(token);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

export const resetPassword = createAsyncThunk(
  'auth/resetPasswordRequest',
  async (email: string, { rejectWithValue }) => {
    try {
      await authUseCases().resetPassword(email);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

export const resetPasswordVerify = createAsyncThunk(
  'auth/resetPasswordVerify',
  async (token: string, { rejectWithValue }) => {
    try {
      await authUseCases().resetPasswordVerify(token);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

export const resetPasswordConfirm = createAsyncThunk(
  'auth/resetPasswordConfirm',
  async (req: auth.ResetPasswordConfirmRequest, { rejectWithValue }) => {
    try {
      await authUseCases().resetPasswordConfirm(req);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

// ── Distributor public onboarding ─────────────────────────────

export const distributorRegister = createAsyncThunk(
  'auth/distributorRegister',
  async (req: auth.DistributorRegisterRequest, { rejectWithValue }) => {
    try {
      return await authUseCases().distributorRegister(req);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

export const distributorVerifyOtp = createAsyncThunk(
  'auth/distributorVerifyOtp',
  async (otpCode: string, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.registrationToken;
    if (!token) return rejectWithValue('No registration token');

    try {
      await authUseCases().distributorVerifyOtp({ registration_token: token, otp_code: otpCode });
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

export const distributorResendOtp = createAsyncThunk(
  'auth/distributorResendOtp',
  async (_: void, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.registrationToken;
    if (!token) return rejectWithValue('No registration token');

    try {
      return await authUseCases().distributorResendOtp(token);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

export const saveDistributorBusinessProfile = createAsyncThunk(
  'auth/saveDistributorBusinessProfile',
  async (
    req: Omit<auth.DistributorBusinessProfileRequest, 'registration_token'>,
    { getState, rejectWithValue },
  ) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.registrationToken;
    if (!token) return rejectWithValue('No registration token');

    try {
      return await authUseCases().saveDistributorBusinessProfile({ ...req, registration_token: token });
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

export const activateDistributor = createAsyncThunk(
  'auth/activateDistributor',
  async (_: void, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.registrationToken;
    if (!token) return rejectWithValue('No registration token');

    try {
      return await authUseCases().activateDistributor(token);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

// Revokes the refresh token server-side. Must run before the synchronous
// `logout` reducer clears local storage, since it needs the current refresh
// token to revoke it. Best-effort: local logout proceeds regardless of outcome.
export const logoutRemote = createAsyncThunk('auth/logoutRemote', async () => {
  try {
    await authUseCases().logoutRemote();
  } catch {
    // Local logout still proceeds — nothing to surface to the user here.
  }
});

// ── Distributor invitations (supplier side) ─────────────────────

export const createInvitation = createAsyncThunk(
  'auth/createInvitation',
  async (req: auth.CreateInvitationRequest, { rejectWithValue }) => {
    try {
      return await authUseCases().createInvitation(req);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

export const verifyInvitation = createAsyncThunk(
  'auth/verifyInvitation',
  async (token: string, { rejectWithValue }) => {
    try {
      return await authUseCases().verifyInvitation(token);
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
      state.slug = s.user?.slug ?? null;
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
        state.slug = action.payload.user.slug;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(resendOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(resetPasswordVerify.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordVerify.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPasswordVerify.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(resetPasswordConfirm.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordConfirm.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPasswordConfirm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(distributorRegister.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(distributorRegister.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registrationToken = action.payload.registration_token ?? null;
        state.distributor = action.payload.distributor ?? null;
      })
      .addCase(distributorRegister.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(distributorVerifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(distributorVerifyOtp.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(distributorVerifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(distributorResendOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(distributorResendOtp.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(distributorResendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(saveDistributorBusinessProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveDistributorBusinessProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.distributor = action.payload;
      })
      .addCase(saveDistributorBusinessProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(activateDistributor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(activateDistributor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.distributor = action.payload;
      })
      .addCase(activateDistributor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createInvitation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createInvitation.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createInvitation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(verifyInvitation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyInvitation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invitation = action.payload;
      })
      .addCase(verifyInvitation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, hydrate } = authSlice.actions;
