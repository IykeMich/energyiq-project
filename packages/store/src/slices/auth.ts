import {
  createSlice,
  createAsyncThunk,
  isPending,
  isFulfilled,
  isRejected,
} from "@reduxjs/toolkit";
import type { auth, shared } from "@energyiq/domain";
import { shared as sharedNS } from "@energyiq/domain";
import { authUseCases } from "../config";

const { toErrorPayload } = sharedNS;

// ════════════════════════════════════════════════════════════════
// State
// ════════════════════════════════════════════════════════════════

interface AuthState {
  user: auth.AuthUser | null;
  loginType: auth.LoginType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // Per-field validation messages from the last rejected thunk (see
  // shared.ErrorPayload) — null unless the server returned EIQ-2000
  // with a `data.errors` array. Forms map these onto their own fields
  // via useServerValidationErrors so the affected inputs show the
  // server's message, not just the generic banner/toast.
  fieldErrors: shared.ErrorFieldMessage[] | null;
  registrationToken: string | null;
  accountNumber: string | null;
  slug: string | null;
  distributor: auth.Distributor | null;
  invitation: auth.Invitation | null;
  nextAction: auth.LoginNextAction | null;
  otpResendAfterSeconds: number | null;
  devOtp: string | null;
  documentTypes: auth.DistributorDocumentType[] | null;
  supplierOnboardingDocuments: auth.OnboardingDocument[] | null;
}

const initialState: AuthState = {
  user: null,
  loginType: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  fieldErrors: null,
  registrationToken: null,
  accountNumber: null,
  slug: null,
  distributor: null,
  invitation: null,
  nextAction: null,
  otpResendAfterSeconds: null,
  devOtp: null,
  documentTypes: null,
  supplierOnboardingDocuments: null,
};

// ════════════════════════════════════════════════════════════════
// Thunks
// ════════════════════════════════════════════════════════════════

