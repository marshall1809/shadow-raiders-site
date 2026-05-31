import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { createServiceClient } from './supabase'
import * as bcrypt from 'bcryptjs'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-me'
)
const MEMBER_COOKIE = 'sr_member_session'
const SESSION_HOURS = 72 // 3 days

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createMemberSession(memberId: string, username: string): Promise<string> {
  const token = await new SignJWT({ memberId, username, type: 'member' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${SESSION_HOURS}h`)
    .setIssuedAt()
    .sign(SECRET)

  // Store hash of token in DB for revocation
  const tokenHash = Buffer.from(token).toString('base64').slice(-32)
  const db = createServiceClient()
  await db.from('member_sessions').insert({
    member_id: memberId,
    token_hash: tokenHash,
    expires_at: new Date(Date.now() + SESSION_HOURS * 3600 * 1000).toISOString(),
  })

  // Update last login
  await db.from('members').update({ last_login: new Date().toISOString() }).eq('id', memberId)

  return token
}

export async function verifyMemberSession(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    if (payload.type !== 'member') return null

    // Check token still valid in DB (not revoked by account deletion/deactivation)
    const tokenHash = Buffer.from(token).toString('base64').slice(-32)
    const db = createServiceClient()
    const { data: session } = await db
      .from('member_sessions')
      .select('id, member_id')
      .eq('token_hash', tokenHash)
      .gte('expires_at', new Date().toISOString())
      .single()

    if (!session) return null

    // Check member is still active
    const { data: member } = await db
      .from('members')
      .select('id, username, role, active')
      .eq('id', session.member_id)
      .eq('active', true)
      .single()

    if (!member) return null

    return { memberId: member.id, username: member.username, role: member.role }
  } catch {
    return null
  }
}

export async function getMemberSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(MEMBER_COOKIE)?.value
  if (!token) return null
  return verifyMemberSession(token)
}

export { MEMBER_COOKIE }

// Revoke all sessions for a member (called when account deactivated)
export async function revokeMemberSessions(memberId: string) {
  const db = createServiceClient()
  await db.from('member_sessions').delete().eq('member_id', memberId)
}
