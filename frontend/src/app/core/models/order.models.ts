export interface OrderListResponse {
  payload: OrdersPayload;
}

export interface OrdersPayload {
  Orders: AmazonOrder[];
  NextToken?: string;
}

export interface SpApiOrder {
  AmazonOrderId: string;
  PurchaseDate: string;
  OrderStatus: string;
  MarketplaceId: string;
  FulfillmentChannel: 'AFN' | 'MFN' | string;
  OrderTotal: OrderTotal;
}

export type AmazonOrder = SpApiOrder;

export interface OrderTotal {
  CurrencyCode: string;
  Amount: number;
}

export interface DailySummaryResponse {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  pendingCount: number;
  unshippedCount: number;
  shippedCount: number;
  marketplaceId: string;
  windowStartUtc: string;
  windowEndUtc: string;
  windowStartMcLean: string;
  windowEndMcLean: string;
  highValueThreshold: number;
  highValueOrders: HighValueOrder[];
}

export interface HighValueOrder {
  amazonOrderId: string;
  total: number;
  currencyCode: string;
  orderStatus: string;
  fulfillmentChannel: string;
  marketplaceId: string;
  purchaseDateUtc: string;
  purchaseDateMcLean: string;
}
