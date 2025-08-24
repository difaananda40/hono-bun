export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

export const Response = {
  success<T>(
    params: { message?: string; data?: T } | string = {},
  ): ApiResponse<T> {
    // Allow backward compatibility with string parameter
    if (typeof params === "string") {
      return {
        success: true,
        message: params,
      };
    }

    return {
      success: true,
      message: params.message || "Success",
      data: params.data,
    };
  },

  fail(params: { message: string; errors?: any } | string): ApiResponse<null> {
    // Allow backward compatibility with string parameter
    if (typeof params === "string") {
      return {
        success: false,
        message: params,
      };
    }

    return {
      success: false,
      message: params.message,
      errors: params.errors,
    };
  },
};
