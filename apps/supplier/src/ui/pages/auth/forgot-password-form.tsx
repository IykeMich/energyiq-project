import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Call API here later
    navigate('/check-email', {
      state: { email },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-12 flex justify-center">
         
        </div>

        <h1 className="mb-2 text-3xl font-semibold text-white">
          Reset your Password
        </h1>

        <p className="mb-8 text-sm text-[#FFFFFF80]">
          We'll email you a link to reset your password
        </p>

        <form onSubmit={handleSubmit}>
          <label className="mb-2 block text-sm text-white">
            Email Address:
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter email address"
            className="mb-8 h-14 w-full rounded-full bg-[#121212] px-6 text-white outline-none"
          />

          <button
            type="submit"
            className="h-14 w-full rounded-full bg-[#FBC02D] font-semibold text-black"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}