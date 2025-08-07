import { join } from 'path'
import fs from 'fs-extra'

/**
 * Authentication API generator
 */
export class AuthApiGenerator {
  /**
   * Generate authentication utility functions
   */
  static generateAuthUtils() {
    return `import { authDb } from '../lib/auth/database'

/**
 * Utility function to get current user
 */
export function getCurrentUser(request: Request) {
  // Cleanup expired sessions
  authDb.cleanupExpiredSessions()
  
  const cookies = request.headers.get('cookie')
  const sessionId = cookies
    ?.split(';')
    .find(c => c.trim().startsWith('session='))
    ?.split('=')[1]
  
  if (!sessionId) return null
  
  const sessionData = authDb.getSessionWithUser(sessionId)
  if (!sessionData) return null
  
  return {
    id: sessionData.user.id,
    email: sessionData.user.email,
    name: sessionData.user.name,
    role: sessionData.user.role,
    avatar: sessionData.user.avatar,
    created_at: sessionData.user.created_at
  }
}

/**
 * Check if user is authenticated
 */
export function requireAuth(request: Request) {
  const user = getCurrentUser(request)
  if (!user) {
    throw new Response('Unauthorized', { status: 401 })
  }
  return user
}

/**
 * Check if user is admin
 */
export function requireAdmin(request: Request) {
  const user = requireAuth(request)
  if (user.role !== 'admin') {
    throw new Response('Forbidden', { status: 403 })
  }
  return user
}`
  }

  /**
   * Generate login API
   */
  static generateLoginApi() {
    return `import { createFileRoute } from '@tanstack/solid-router'
import { json } from '@tanstack/solid-start'
import { authDb } from '../../../lib/auth/database'

export const Route = createFileRoute('/api/auth/login')({
  POST: async ({ request }: { request: Request }) => {
    try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return json({ error: 'Email and password are required' }, { status: 400 })
    }
    
    // Verify user
    const user = authDb.verifyUser(email, password)
    if (!user) {
      return json({ error: 'Invalid email or password' }, { status: 401 })
    }
    
    // Create session
    const session = authDb.createSession(user.id)
    
    // Set cookie
    const response = json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        created_at: user.created_at
      }
    })
    
    // HttpOnly cookie prevents XSS
    response.headers.set('Set-Cookie', 
      \`session=\${session.id}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=\${7 * 24 * 60 * 60}\`
    )
    
    return response
    
    } catch (error) {
      console.error('Login error:', error)
      return json({ error: 'Login failed' }, { status: 500 })
    }
  }
})`
  }

  /**
   * Generate register API
   */
  static generateRegisterApi() {
    return `import { createFileRoute } from '@tanstack/solid-router'
import { json } from '@tanstack/solid-start'
import { authDb } from '../../../lib/auth/database'

export const Route = createFileRoute('/api/auth/register')({
  POST: async ({ request }: { request: Request }) => {
  try {
    const { email, password, name } = await request.json()
    
    if (!email || !password || !name) {
      return json({ error: 'All fields are required' }, { status: 400 })
    }
    
    // Simple password strength check
    if (password.length < 6) {
      return json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }
    
    // Check email format
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
    if (!emailRegex.test(email)) {
      return json({ error: 'Invalid email format' }, { status: 400 })
    }
    
    try {
      // Create user
      const user = authDb.createUser(email, name, password)
      if (!user) {
        return json({ error: 'Failed to create user' }, { status: 500 })
      }
      
      // Create session
      const session = authDb.createSession(user.id)
      
      // Set cookie
      const response = json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          created_at: user.created_at
        }
      })
      
      response.headers.set('Set-Cookie', 
        \`session=\${session.id}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=\${7 * 24 * 60 * 60}\`
      )
      
      return response
      
    } catch (error) {
      if (error.message.includes('This email is already registered')) {
        return json({ error: 'This email is already registered' }, { status: 409 })
      }
      throw error
    }
    
  } catch (error) {
    console.error('Register error:', error)
    return json({ error: 'Registration failed' }, { status: 500 })
    }
  }
})`
  }

  /**
   * Generate logout API
   */
  static generateLogoutApi() {
    return `import { createFileRoute } from '@tanstack/solid-router'
import { json } from '@tanstack/solid-start'
import { authDb } from '../../../lib/auth/database'

export const Route = createFileRoute('/api/auth/logout')({
  POST: async ({ request }: { request: Request }) => {
  try {
    // Get session ID from cookie
    const cookies = request.headers.get('cookie')
    const sessionId = cookies
      ?.split(';')
      .find(c => c.trim().startsWith('session='))
      ?.split('=')[1]
    
    if (sessionId) {
      // Delete session
      authDb.deleteSession(sessionId)
    }
    
    // Clear cookie
    const response = json({ message: 'Logout successful' })
    response.headers.set('Set-Cookie', 
      'session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'
    )
    
    return response
    
  } catch (error) {
    console.error('Logout error:', error)
    return json({ error: 'Logout failed' }, { status: 500 })
    }
  }
})`
  }

  /**
   * Generate get current user API
   */
  static generateMeApi() {
    return `import { createFileRoute } from '@tanstack/solid-router'
import { json } from '@tanstack/solid-start'
import { getCurrentUser } from '../../../utils/auth'

export const Route = createFileRoute('/api/auth/me')({
  GET: async ({ request }: { request: Request }) => {
  try {
    const user = getCurrentUser(request)
    
    if (!user) {
      return json({ error: 'Not logged in' }, { status: 401 })
    }
    
    return json({ user })
    
  } catch (error) {
    console.error('Get user error:', error)
    return json({ error: 'Failed to get user information' }, { status: 500 })
    }
  }
})`
  }

  /**
   * Generate all API files
   */
  static async generate(projectPath) {
    console.log('Generating authentication API...')
    // Create API directory
    const apiDir = join(projectPath, 'src', 'routes', 'api', 'auth')
    await fs.ensureDir(apiDir)
    
    // Create utils directory
    const utilsDir = join(projectPath, 'src', 'utils')
    await fs.ensureDir(utilsDir)
    
    // Generate API files
    await fs.writeFile(join(apiDir, 'login.ts'), this.generateLoginApi())
    await fs.writeFile(join(apiDir, 'register.ts'), this.generateRegisterApi())
    await fs.writeFile(join(apiDir, 'logout.ts'), this.generateLogoutApi())
    await fs.writeFile(join(apiDir, 'me.ts'), this.generateMeApi())
    
    // Generate authentication utility functions
    await fs.writeFile(join(utilsDir, 'auth.ts'), this.generateAuthUtils())
  }
}