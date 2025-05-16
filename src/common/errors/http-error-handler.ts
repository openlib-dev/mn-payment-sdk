import axios, { AxiosError } from 'axios';
import { PaymentError, PaymentErrorCode } from './payment-error';

interface ErrorResponse {
  message?: string;
  error?: string;
  [key: string]: any;
}

export class HttpErrorHandler {
  public static handleError(provider: string, error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      // Handle network errors
      if (!axiosError.response) {
        throw PaymentError.fromNetworkError(error);
      }

      // Handle timeout errors
      if (axiosError.code === 'ECONNABORTED') {
        throw PaymentError.fromTimeoutError(error);
      }

      // Handle HTTP status code errors
      const status = axiosError.response.status;
      const data = axiosError.response.data as ErrorResponse;

      switch (status) {
        case 400:
          throw new PaymentError({
            code: PaymentErrorCode.INVALID_REQUEST,
            message: data?.message || data?.error || 'Invalid request',
            provider,
            originalError: error
          });

        case 401:
        case 403:
          throw new PaymentError({
            code: PaymentErrorCode.UNAUTHORIZED,
            message: data?.message || data?.error || 'Unauthorized access',
            provider,
            originalError: error
          });

        case 404:
          throw new PaymentError({
            code: PaymentErrorCode.INVALID_REQUEST,
            message: data?.message || data?.error || 'Resource not found',
            provider,
            originalError: error
          });

        case 408:
          throw PaymentError.fromTimeoutError(error);

        case 429:
          throw new PaymentError({
            code: PaymentErrorCode.PROVIDER_ERROR,
            message: data?.message || data?.error || 'Too many requests',
            provider,
            originalError: error
          });

        case 500:
        case 502:
        case 503:
        case 504:
          throw new PaymentError({
            code: PaymentErrorCode.PROVIDER_UNAVAILABLE,
            message: data?.message || data?.error || 'Payment provider is currently unavailable',
            provider,
            originalError: error
          });

        default:
          throw PaymentError.fromProviderError(provider, error);
      }
    }

    // Handle non-Axios errors
    if (error instanceof Error) {
      throw new PaymentError({
        code: PaymentErrorCode.INTERNAL_ERROR,
        message: error.message,
        provider,
        originalError: error
      });
    }

    // Handle unknown errors
    throw new PaymentError({
      code: PaymentErrorCode.INTERNAL_ERROR,
      message: 'An unknown error occurred',
      provider,
      originalError: error
    });
  }
} 