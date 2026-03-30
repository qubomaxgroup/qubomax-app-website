export interface SpApiOrdersResponse {
  payload: OrdersPayload;
}

export interface OrdersPayload {
  Orders: AmazonOrder[];
  NextToken?: string;
}

export interface AmazonOrder {
  AmazonOrderId: string;
  PurchaseDate: string;
  LastUpdateDate: string;
  OrderStatus: string;
  FulfillmentChannel: 'AFN' | 'MFN' | string;
  SalesChannel: string;
  ShipServiceLevel: string;
  OrderTotal: OrderTotal;
  NumberOfItemsShipped: number;
  NumberOfItemsUnshipped: number;
  MarketplaceId: string;
  ShipmentServiceLevelCategory?: string;
  OrderType?: string;
  EarliestShipDate?: string;
  LatestShipDate?: string;
  EarliestDeliveryDate?: string;
  LatestDeliveryDate?: string;
  IsBusinessOrder?: boolean;
  IsPrime?: boolean;
  IsPremiumOrder?: boolean;
  IsGlobalExpressEnabled?: boolean;
  IsReplacementOrder?: boolean;
  IsSoldByAB?: boolean;
}

export interface OrderTotal {
  CurrencyCode: string;
  Amount: number;
}

export interface DailySummaryResponse {
  totalRevenue: number;
  orderCount: number;
  pendingReturns: number;
}
