type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
    path: string;
    method: HttpMethod;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    timestamp: string;
    path: string;
    method: HttpMethod;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ApiError {
  success: false;
  error: {
    code: number;
    message: string;
  };
  meta: {
    timestamp: string;
    path: string;
    method: HttpMethod;
  };
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

export function isApiError(response: unknown): response is ApiError {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    response.success === false &&
    "error" in response
  );
}
