import type { ClipboardEvent } from "react";
import { Lock } from "lucide-react";

interface RegisterOtpStepProps {
  otp: string[];
  otpError: boolean;
  otpResent: boolean;
  accountEmail: string;
  error: string | null;
  isLoading: boolean;
  onOtpChange: (value: string, index: number) => void;
  onOtpPaste: (pastedDigits: string) => void;
  onResend: () => void;
  onSubmit: () => void;
}

export function RegisterOtpStep({
  otp,
  otpError,
  otpResent,
  accountEmail,
  error,
  isLoading,
  onOtpChange,
  onOtpPaste,
  onResend,
  onSubmit,
}: RegisterOtpStepProps) {
  const isOtpComplete = otp.every((digit) => digit.trim().length > 0);

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedDigits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, otp.length);
    if (pastedDigits) onOtpPaste(pastedDigits);
  };

  return (
    <div className="flex flex-col items-center text-center py-6">
      <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center mb-6">
        <Lock size={28} className="text-green-500" strokeWidth={2} />
      </div>

      <p className="text-sm text-gray-400 mt-3 mb-8">
        We sent a 6-digit code to{" "}
        <span className="text-white">{accountEmail || "admin@company.com"}</span>.
      </p>

      <div className="flex justify-center gap-3 mb-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            value={digit}
            maxLength={1}
            onChange={(e) => onOtpChange(e.target.value, index)}
            onPaste={handlePaste}
            inputMode="numeric"
            className={`w-12 h-12 rounded-lg bg-[#111111] border text-center text-white text-lg font-semibold focus:outline-none focus:border-[#FBC02D] ${
              otpError ? "border-red-500" : "border-[#2D2D2D]"
            }`}
          />
        ))}
      </div>

      {otpError && (
        <p className="text-red-500 text-xs mb-4">{error ?? "Invalid code"}</p>
      )}
      {otpResent && !otpError && (
        <p className="text-xs text-gray-400 mb-4">A new code has been sent.</p>
      )}

      <button
        type="button"
        onClick={onResend}
        disabled={isLoading}
        className="tap-effect text-xs text-gray-400 hover:text-[#FBC02D] mb-8 disabled:opacity-50"
      >
        Didn&apos;t receive code? Resend
      </button>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading || !isOtpComplete}
        className="tap-effect hover:opacity-90 w-full h-17.5 rounded-full bg-[#FBC02D] text-[#121212] text-base font-semibold disabled:opacity-50"
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </button>
    </div>
  );
}
