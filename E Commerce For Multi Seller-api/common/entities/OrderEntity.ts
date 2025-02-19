export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  // SENT = 'SENT',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  OUR_FOR_DELIVERY = 'OUR_FOR_DELIVERY',
  DELIVERIED = 'DELIVERIED',
  DELIVERED = 'DELIVERED',
  DEFAULT_ORDER_STATUS = 'PENDING',
}

export enum PaymentMethod {
  'COD' = 'COD',
  'WALLET' = 'WALLET',
  'CARD' = 'CARD',
  'BANK_TRANSFER' = 'BANK_TRANSFER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REVERSAL = 'REVERSAL',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  CASH = 'CASH',
  WALLET = 'WALLET',
  WAITING_FOR_APPROVAL = 'WAITING_FOR_APPROVAL',
}

export const OrderStatusMap = {
  PENDING: {
    id: 1,
    name: 'pending',
    slug: 'pending',
    sequence: 1,
    status: 1,
  },
  PROCESSING: {
    id: 2,
    name: 'processing',
    slug: 'processing',
    sequence: '2',
    created_by_id: '1',
    status: 1,
    system_reserve: '1',
    created_at: '2024-01-24T08:16:03.000000Z',
    updated_at: '2024-01-24T08:16:03.000000Z',
    deleted_at: null,
  },
  SHIPPED: {
    id: 4,
    name: 'shipped',
    slug: 'shipped',
    sequence: '4',
    created_by_id: '1',
    status: 1,
    system_reserve: '1',
    created_at: '2024-01-24T08:16:03.000000Z',
    updated_at: '2024-01-24T08:16:03.000000Z',
    deleted_at: null,
  },
  OUT_FOR_DELIVERY: {
    id: 5,
    name: 'out for delivery',
    slug: 'out-for-delivery',
    sequence: '5',
    created_by_id: '1',
    status: 1,
    system_reserve: '1',
    created_at: '2024-01-24T08:16:03.000000Z',
    updated_at: '2024-01-24T08:16:03.000000Z',
    deleted_at: null,
  },
  OUR_FOR_DELIVERY: {
    id: 5,
    name: 'out for delivery',
    slug: 'out-for-delivery',
    sequence: '5',
    created_by_id: '1',
    status: 1,
    system_reserve: '1',
    created_at: '2024-01-24T08:16:03.000000Z',
    updated_at: '2024-01-24T08:16:03.000000Z',
    deleted_at: null,
  },
  DELIVERIED: {
    id: 6,
    name: 'delivered',
    slug: 'delivered',
    sequence: '6',
    created_by_id: '1',
    status: 1,
    system_reserve: '1',
    created_at: '2024-01-24T08:16:03.000000Z',
    updated_at: '2024-01-24T08:16:03.000000Z',
    deleted_at: null,
  },
  DELIVERED: {
    id: 6,
    name: 'delivered',
    slug: 'delivered',
    sequence: '6',
    created_by_id: '1',
    status: 1,
    system_reserve: '1',
    created_at: '2024-01-24T08:16:03.000000Z',
    updated_at: '2024-01-24T08:16:03.000000Z',
    deleted_at: null,
  },
  COMPLETED: {
    id: 6,
    name: 'delivered',
    slug: 'delivered',
    sequence: '6',
    created_by_id: '1',
    status: 1,
    system_reserve: '1',
    created_at: '2024-01-24T08:16:03.000000Z',
    updated_at: '2024-01-24T08:16:03.000000Z',
    deleted_at: null,
  },
}
