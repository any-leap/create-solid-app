import { join } from 'path'
import fs from 'fs-extra'

/**
 * 认证 API 生成器
 */
export class AuthApiGenerator {
  /**
   * 生成认证中间件
   */
  static generateAuthMiddleware() {
    return `import { createMiddleware } from '@tanstack/solid-router'
import { authDb } from '../lib/auth/database'

/**
 * Session 中间件 - 检查用户认证状态
 */
export const sessionMiddleware = createMiddleware().server(async ({ request, next }) => {
  // 清理过期 sessions
  authDb.cleanupExpiredSessions()
  
  // 从 cookie 获取 session ID
  const cookies = request.headers.get('cookie')
  const sessionId = cookies
    ?.split(';')
    .find(c => c.trim().startsWith('session='))
    ?.split('=')[1]
  
  let user = null
  
  if (sessionId) {
    const sessionData = authDb.getSessionWithUser(sessionId)
    if (sessionData) {
      user = {
        id: sessionData.user.id,
        email: sessionData.user.email,
        name: sessionData.user.name,
        role: sessionData.user.role,
        avatar: sessionData.user.avatar,
        created_at: sessionData.user.created_at
      }
    }
  }
  
  // 将用户信息添加到请求上下文
  const response = await next()
  
  // 添加用户信息到响应头（可选）
  if (user) {
    response.headers.set('X-User-ID', user.id.toString())
  }
  
  return response
})

/**
 * 需要认证的路由保护中间件
 */
export const requireAuth = createMiddleware().server(async ({ request, next }) => {
  const cookies = request.headers.get('cookie')
  const sessionId = cookies
    ?.split(';')
    .find(c => c.trim().startsWith('session='))
    ?.split('=')[1]
  
  if (!sessionId) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  const sessionData = authDb.getSessionWithUser(sessionId)
  if (!sessionData) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  return next()
})

/**
 * 管理员权限中间件
 */
export const requireAdmin = createMiddleware().server(async ({ request, next }) => {
  const cookies = request.headers.get('cookie')
  const sessionId = cookies
    ?.split(';')
    .find(c => c.trim().startsWith('session='))
    ?.split('=')[1]
  
  if (!sessionId) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  const sessionData = authDb.getSessionWithUser(sessionId)
  if (!sessionData || sessionData.user.role !== 'admin') {
    return new Response('Forbidden', { status: 403 })
  }
  
  return next()
})

/**
 * 获取当前用户的工具函数
 */
export function getCurrentUser(request: Request) {
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
}`
  }

  /**
   * 生成登录 API
   */
  static generateLoginApi() {
    return `import { json } from '@tanstack/solid-router'
import { createAPIFileRoute } from '@tanstack/solid-router'
import { authDb } from '../../lib/auth/database'

export const Route = createAPIFileRoute('/api/auth/login')({
  POST: async ({ request }: { request: Request }) => {
    try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return json({ error: '邮箱和密码不能为空' }, { status: 400 })
    }
    
    // 验证用户
    const user = authDb.verifyUser(email, password)
    if (!user) {
      return json({ error: '邮箱或密码错误' }, { status: 401 })
    }
    
    // 创建 session
    const session = authDb.createSession(user.id)
    
    // 设置 cookie
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
    
    // HttpOnly cookie 防止 XSS
    response.headers.set('Set-Cookie', 
      \`session=\${session.id}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=\${7 * 24 * 60 * 60}\`
    )
    
    return response
    
    } catch (error) {
      console.error('Login error:', error)
      return json({ error: '登录失败' }, { status: 500 })
    }
  }
})`
  }

  /**
   * 生成注册 API
   */
  static generateRegisterApi() {
    return `import { json } from '@tanstack/solid-router'
import { createAPIFileRoute } from '@tanstack/solid-router'
import { authDb } from '../../lib/auth/database'

export const Route = createAPIFileRoute('/api/auth/register')({
  POST: async ({ request }: { request: Request }) => {
  try {
    const { email, password, name } = await request.json()
    
    if (!email || !password || !name) {
      return json({ error: '所有字段都是必填的' }, { status: 400 })
    }
    
    // 简单的密码强度检查
    if (password.length < 6) {
      return json({ error: '密码至少需要6个字符' }, { status: 400 })
    }
    
    // 检查邮箱格式
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
    if (!emailRegex.test(email)) {
      return json({ error: '邮箱格式不正确' }, { status: 400 })
    }
    
    try {
      // 创建用户
      const user = authDb.createUser(email, name, password)
      if (!user) {
        return json({ error: '创建用户失败' }, { status: 500 })
      }
      
      // 创建 session
      const session = authDb.createSession(user.id)
      
      // 设置 cookie
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
      if (error.message.includes('该邮箱已被注册')) {
        return json({ error: '该邮箱已被注册' }, { status: 409 })
      }
      throw error
    }
    
  } catch (error) {
    console.error('Register error:', error)
    return json({ error: '注册失败' }, { status: 500 })
    }
  }
})`
  }

  /**
   * 生成登出 API
   */
  static generateLogoutApi() {
    return `import { json } from '@tanstack/solid-router'
import { createAPIFileRoute } from '@tanstack/solid-router'
import { authDb } from '../../lib/auth/database'

export const Route = createAPIFileRoute('/api/auth/logout')({
  POST: async ({ request }: { request: Request }) => {
  try {
    // 从 cookie 获取 session ID
    const cookies = request.headers.get('cookie')
    const sessionId = cookies
      ?.split(';')
      .find(c => c.trim().startsWith('session='))
      ?.split('=')[1]
    
    if (sessionId) {
      // 删除 session
      authDb.deleteSession(sessionId)
    }
    
    // 清除 cookie
    const response = json({ message: '登出成功' })
    response.headers.set('Set-Cookie', 
      'session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'
    )
    
    return response
    
  } catch (error) {
    console.error('Logout error:', error)
    return json({ error: '登出失败' }, { status: 500 })
    }
  }
})`
  }

  /**
   * 生成获取当前用户 API
   */
  static generateMeApi() {
    return `import { json } from '@tanstack/solid-router'
import { createAPIFileRoute } from '@tanstack/solid-router'
import { getCurrentUser } from '../../middleware/auth'

export const Route = createAPIFileRoute('/api/auth/me')({
  GET: async ({ request }: { request: Request }) => {
  try {
    const user = getCurrentUser(request)
    
    if (!user) {
      return json({ error: '未登录' }, { status: 401 })
    }
    
    return json({ user })
    
  } catch (error) {
    console.error('Get user error:', error)
    return json({ error: '获取用户信息失败' }, { status: 500 })
    }
  }
})`
  }

  /**
   * 生成所有 API 文件
   */
  static async generate(projectPath) {
    console.log('生成认证 API...')
    // 创建 API 目录
    const apiDir = join(projectPath, 'src', 'routes', 'api', 'auth')
    await fs.ensureDir(apiDir)
    
    // 创建中间件目录
    const middlewareDir = join(projectPath, 'src', 'middleware')
    await fs.ensureDir(middlewareDir)
    
    // 生成 API 文件
    await fs.writeFile(join(apiDir, 'login.ts'), this.generateLoginApi())
    await fs.writeFile(join(apiDir, 'register.ts'), this.generateRegisterApi())
    await fs.writeFile(join(apiDir, 'logout.ts'), this.generateLogoutApi())
    await fs.writeFile(join(apiDir, 'me.ts'), this.generateMeApi())
    
    // 生成中间件
    await fs.writeFile(join(middlewareDir, 'auth.ts'), this.generateAuthMiddleware())
  }
}