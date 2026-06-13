/** Trust Score line with a green progress bar (score doubles as the fill percent). */
export function DistributorTrustScoreBar({ score }: { score: number }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#FFFFFFCC]">Trust Score</span>
        <span className="text-sm text-[#FAFAFA]">{score}/100</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#FFFFFF1A]">
        <div className="h-full rounded-full bg-success" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
