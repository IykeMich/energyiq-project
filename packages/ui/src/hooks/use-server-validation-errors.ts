import { useEffect } from "react";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { toast } from "@energyiq/ui";
import type { shared } from "@energyiq/domain";

interface UseServerValidationErrorsOptions<T extends FieldValues> {
  /** The thunk's general error message (state.error) — the server's
   * `data.message` summary for EIQ-2000 responses, e.g. "Please correct
   * the highlighted fields and try again." */
  error: string | null;
  /** Per-field messages (state.fieldErrors) from the same rejection. */
  fieldErrors: shared.ErrorFieldMessage[] | null;
  setError: UseFormSetError<T>;
  /** Maps a server field name (e.g. "phone") to this form's RHF field
   * name (e.g. "admin_phone"), for forms whose field names don't match
   * the API's 1:1. Fields not listed use the server's name as-is. */
  fieldMap?: Partial<Record<string, Path<T>>>;
}

// Constant, project-wide handling for EIQ-2000 responses: puts the
// server's message on the affected field (red border, via the same
// `error` prop every AuthInput/AuthSelect already renders) and toasts
// the summary + specific messages so the user knows what happened.
export function useServerValidationErrors<T extends FieldValues>({
  error,
  fieldErrors,
  setError,
  fieldMap = {},
}: UseServerValidationErrorsOptions<T>) {
  useEffect(() => {
    if (!fieldErrors?.length) return;

    fieldErrors.forEach(({ field, message }) => {
      const formField = (fieldMap[field] ?? field) as Path<T>;
      setError(formField, { type: "server", message });
    });

    toast.error(error ?? "Please correct the highlighted fields", {
      description: fieldErrors.map((fieldError) => fieldError.message).join(" "),
    });
    // fieldMap is a caller-provided literal; only fieldErrors identity
    // (a fresh rejection) should re-trigger this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldErrors]);
}
