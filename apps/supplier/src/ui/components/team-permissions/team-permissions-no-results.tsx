/** Centered message shown inside the table card when a search/filter matches no employees. */
export function TeamPermissionsNoResults() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center gap-1.5 text-center">
      <p className="text-base font-semibold text-[#FAFAFA]">No Employee Found</p>
      <p className="text-sm italic text-[#FFFFFFCC]">
        Try changing your filters or add a new employee
      </p>
    </div>
  );
}
