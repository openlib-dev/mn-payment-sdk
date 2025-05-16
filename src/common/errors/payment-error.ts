export enum PaymentErrorCode {
  // Common errors
  INVALID_REQUEST = 'INVALID_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  
  // Payment specific errors
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_CANCELLED = 'PAYMENT_CANCELLED',
  PAYMENT_EXPIRED = 'PAYMENT_EXPIRED',
  PAYMENT_DUPLICATE = 'PAYMENT_DUPLICATE',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  INVALID_CURRENCY = 'INVALID_CURRENCY',
  
  // Provider specific errors
  PROVIDER_ERROR = 'PROVIDER_ERROR',
  PROVIDER_UNAVAILABLE = 'PROVIDER_UNAVAILABLE',
  PROVIDER_TIMEOUT = 'PROVIDER_TIMEOUT'
}

export interface PaymentErrorDetails {
  code: PaymentErrorCode;
  message: string;
  provider?: string;
  originalError?: any;
  requestId?: string;
  timestamp?: number;
}

export class PaymentError extends Error {
  public readonly code: PaymentErrorCode;
  public readonly provider?: string;
  public readonly originalError?: any;
  public readonly requestId?: string;
  public readonly timestamp: number;

  constructor(details: PaymentErrorDetails) {
    super(details.message);
    this.name = 'PaymentError';
    this.code = details.code;
    this.provider = details.provider;
    this.originalError = details.originalError;
    this.requestId = details.requestId;
    this.timestamp = details.timestamp || Date.now();
  }

  public toJSON(): PaymentErrorDetails {
    return {
      code: this.code,
      message: this.message,
      provider: this.provider,
      originalError: this.originalError,
      requestId: this.requestId,
      timestamp: this.timestamp
    };
  }

  public static fromProviderError(provider: string, error: any): PaymentError {
    const details: PaymentErrorDetails = {
      code: PaymentErrorCode.PROVIDER_ERROR,
      message: error.message || 'Unknown provider error',
      provider,
      originalError: error
    };

    if (error.response?.data) {
      details.message = error.response.data.error || error.response.data.message || details.message;
    }

    return new PaymentError(details);
  }

  public static fromNetworkError(error: any): PaymentError {
    return new PaymentError({
      code: PaymentErrorCode.NETWORK_ERROR,
      message: error.message || 'Network error occurred',
      originalError: error
    });
  }

  public static fromTimeoutError(error: any): PaymentError {
    return new PaymentError({
      code: PaymentErrorCode.TIMEOUT,
      message: error.message || 'Request timed out',
      originalError: error
    });
  }
} 