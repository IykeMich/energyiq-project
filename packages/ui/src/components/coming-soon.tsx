import { Construction } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ComingSoonProps {
  title: string;
  description?: string;
  backHref: string;
  backLabel?: string;
}

/** Full-page placeholder for an authenticated route whose feature hasn't shipped yet. */
export function ComingSoon({
  title,
  description = "We're still building this page. Check back soon.",
  backHref,
  backLabel = 'Back to Dashboard',
}: ComingSoonProps) {
  return (
    <section className="flex flex-col gap-6">
      <header className="mt-3">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
      </header>

      <div className="flex min-h-[420px] flex-1 flex-col items-center justify-center gap-4 rounded-[18px] border border-[#616161B2] bg-[#FFFFFF1A] p-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FBC02D]/20">
          <Construction className="h-6 w-6 text-[#FBC02D]" aria-hidden="true" />
        </span>

        <p className="text-sm font-semibold text-[#FAFAFA]">Page coming soon</p>
        <p className="max-w-md text-sm italic text-[#FFFFFFCC]">{description}</p>

        <Link
          to={backHref}
          className="tap-effect mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#FBC02D] px-4 py-2 text-xs font-medium text-[#121212]"
        >
          {backLabel}
        </Link>
      </div>
    </section>
  );
}
