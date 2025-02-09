export enum VendorStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REVOKED = 'REVOKED',
  DISABLE = 'DISABLE'
}

export class VendorEntity {
  userId: string
  vendorId: string
  name: string
  address: object
  description: string
  status: VendorStatus
  createdAt: Date

  constructor({ userId, name, address, description, status, createdAt = new Date() }) {
    this.userId = userId
    this.vendorId = userId
    this.name = name
    this.address = address
    this.description = description
    this.status = status
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt)
  }

  key() {
    return {
      PK: `USER#${this.userId}`,
      SK: `VENDOR#${this.vendorId}`,
    }
  }

  toItem() {
    return {
      ...this.key(),
      GSI1PK: `STATUS#${this.status}`,
      GSI1SK: this.createdAt.toISOString(),
      name: this.name,
      address: this.address,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt.toISOString(),
    }
  }

  static fromItem(item) {
    return new VendorEntity({
      userId: item.userId,
      name: item.name,
      address: item.address,
      description: item.description,
      status: item.status,
      createdAt: item.createdAt,
    })
  }
}
