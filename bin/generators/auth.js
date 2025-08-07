import { join } from 'path'
import fs from 'fs-extra'

/**
 * Authentication system generator
 */
export class AuthGenerator {
  /**
   * Generate database schema
   */
  static generateDatabaseSchema() {
    return `import Database from 'better-sqlite3'
import { createHash, randomBytes } from 'crypto'

/**
 * User type definition
 */
export interface User {
  id: number
  email: string
  name: string
  password_hash: string
  role: 'user' | 'admin'
  avatar?: string
  created_at: string
  updated_at: string
}

/**
 * Session type definition
 */
export interface Session {
  id: string
  user_id: number
  expires_at: string
  created_at: string
}

/**
 * Database management class
 */
export class AuthDatabase {
  private db: Database

  constructor(dbPath: string = './data/auth.sqlite') {
    this.db = new Database(dbPath, { create: true })
    this.initTables()
  }

  /**
   * Initialize database tables
   */
  private initTables() {
    // Create users table
    this.db.exec(\`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    \`)

    // Create sessions table
    this.db.exec(\`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    \`)

    // Create indexes
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)')
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at)')
  }

  /**
   * Create user
   */
  createUser(email: string, name: string, password: string, role: 'user' | 'admin' = 'user'): User | null {
    const passwordHash = this.hashPassword(password)
    
    try {
      const stmt = this.db.prepare(\`
        INSERT INTO users (email, name, password_hash, role) 
        VALUES (?, ?, ?, ?)
      \`)
      
      const result = stmt.run(email, name, passwordHash, role)
      
      return this.getUserById(result.lastInsertRowid as number)
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('This email is already registered')
      }
      throw error
    }
  }

  /**
   * Verify user by email and password
   */
  verifyUser(email: string, password: string): User | null {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?')
    const user = stmt.get(email) as User | undefined
    
    if (!user || !this.verifyPassword(password, user.password_hash)) {
      return null
    }
    
    return user
  }

  /**
   * Get user by ID
   */
  getUserById(id: number): User | null {
    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?')
    return stmt.get(id) as User | null
  }

  /**
   * Get user by email
   */
  getUserByEmail(email: string): User | null {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?')
    return stmt.get(email) as User | null
  }

  /**
   * Create session
   */
  createSession(userId: number, expiresInMs: number = 7 * 24 * 60 * 60 * 1000): Session {
    const sessionId = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + expiresInMs).toISOString()
    
    const stmt = this.db.prepare(\`
      INSERT INTO sessions (id, user_id, expires_at) 
      VALUES (?, ?, ?)
    \`)
    
    stmt.run(sessionId, userId, expiresAt)
    
    return {
      id: sessionId,
      user_id: userId,
      expires_at: expiresAt,
      created_at: new Date().toISOString()
    }
  }

  /**
   * Get session and associated user
   */
  getSessionWithUser(sessionId: string): { session: Session; user: User } | null {
    const stmt = this.db.prepare(\`
      SELECT 
        s.id as session_id,
        s.user_id,
        s.expires_at,
        s.created_at as session_created_at,
        u.*
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ? AND s.expires_at > datetime('now')
    \`)
    
    const result = stmt.get(sessionId) as any
    
    if (!result) return null
    
    return {
      session: {
        id: result.session_id,
        user_id: result.user_id,
        expires_at: result.expires_at,
        created_at: result.session_created_at
      },
      user: {
        id: result.id,
        email: result.email,
        name: result.name,
        password_hash: result.password_hash,
        role: result.role,
        avatar: result.avatar,
        created_at: result.created_at,
        updated_at: result.updated_at
      }
    }
  }

  /**
   * Delete session (logout)
   */
  deleteSession(sessionId: string): void {
    const stmt = this.db.prepare('DELETE FROM sessions WHERE id = ?')
    stmt.run(sessionId)
  }

  /**
   * Delete all user sessions
   */
  deleteUserSessions(userId: number): void {
    const stmt = this.db.prepare('DELETE FROM sessions WHERE user_id = ?')
    stmt.run(userId)
  }

  /**
   * Clean up expired sessions
   */
  cleanupExpiredSessions(): void {
    const stmt = this.db.prepare('DELETE FROM sessions WHERE expires_at <= datetime("now")')
    stmt.run()
  }

  /**
   * Password hashing
   */
  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex')
    const hash = createHash('sha256').update(password + salt).digest('hex')
    return \`\${salt}:\${hash}\`
  }

  /**
   * Verify password
   */
  private verifyPassword(password: string, passwordHash: string): boolean {
    const [salt, hash] = passwordHash.split(':')
    const expectedHash = createHash('sha256').update(password + salt).digest('hex')
    return hash === expectedHash
  }

  /**
   * Close database connection
   */
  close(): void {
    this.db.close()
  }
}

// Create global database instance
export const authDb = new AuthDatabase()`
  }

