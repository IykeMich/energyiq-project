import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff } from "lucide-react";
import { cn } from "@energyiq/shared";
import { useAuth } from "../../hooks/use-auth";
import { store } from "@energyiq/store";
import { toast } from "@energyiq/ui";
import {
  loginSchema,
  loginFormDefaultValues,
  type LoginFormData,
} from "../../validation/auth/login";
import type { LoginResult } from "@energyiq/domain/auth";
import { AuthInput } from "./auth-input";


const inputBaseClass =
  "w-full h-[56px] rounded-full bg-[#6161611A] px-6 text-white placeholder:text-gray-500 " +
  "focus:outline-none focus:ring-2 focus:ring-[#FBC02D]/40 transition-colors";

const OTP_LENGTH = 6;

export function LoginForm() {
  const navigate = useNavigate();
  const {
    login,
    distributorVerifyOtp,
    distributorResendOtp,
    isLoading,
    error,
    clearError,
  } = useAuth();
  const {pathname} = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [showMfa, setShowMfa] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpPassword, setOtpPassword] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginFormDefaultValues,
  });

  const rememberMe = watch("rememberMe");
  const email = watch("email");
  const password = watch("password");
  const isCredentialsFilled = Boolean(email?.trim()) && Boolean(password?.trim());

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setOtpError(false);
    if (value && index < OTP_LENGTH - 1) {
      document.getElementById(`login-otp-${index + 1}`)?.focus();
    }
  };

  const routeAfterLogin = (result: Awaited<ReturnType<typeof login>>) => {
    if (!result) return;

    const next = result.next_action ?? "dashboard";
    const slug = result.user?.slug;

    switch (next) {
      case "dashboard":
        if (slug) navigate(`/${slug}/dashboard`);
        break;
      case "complete_onboarding":
        if (slug) navigate(`/${slug}/onboarding`);
        break;
      case "pending_review":
        if (slug) navigate(`/${slug}/onboarding`);
        break;
      case "verify_email":
        // Should be handled before this helper.
        break;
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    const result = await login({
      email: data.email.trim(),
      password: data.password.trim(),
      mfa_code: data.mfaCode?.trim() || undefined,
    });

    if (!result) {
      toast.error("Login failed", {
        description: error ?? "Please check your credentials.",
      });
      return;
    }

    if (result.next_action === "verify_email") {
      setOtpEmail(data.email.trim());
      setOtpPassword(data.password.trim());
      setShowOtp(true);
      setOtpCountdown(result.otp_resend_after_seconds ?? 30);
      return;
    }

    routeAfterLogin(result);
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setOtpError(true);
      return;
    }
    clearError();
    const success = await distributorVerifyOtp({
      email: otpEmail,
      otp_code: code,
    });
    if (success) {
      const state = store.getState().auth;
      routeAfterLogin({
        next_action: state.nextAction,
        user: state.user ?? undefined,
      } as LoginResult);
    } else {
      setOtpError(true);
    }
  };

  const handleResendOtp = async () => {
    clearError();
    const result = await distributorResendOtp({
      email: otpEmail,
      password: otpPassword,
    });
    if (result) {
      setOtpCountdown(result.otp_resend_after_seconds ?? 30);
      toast.success("Code resent", {
        description: "A new OTP has been sent to your email.",
      });
    } else {
      toast.error("Failed to resend code", {
        description: error ?? "Please try again later.",
      });
    }
  };

  const isMfaError =
    error?.toLowerCase().includes("mfa") ||
    error?.toLowerCase().includes("otp");

  if (showOtp) {
    return (
      <div className="w-full flex flex-col gap-6">
        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-white">
            Verify your email
          </h2>
          <p className="text-sm text-gray-400">
            Enter the 6-digit code sent to{" "}
            <span className="text-white">{otpEmail}</span>.
          </p>
        </div>

        <div className="flex justify-between gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`login-otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(e.target.value, index)}
              className={cn(
                "h-14 w-12 sm:w-14 rounded-2xl bg-[#FFFFFF1A] text-center text-2xl font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#FBC02D]/60 transition-colors",
                otpError && "ring-2 ring-red-500",
              )}
            />
          ))}
        </div>

        {otpError && (
          <p className="text-red-500 text-xs">Invalid or incomplete code</p>
        )}

        <p className="text-sm text-gray-400">
          Resend available in 0:{otpCountdown.toString().padStart(2, "0")}
        </p>

        <button
          type="button"
          onClick={handleResendOtp}
          disabled={otpCountdown > 0 || isLoading}
          className="self-start text-sm text-[#FBC02D] hover:underline disabled:opacity-60"
        >
          Resend code
        </button>

        <button
          type="button"
          onClick={handleVerifyOtp}
          disabled={isLoading}
          className="tap-effect w-full h-14 rounded-full bg-[#FBC02D] hover:bg-[#FBC02D]/90 text-[#121212] text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify & Continue"}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-6 px-2"
    >
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      {/* Email */}
      <AuthInput
        label="Email Address"
        id="email"
        type="email"
        autoComplete="email"
        {...register("email")}
        error={errors.email}
        className={cn(inputBaseClass, errors.email && "ring-2 ring-red-500")}
        placeholder="e.g: VtZlT@example.com"
      />

      {/* Password */}
      <AuthInput
        label="Password"
        id="password"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        {...register("password")}
        error={errors.password}
        className={cn(inputBaseClass, errors.password && "ring-2 ring-red-500")}
        endAdornment={
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? (
              <Eye className="size-5" />
            ) : (
              <EyeOff className="size-5" />
            )}
          </button>
        }
      />

      {/* MFA Code */}
      {(showMfa || isMfaError) && (
        <div className="flex flex-col gap-2">
          <label htmlFor="mfaCode" className="text-sm font-normal text-white">
            MFA Code
          </label>
          <input
            id="mfaCode"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="Enter 6-digit MFA code"
            {...register("mfaCode")}
            className={cn(
              inputBaseClass,
              errors.mfaCode && "ring-2 ring-red-500",
            )}
          />
          {errors.mfaCode && (
            <p className="text-red-500 text-xs ml-6">
              {errors.mfaCode.message}
            </p>
          )}
        </div>
      )}

      {!showMfa && !isMfaError && (
        <button
          type="button"
          onClick={() => setShowMfa(true)}
          className="self-start text-sm text-[#FBC02D] hover:underline"
        >
          Have an MFA code?
        </button>
      )}

      {/* Stay signed in / Forgot password */}
      <div className="flex items-center justify-between flex-wrap gap-3 px-2 mx-2">
        <label
          htmlFor="rememberMe"
          className="inline-flex items-center gap-2 cursor-pointer select-none"
        >
          <span className="relative inline-flex">
            <input
              id="rememberMe"
              type="checkbox"
              {...register("rememberMe")}
              className="peer appearance-none w-4 h-4 rounded-xs border border-[#FBC02D] checked:bg-[#FBC02D] cursor-pointer"
            />
            {rememberMe && (
              <Check
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 m-auto size-3 text-[#121212]"
                strokeWidth={3}
              />
            )}
          </span>
          <span className="text-sm text-white">Stay signed in</span>
        </label>
        <Link
          to="/forgot-password"
          className="text-sm text-white hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || !isCredentialsFilled}
        className="tap-effect w-full h-14 rounded-full bg-[#FBC02D] hover:bg-[#FBC02D]/90 text-[#121212] text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[#FBC02D33]"
      >
        {isLoading ? "Signing in..." : "Log In"}
      </button>

      {/* Sign up link */}
      {/* ToDo: Do not show this link if it is a distributor user, that is, if the pathname is `/distributor/register` */}
      {pathname !== "/distributor/login" && (
        <p className="text-center text-sm text-white">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-[#FBC02D] font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      )}
    </form>
  );
}
