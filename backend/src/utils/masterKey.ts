import { randomUUID } from 'crypto'

export const MASTER_KEY = process.env.MASTER_KEY ?? randomUUID()
export const isMasterKeyValid = (key: string) => key === MASTER_KEY