  /**
   * Generate client-side authentication store
   */
  static generateAuthStore() {
    return `import { createSignal, createContext, useContext, onMount, ParentComponent } from 'solid-js'
import { createStore } from 'solid-js/store'

/**
 * User type definition (client-side)
 */
export interface User {
  id: number
  email: string
  name: string
  role: 'user' | 'admin'
  avatar?: string
  created_at: string
}

/**
 * Authentication state type
 */
export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

/**
 * Authentication context type
 */
export interface AuthContextType {
  state: AuthState
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

// Create authentication context
const AuthContext = createContext<AuthContextType>()

/**
 * Authentication provider component - based on server-side Session
 */
export const AuthProvider: ParentComponent = (props) => {
  const [state, setState] = createStore<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  })

  /**
   * Login function - using httpOnly cookie
   */
  const login = async (email: string, password: string) => {
    setState('isLoading', true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important: include cookies
        body: JSON.stringify({ email, password })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Login failed')
      }
      
      const { user } = await response.json()
      
      setState({
        user,
        isLoading: false,
        isAuthenticated: true
      })
    } catch (error) {
      setState('isLoading', false)
      throw error
    }
  }

  /**
   * Register function
   */
  const register = async (email: string, password: string, name: string) => {
    setState('isLoading', true)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, name })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Registration failed')
      }
      
      const { user } = await response.json()
      
      setState({
        user,
        isLoading: false,
        isAuthenticated: true
      })
    } catch (error) {
      setState('isLoading', false)
      throw error
    }
  }

  /**
   * Logout function
   */
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false
      })
    }
  }

  /**
   * Refresh user information - check server-side session
   */
  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const { user } = await response.json()
        setState({
          user,
          isLoading: false,
          isAuthenticated: true
        })
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false
        })
      }
    } catch (error) {
      console.error('Refresh user error:', error)
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false
      })
    }
  }

  // Check authentication status on component mount
  onMount(() => {
    refreshUser()
  })

  const value: AuthContextType = {
    state,
    login,
    register,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  )
}

/**
 * Authentication Hook
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}`
  }

  /**
   * Generate authentication components
   */
  static generateAuthComponents() {
    return `import { createSignal, Show } from 'solid-js'
import { useAuth } from '../lib/auth/auth-store'

/**
 * Login form component
 */
export function LoginForm() {
  const { login } = useAuth()
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [isLoading, setIsLoading] = createSignal(false)
  const [error, setError] = createSignal('')

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await login(email(), password())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
      
      <form onSubmit={handleSubmit} class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <Show when={error()}>
          <div class="text-red-600 text-sm">{error()}</div>
        </Show>
        
        <button
          type="submit"
          disabled={isLoading()}
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading() ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

/**
 * Registration form component
 */
export function RegisterForm() {
  const { register } = useAuth()
  const [name, setName] = createSignal('')
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [confirmPassword, setConfirmPassword] = createSignal('')
  const [isLoading, setIsLoading] = createSignal(false)
  const [error, setError] = createSignal('')

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    
    if (password() !== confirmPassword()) {
      setError('Passwords do not match')
      return
    }
    
    setIsLoading(true)
    setError('')

    try {
      await register(email(), password(), name())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
      
      <form onSubmit={handleSubmit} class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name()}
            onInput={(e) => setName(e.currentTarget.value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword()}
            onInput={(e) => setConfirmPassword(e.currentTarget.value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <Show when={error()}>
          <div class="text-red-600 text-sm">{error()}</div>
        </Show>
        
        <button
          type="submit"
          disabled={isLoading()}
          class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading() ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  )
}

/**
 * User menu component
 */
export function UserMenu() {
  const { state, logout } = useAuth()

  return (
    <Show 
      when={state.isAuthenticated && state.user} 
      fallback={
        <div class="flex space-x-2">
          <a href="/login" class="text-blue-600 hover:text-blue-800">Login</a>
          <a href="/register" class="text-green-600 hover:text-green-800">Register</a>
        </div>
      }
    >
      <div class="flex items-center space-x-4">
        <span class="text-gray-700">Welcome, {state.user?.name}</span>
        <button
          onClick={logout}
          class="text-red-600 hover:text-red-800"
        >
          Logout
        </button>
      </div>
    </Show>
  )
}`
  }

