import { generateKeyPairSync } from 'crypto'
import createLogger from 'pino'
import { createAxiosInstance } from '../client/requests'
import {
  IncomingPayment,
  GrantRequest,
  GrantContinuationRequest,
  OutgoingPayment,
  OutgoingPaymentPaginationResult,
  WalletAddress,
  JWK,
  AccessToken,
  Quote,
  IncomingPaymentPaginationResult,
  PendingGrant,
  Grant
} from '../types'
import { v4 as uuid } from 'uuid'
import { ResponseValidator } from '@interledger/openapi'

export const silentLogger = createLogger({
  level: 'silent'
})

export const keyId = 'default-key-id'

export const defaultAxiosInstance = createAxiosInstance({
  requestTimeoutMs: 0,
  keyId,
  privateKey: generateKeyPairSync('ed25519').privateKey
})

export const withEnvVariableOverride = (
  override: Record<string, string>,
  testCallback: () => Promise<void>
): (() => Promise<void>) => {
  return async () => {
    const savedEnvVars = Object.assign({}, process.env)

    Object.assign(process.env, override)

    try {
      await testCallback()
    } finally {
      process.env = savedEnvVars
    }
  }
}

export const mockOpenApiResponseValidators = () => ({
  successfulValidator: ((data: unknown): data is unknown =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    true) as ResponseValidator<any>,
  failedValidator: ((data: unknown): data is unknown => {
    throw new Error('Failed to validate response')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as ResponseValidator<any>
})

export const mockJwk = (overrides?: Partial<JWK>): JWK => ({
  x: uuid(),
  kid: uuid(),
  alg: 'EdDSA',
  kty: 'OKP',
  crv: 'Ed25519',
  ...overrides
})

export const mockWalletAddress = (
  overrides?: Partial<WalletAddress>
): WalletAddress => ({
  id: 'https://example.com/.well-known/pay',
  authServer: 'https://auth.wallet.example/authorize',
  assetScale: 2,
  assetCode: 'USD',
  ...overrides
})

export const mockIncomingPayment = (
  overrides?: Partial<IncomingPayment>
): IncomingPayment => ({
  id: `https://example.com/.well-known/pay/incoming-payments/${uuid()}`,
  walletAddress: 'https://example.com/.well-known/pay',
  completed: false,
  incomingAmount: {
    assetCode: 'USD',
    assetScale: 2,
    value: '10'
  },
  receivedAmount: {
    assetCode: 'USD',
    assetScale: 2,
    value: '0'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
})

export const mockIncomingPaymentPaginationResult = (
  overrides?: Partial<IncomingPaymentPaginationResult>
): IncomingPaymentPaginationResult => {
  const result = overrides?.result || [
    mockIncomingPayment(),
    mockIncomingPayment(),
    mockIncomingPayment()
  ]

  return {
    result,
    pagination: overrides?.pagination || {
      startCursor: result[0].id,
      hasNextPage: true,
      hasPreviousPage: true,
      endCursor: result[result.length - 1].id
    }
  }
}

export const mockOutgoingPayment = (
  overrides?: Partial<OutgoingPayment>
): OutgoingPayment => ({
  id: `https://example.com/.well-known/pay/outgoing-payments/${uuid()}`,
  walletAddress: 'https://example.com/.well-known/pay',
  failed: false,
  debitAmount: {
    assetCode: 'USD',
    assetScale: 2,
    value: '10'
  },
  sentAmount: {
    assetCode: 'USD',
    assetScale: 2,
    value: '0'
  },
  receiveAmount: {
    assetCode: 'USD',
    assetScale: 2,
    value: '10'
  },
  quoteId: uuid(),
  receiver: uuid(),
  metadata: { externalRef: 'INV #1', description: 'some description' },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
})

export const mockOutgoingPaymentPaginationResult = (
  overrides?: Partial<OutgoingPaymentPaginationResult>
): OutgoingPaymentPaginationResult => {
  const result = overrides?.result || [
    mockOutgoingPayment(),
    mockOutgoingPayment(),
    mockOutgoingPayment()
  ]

  return {
    result,
    pagination: overrides?.pagination || {
      startCursor: result[0].id,
      hasNextPage: true,
      hasPreviousPage: true,
      endCursor: result[result.length - 1].id
    }
  }
}

export const mockPendingGrant = (
  overrides?: Partial<PendingGrant>
): PendingGrant => ({
  interact: {
    redirect: 'http://example.com/redirect',
    finish: 'EF5C2D8DF0663FD5'
  },
  continue: {
    access_token: {
      value: 'BBBDD7BDD6CB8659'
    },
    uri: 'http://example.com/continue',
    wait: 5
  },
  ...overrides
})

export const mockGrant = (overrides?: Partial<Grant>): Grant => ({
  access_token: {
    value: '99C36C2A4DB5BEBC',
    manage: 'http://example.com/token/',
    access: [
      {
        type: 'incoming-payment',
        actions: ['create', 'read', 'list', 'complete']
      }
    ],
    expires_in: 600
  },
  continue: {
    access_token: {
      value: 'DECCCF3D2229DB48'
    },
    uri: 'http://example.com/continue/'
  },
  ...overrides
})

export const mockGrantRequest = (
  overrides?: Partial<GrantRequest>
): GrantRequest => ({
  access_token: {
    access: [
      {
        type: 'quote',
        actions: ['create', 'read']
      }
    ]
  },
  client: 'https://shoe-shop/.well-known/pay',
  interact: {
    start: ['redirect'],
    finish: {
      method: 'redirect',
      uri: 'http://localhost:3030/mock-idp/fake-client',
      nonce: '456'
    }
  },
  ...overrides
})

export const mockContinuationRequest = (
  overrides?: Partial<GrantContinuationRequest>
): GrantContinuationRequest => ({
  interact_ref: uuid(),
  ...overrides
})

export const mockAccessToken = (
  overrides?: Partial<AccessToken>
): AccessToken => ({
  access_token: {
    value: '99C36C2A4DB5BEBC',
    manage: `http://example.com/token/${uuid()}`,
    access: [
      {
        type: 'incoming-payment',
        actions: ['create', 'read', 'list', 'complete']
      }
    ],
    expires_in: 600
  },
  ...overrides
})

export const mockQuote = (overrides?: Partial<Quote>): Quote => ({
  id: `https://example.com/.well-known/pay/quotes/${uuid()}`,
  receiver: 'https://example.com/.well-known/peer',
  walletAddress: 'https://example.com/.well-known/pay',
  debitAmount: {
    value: '100',
    assetCode: 'USD',
    assetScale: 2
  },
  receiveAmount: {
    value: '90',
    assetCode: 'USD',
    assetScale: 2
  },
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 60_000).toISOString(),
  ...overrides
})
