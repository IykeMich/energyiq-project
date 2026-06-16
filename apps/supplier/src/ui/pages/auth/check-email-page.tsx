import { useLocation, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';

export function CheckEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email ?? '';

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-900">
            <Mail className="h-7 w-7 text-green-400" />
          </div>
        </div>

        <h1 className="mb-3 text-3xl font-semibold text-white">
          Check your Email
        </h1>

        <p className="mb-8 text-sm text-[#FFFFFF80]">
          We sent a link to {email} to reset your password.
        </p>

        <button
          className="mb-4 h-14 w-full rounded-full bg-[#FBC02D] font-semibold text-black"
          onClick={() =>
            navigate('/reset-password')
          }
        >
          Open Email
        </button>

        <button
          onClick={() =>
            navigate('/forgot-password')
          }
          className="text-sm text-white"
        >
          Didn't get link? Resend
        </button>
      </div>
    </div>
  );
}