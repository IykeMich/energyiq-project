import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export function ResetPassword() {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] =
    useState(false);
     const navigate = useNavigate();
 

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-3xl font-semibold text-white">
          Set a New Password
        </h1>

        <p className="mb-8 text-sm text-[#FFFFFF80]">
          Your new password should be 8+ characters
          long.
        </p>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-white">
              New Password:
            </label>

            <div className="relative">
              <input
                type={
                  showNew ? 'text' : 'password'
                }
                className="h-14 w-full rounded-full bg-[#232323] px-6 text-white"
              />

              <button
                type="button"
                onClick={() =>
                  setShowNew(!showNew)
                }
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showNew ? (
                  <Eye />
                ) : (
                  <EyeOff />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">
              Confirm Password:
            </label>

            <div className="relative">
              <input
                type={
                  showConfirm
                    ? 'text'
                    : 'password'
                }
                className="h-14 w-full rounded-full bg-[#232323] px-6 text-white"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm(
                    !showConfirm,
                  )
                }
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirm ? (
                  <Eye />
                ) : (
                  <EyeOff />
                )}
              </button>
            </div>
          </div>

          <button className="h-14 w-full rounded-full bg-[#FBC02D] font-semibold text-black"
           onClick={() =>
            navigate('/login')
          }
          
          >
             
            
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}