export const initiate = createAsyncThunk(
  "auth/initiate",
  async (req: auth.InitiateRequest, { rejectWithValue }) => {
    try {
      return await authUseCases().initiate(req);
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

export const complete = createAsyncThunk(
  "auth/complete",
  async (otpCode: string, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.registrationToken;
    if (!token) return rejectWithValue("No registration token");

    try {
      return await authUseCases().complete({
        registration_token: token,
        otp_code: otpCode,
      });
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (req: auth.LoginRequest, { rejectWithValue }) => {
    try {
      return await authUseCases().login(req);
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (_: void, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.registrationToken;
    if (!token) return rejectWithValue("No registration token");

    try {
      return await authUseCases().resendOtp(token);
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

export const createSupplierOnboardingDocument = createAsyncThunk(
  "auth/createSupplierOnboardingDocument",
  async (req: auth.OnboardingDocumentRequest, { rejectWithValue }) => {
    try {
      return await authUseCases().createOnboardingDocument(req);
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

export const listSupplierOnboardingDocuments = createAsyncThunk(
  "auth/listSupplierOnboardingDocuments",
  async (_, { rejectWithValue }) => {
    try {
      return await authUseCases().listOnboardingDocuments();
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

export const deleteSupplierOnboardingDocument = createAsyncThunk(
  "auth/deleteSupplierOnboardingDocument",
  async (id: string, { rejectWithValue }) => {
    try {
      await authUseCases().deleteOnboardingDocument(id);
      return id;
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

export const presignRegistrationDocument = createAsyncThunk(
  "auth/presignRegistrationDocument",
  async (req: auth.PresignRegistrationDocumentRequest, { rejectWithValue }) => {
    try {
      return await authUseCases().presignRegistrationDocument(req);
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

export const createRegistrationDocument = createAsyncThunk(
  "auth/createRegistrationDocument",
  async (req: auth.RegistrationDocumentRequest, { rejectWithValue }) => {
    try {
      return await authUseCases().createRegistrationDocument(req);
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPasswordRequest",
  async (email: string, { rejectWithValue }) => {
    try {
      await authUseCases().resetPassword(email);
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

export const resetPasswordVerify = createAsyncThunk(
  "auth/resetPasswordVerify",
  async (token: string, { rejectWithValue }) => {
    try {
      await authUseCases().resetPasswordVerify(token);
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

export const resetPasswordConfirm = createAsyncThunk(
  "auth/resetPasswordConfirm",
  async (req: auth.ResetPasswordConfirmRequest, { rejectWithValue }) => {
    try {
      await authUseCases().resetPasswordConfirm(req);
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

// ── Distributor public onboarding ─────────────────────────────

export const distributorRegister = createAsyncThunk(
  "auth/distributorRegister",
  async (req: auth.DistributorRegisterRequest, { rejectWithValue }) => {
    try {
      return await authUseCases().distributorRegister(req);
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

export const distributorVerifyOtp = createAsyncThunk(
  "auth/distributorVerifyOtp",
  async (req: auth.DistributorVerifyOtpRequest, { rejectWithValue }) => {
    try {
      return await authUseCases().distributorVerifyOtp(req);
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

export const saveDistributorBusinessProfile = createAsyncThunk(
  "auth/saveDistributorBusinessProfile",
  async (req: auth.DistributorBusinessProfileRequest, { rejectWithValue }) => {
    try {
      return await authUseCases().saveDistributorBusinessProfile(req);
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

export const getDistributorOnboarding = createAsyncThunk(
  "auth/getDistributorOnboarding",
  async (_, { rejectWithValue }) => {
    try {
      return await authUseCases().getDistributorOnboarding();
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

export const listDocumentTypes = createAsyncThunk(
  "auth/listDocumentTypes",
  async (_, { rejectWithValue }) => {
    try {
      return await authUseCases().listDocumentTypes();
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

export const presignDistributorDocument = createAsyncThunk(
  "auth/presignDistributorDocument",
  async (req: auth.PresignUploadUrlRequest, { rejectWithValue }) => {
    try {
      return await authUseCases().presignDistributorDocument(req);
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

export const createDistributorOnboardingDocument = createAsyncThunk(
  "auth/createDistributorOnboardingDocument",
  async (
    req: auth.DistributorOnboardingDocumentRequest,
    { rejectWithValue },
  ) => {
    try {
      return await authUseCases().createDistributorOnboardingDocument(req);
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

export const listDistributorOnboardingDocuments = createAsyncThunk(
  "auth/listDistributorOnboardingDocuments",
  async (_, { rejectWithValue }) => {
    try {
      return await authUseCases().listDistributorOnboardingDocuments();
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

export const deleteDistributorOnboardingDocument = createAsyncThunk(
  "auth/deleteDistributorOnboardingDocument",
  async (id: string, { rejectWithValue }) => {
    try {
      await authUseCases().deleteDistributorOnboardingDocument(id);
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

export const submitDistributorOnboarding = createAsyncThunk(
  "auth/submitDistributorOnboarding",
  async (_, { rejectWithValue }) => {
    try {
      return await authUseCases().submitDistributorOnboarding();
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

export const activateDistributor = createAsyncThunk(
  "auth/activateDistributor",
  async (id: string, { rejectWithValue }) => {
    try {
      return await authUseCases().activateDistributor(id);
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

// Revokes the refresh token server-side. Must run before the synchronous
// `logout` reducer clears local storage, since it needs the current refresh
// token to revoke it. Best-effort: local logout proceeds regardless of outcome.
export const logoutRemote = createAsyncThunk("auth/logoutRemote", async () => {
  try {
    await authUseCases().logoutRemote();
  } catch {
    // Local logout still proceeds — nothing to surface to the user here.
  }
});

// ── Distributor invitations (supplier side) ─────────────────────

export const createInvitation = createAsyncThunk(
  "auth/createInvitation",
  async (req: auth.CreateInvitationRequest, { rejectWithValue }) => {
    try {
      return await authUseCases().createInvitation(req);
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

export const verifyInvitation = createAsyncThunk(
  "auth/verifyInvitation",
  async (token: string, { rejectWithValue }) => {
    try {
      return await authUseCases().verifyInvitation(token);
    } catch (err) {
      return rejectWithValue(toErrorPayload(err));
    }
  },
);

// ════════════════════════════════════════════════════════════════
// Slice
// ════════════════════════════════════════════════════════════════

function setAuthFromLogin(state: AuthState, payload: auth.LoginResult) {
  state.nextAction = payload.next_action ?? null;
  state.otpResendAfterSeconds = payload.otp_resend_after_seconds ?? null;
  state.devOtp = payload.dev_otp ?? null;

  if (payload.access_token && payload.refresh_token && payload.user) {
    state.isAuthenticated = true;
    state.loginType = payload.login_type ?? null;
    state.user = payload.user;
    state.slug = payload.user.slug;
  } else {
    state.isAuthenticated = false;
    state.user = null;
    state.slug = null;
  }
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      authUseCases().logout();
      Object.assign(state, initialState);
    },
    clearError(state) {
      state.error = null;
      state.fieldErrors = null;
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
        state.devOtp = action.payload.dev_otp ?? null;
      })
      .addCase(initiate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as shared.ErrorPayload).message;
      });

    builder
      .addCase(complete.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(complete.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.loginType = "account";
        state.registrationToken = null;
        state.nextAction = "dashboard";
        state.user = {
          id: action.payload.supplier.id,
          name: action.payload.supplier.name,
          email: action.payload.supplier.email,
          role: "owner",
          entity_type: "supplier",
          entity_id: action.payload.supplier.id,
          account_number: action.payload.supplier.account_number,
          slug: action.payload.supplier.slug,
        };
        state.slug = action.payload.supplier.slug;
      })
      .addCase(complete.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as shared.ErrorPayload).message;
      });

    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        setAuthFromLogin(state, action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as shared.ErrorPayload).message;
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
        state.error = (action.payload as shared.ErrorPayload).message;
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
        state.error = (action.payload as shared.ErrorPayload).message;
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
        state.error = (action.payload as shared.ErrorPayload).message;
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
        state.error = (action.payload as shared.ErrorPayload).message;
      });

    builder
      .addCase(distributorRegister.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(distributorRegister.fulfilled, (state, action) => {
        state.isLoading = false;
        state.distributor = action.payload.distributor ?? null;
        state.nextAction = action.payload.next_action ?? null;
        state.otpResendAfterSeconds =
          action.payload.otp_resend_after_seconds ?? null;
        state.devOtp = action.payload.dev_otp ?? null;
      })
      .addCase(distributorRegister.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as shared.ErrorPayload).message;
      });

    builder
      .addCase(distributorVerifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(distributorVerifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        setAuthFromLogin(state, action.payload);
        state.distributor = action.payload.user
          ? { id: action.payload.user.entity_id, ...state.distributor }
          : state.distributor;
      })
      .addCase(distributorVerifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as shared.ErrorPayload).message;
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
        state.error = (action.payload as shared.ErrorPayload).message;
      });

    builder
      .addCase(getDistributorOnboarding.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDistributorOnboarding.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(getDistributorOnboarding.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as shared.ErrorPayload).message;
      });

    builder
      .addCase(listDocumentTypes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(listDocumentTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documentTypes = action.payload;
      })
      .addCase(listDocumentTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as shared.ErrorPayload).message;
      });

    builder
      .addCase(presignDistributorDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(presignDistributorDocument.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(presignDistributorDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as shared.ErrorPayload).message;
      });

    builder
      .addCase(createDistributorOnboardingDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDistributorOnboardingDocument.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(
        createDistributorOnboardingDocument.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error = (action.payload as shared.ErrorPayload).message;
        },
      );

    builder
      .addCase(listDistributorOnboardingDocuments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(listDistributorOnboardingDocuments.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(listDistributorOnboardingDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as shared.ErrorPayload).message;
      });

    builder
      .addCase(deleteDistributorOnboardingDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDistributorOnboardingDocument.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(
        deleteDistributorOnboardingDocument.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error = (action.payload as shared.ErrorPayload).message;
        },
      );

    builder
      .addCase(submitDistributorOnboarding.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitDistributorOnboarding.fulfilled, (state, action) => {
        state.isLoading = false;
        state.distributor = action.payload.distributor;
        state.nextAction = "pending_review";
      })
      .addCase(submitDistributorOnboarding.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as shared.ErrorPayload).message;
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
        state.error = (action.payload as shared.ErrorPayload).message;
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
        state.error = (action.payload as shared.ErrorPayload).message;
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
        state.error = (action.payload as shared.ErrorPayload).message;
      });

    // Uniform per-field validation state for every thunk in this slice —
    // set from the payload on rejection, cleared on any new attempt/success.
    builder
      .addMatcher(isRejected, (state, action) => {
        if (!action.type.startsWith("auth/")) return;
        state.fieldErrors =
          (action.payload as shared.ErrorPayload | undefined)?.fields ?? null;
      })
      .addMatcher(isPending, (state, action) => {
        if (!action.type.startsWith("auth/")) return;
        state.fieldErrors = null;
      })
      .addMatcher(isFulfilled, (state, action) => {
        if (!action.type.startsWith("auth/")) return;
        state.fieldErrors = null;
      });
  },
});

export const { logout, clearError, hydrate } = authSlice.actions;
