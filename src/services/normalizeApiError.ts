import { isAxiosError } from "axios";
import type { ApiError } from "./apiError.types";

/**
 * Normalizes unknown errors into a consistent ApiError shape.
 *
 * This function is used at the API boundary to convert Axios and non-Axios
 * errors into a predictable, typed structure that can be safely handled
 * by React Query hooks and UI components.
 *
 * Responsibilities:
 * - Extract HTTP status codes from Axios errors
 * - Map backend error payloads into a frontend-friendly format
 * - Provide safe fallbacks for unexpected or unknown errors
 *
 * This function:
 * - Does NOT perform UI actions
 * - Does NOT throw framework-specific errors
 * - Does NOT assume error message formats
 *
 * @param error - The error thrown during an API request (unknown at boundary)
 * @returns A normalized ApiError object with status, code, and message
 */
export function normalizeApiError(error: unknown): ApiError {
  if (isAxiosError(error)) {
    const status = error.response?.status ?? 500;
    const backendError = error.response?.data?.error;

    return {
      status,
      code: backendError?.code ?? "UNKNOWN_ERROR",
      message:
        backendError?.message ?? "Something went wrong. Please try again.",
    };
  }

  return {
    status: 500,
    code: "UNKNOWN_ERROR",
    message: "Unexpected error occurred",
  };
}