  /**
   * Generate authentication related files
   */
  static async generate(projectPath) {
    // Create necessary directories
    const authDir = join(projectPath, 'src', 'lib', 'auth')
    const dataDir = join(projectPath, 'data')
    await fs.ensureDir(authDir)
    await fs.ensureDir(dataDir)
    
    // Generate database layer
    await fs.writeFile(
      join(authDir, 'database.ts'), 
      this.generateDatabaseSchema()
    )
    
    // Generate client-side authentication store
    await fs.writeFile(
      join(authDir, 'auth-store.tsx'), 
      this.generateAuthStore()
    )
    
    // Generate authentication components
    await fs.writeFile(
      join(projectPath, 'src', 'components', 'Auth.tsx'),
      this.generateAuthComponents()
    )
    
    // Generate API routes
    const { AuthApiGenerator } = await import('./auth-api.js')
    await AuthApiGenerator.generate(projectPath)
    
    // Generate usage documentation
    const readme = `# Authentication System - Session Based (Security Upgrade)

## 🔐 安全特性
- ✅ 服务器端 Session 存储（比 JWT 更安全）
- ✅ HttpOnly Cookies 防止 XSS 攻击
- ✅ SQLite 数据库存储用户和会话
- ✅ Password安全哈希 (Salt + SHA256)
- ✅ 自动 Session 过期清理
- ✅ CSRF 保护 (SameSite cookies)

## 🚀 功能特性
- ✅ 用户Register/Login/Logout
- ✅ 用户角色管理 (user/admin)
- ✅ 自动会话刷新
- ✅ 受保护路由中间件
- ✅ 管理员权限控制

## 📁 文件结构
\`\`\`
src/
├── lib/auth/
│   ├── database.ts          # SQLite 数据库层
│   └── auth-store.ts        # 客户端状态管理
├── routes/api/auth/
│   ├── login.ts             # Login API
│   ├── register.ts          # Register API
│   ├── logout.ts            # Logout API
│   └── me.ts                # 获取当前用户
├── middleware/
│   └── auth.ts              # 认证中间件
└── components/
    └── Auth.tsx             # 认证 UI 组件
\`\`\`

## 🗄️ 数据库设计

### Users 表
\`\`\`sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  avatar TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Sessions 表
\`\`\`sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
\`\`\`

## 💻 使用方法

### 1. 在应用根组件包装认证提供者
\`\`\`tsx
import { AuthProvider } from './lib/auth/auth-store'

function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  )
}
\`\`\`

### 2. 在组件中使用认证
\`\`\`tsx
import { useAuth } from './lib/auth/auth-store'
import { LoginForm, RegisterForm, UserMenu } from './components/Auth'
import { Show } from 'solid-js'

function MyComponent() {
  const { state } = useAuth()
  
  return (
    <Show 
      when={state.isAuthenticated} 
      fallback={<LoginForm />}
    >
      <UserMenu />
      <div>欢迎回来，{state.user?.name}!</div>
    </Show>
  )
}
\`\`\`

### 3. 使用中间件保护路由
\`\`\`tsx
// 需要Login的路由
import { requireAuth } from '../middleware/auth'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: requireAuth,
  component: Dashboard
})

// 需要管理员权限的路由
import { requireAdmin } from '../middleware/auth'

export const Route = createFileRoute('/admin')({
  beforeLoad: requireAdmin,
  component: AdminPanel
})
\`\`\`

### 4. 在服务器函数中获取当前用户
\`\`\`tsx
import { getCurrentUser } from '../middleware/auth'

export async function serverFunction({ request }) {
  const user = getCurrentUser(request)
  
  if (!user) {
    throw new Error('未Login')
  }
  
  // 使用 user.id, user.role 等
  return { message: \`Hello \${user.name}\` }
}
\`\`\`

## 🛡️ 安全特性详解

### 1. HttpOnly Cookies
- Session ID 存储在 HttpOnly cookie 中
- 前端 JavaScript 无法访问，防止 XSS 攻击
- 自动在请求中发送，无需手动管理

### 2. Password安全
- 使用随机 salt + SHA256 哈希
- Password明文不存储在数据库中
- 防止彩虹表攻击

### 3. Session 管理
- 服务器端存储会话状态
- 自动清理过期会话
- 支持多设备Login管理

### 4. CSRF 保护
- SameSite=Strict cookie 设置
- 防止跨站请求伪造攻击

## 🚀 生产部署建议

1. **HTTPS**: 生产环境必须使用 HTTPS
2. **数据库备份**: 定期备份 SQLite 数据库
3. **Session 清理**: 设置定时任务清理过期会话
4. **监控**: 添加Login失败监控和限制

## 🔧 环境变量

在 \`.env\` 文件中添加：
\`\`\`
# 可选：自定义数据库路径
DATABASE_PATH=./data/auth.sqlite

# 生产环境建议设置
NODE_ENV=production
\`\`\`

## 📊 管理功能

### 查看所有用户
\`\`\`tsx
import { authDb } from './lib/auth/database'

// 管理员可以查看用户列表
const users = authDb.getAllUsers()
\`\`\`

### 清理过期 Sessions
\`\`\`tsx
// 定期清理（可以设置 cron job）
authDb.cleanupExpiredSessions()
\`\`\`

这个认证系统提供了企业级的安全性和完整的用户管理功能！🔐
`
    
    await fs.writeFile(join(authDir, 'README.md'), readme)
  }
}