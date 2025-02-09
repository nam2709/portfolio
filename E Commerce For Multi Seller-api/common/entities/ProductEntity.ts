import { flexId } from 'adapters/flexid.adapter'

export enum ProductStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REVOKED = 'REVOKED',
  DISABLE = 'DISABLE'
}
export default class ProductEntity {
  vendorId: string
  store_id: string
  productId: string
  id: string
  name: string
  description: string
  status: ProductStatus
  createdAt: Date
  created_at: Date
  quantity: Number
  price: Number

  constructor({
    vendorId,
    productId,
    name,
    description,
    status,
    quantity = 0,
    price = 0,
    createdAt = new Date(),
  }) {
    this.vendorId = vendorId
    this.productId = productId || flexId()
    this.name = name
    this.description = description
    this.status = status
    this.quantity = quantity
    this.price = price
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt)
  }

  key() {
    return {
      PK: `PRODUCT#${this.productId}`,
      SK: `PRODUCT#${this.productId}`,
    }
  }

  static fromItem(item) {
    return new ProductEntity({
      vendorId: item.vendorId,
      productId: item.productId,
      name: item.name,
      description: item.description,
      status: item.status,
      quantity: item.quantity,
      price: item.price,
      createdAt: item.createdAt,
    })
  }

  toItem() {
    return {
      ...this.key(),
      GSI2PK: `VENDOR#${this.vendorId}`,
      GSI2SK: `PRODUCT#${this.productId}`,
      GSI1PK: `STATUS#${this.status}`,
      GSI1SK: this.createdAt.toISOString(),
      vendorId: this.vendorId,
      productId: this.productId,
      name: this.name,
      description: this.description,
      status: this.status,
      quantity: this.quantity,
      price: this.price,
      created_at: this.createdAt.toISOString(),
    }
  }

  toDto() {
    return {
      id: this.vendorId,
    }
  }
}
