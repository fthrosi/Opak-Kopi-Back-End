// src/types/payment.types.ts

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CustomerDetails {
  first_name: string;
  last_name?: string;
  email: string;
  phone: string;
}

export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  items: OrderItem[];
  customerDetails: CustomerDetails;
}

export interface CreatePaymentResponse {
  token: string;
  redirect_url: string;
  order_id: string;
}

export interface MidtransNotification {
  transaction_status: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_id: string;
  transaction_time: string;
  fraud_status?: string;
  status_code: string;
  signature_key: string;
}

export interface PaymentCallbackResponse {
  order_id: string;
  status: string;
  payment_type: string;
}