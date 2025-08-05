import { join } from 'path'
import fs from 'fs-extra'

/**
 * 认证系统生成器
 */
export class AuthGenerator {
  /**
   * 生成认证存储
   */
  static generateAuthStore() {
    return `import { createSignal, createContext, useContext, onMount, ParentComponent } from 'solid-js'
import { createStore } from 'solid-js/store'

/**
 * 用户类型定义
 */
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'user' | 'admin'
  createdAt: string
}

/**
 * 认证状态类型
 */
export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

/**
 * 认证上下文类型
 */
export interface AuthContextType {
  state: AuthState
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType>()

/**
 * 认证提供者组件
 */
export const AuthProvider: ParentComponent = (props) => {
  const [state, setState] = createStore<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  })

  /**
   * 登录函数
   */
  const login = async (email: string, password: string) => {
    setState('isLoading', true)
    
    try {
      // 这里调用你的登录 API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (!response.ok) {
        throw new Error('登录失败')
      }
      
      const { user, token } = await response.json()
      
      // 存储 token
      localStorage.setItem('auth_token', token)
      
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
   * 注册函数
   */
  const register = async (email: string, password: string, name: string) => {
    setState('isLoading', true)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })
      
      if (!response.ok) {
        throw new Error('注册失败')
      }
      
      const { user, token } = await response.json()
      
      localStorage.setItem('auth_token', token)
      
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
   * 登出函数
   */
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('auth_token')
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false
      })
    }
  }

  /**
   * 刷新用户信息
   */
  const refreshUser = async () => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      setState('isLoading', false)
      return
    }
    
    try {
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: \`Bearer \${token}\` }
      })
      
      if (!response.ok) {
        throw new Error('获取用户信息失败')
      }
      
      const user = await response.json()
      
      setState({
        user,
        isLoading: false,
        isAuthenticated: true
      })
    } catch (error) {
      localStorage.removeItem('auth_token')
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false
      })
    }
  }

  // 组件挂载时检查认证状态
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
 * 使用认证的 Hook
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
   * 生成认证组件
   */
  static generateAuthComponents() {
    return `import { createSignal, Show } from 'solid-js'
import { useAuth } from '../lib/auth/auth-store'

/**
 * 登录表单组件
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
      setError(err instanceof Error ? err.message : '登录失败')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-center">登录</h2>
      
      <form onSubmit={handleSubmit} class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            邮箱
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
            密码
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
          {isLoading() ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  )
}

/**
 * 注册表单组件
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
      setError('密码不匹配')
      return
    }
    
    setIsLoading(true)
    setError('')

    try {
      await register(email(), password(), name())
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-center">注册</h2>
      
      <form onSubmit={handleSubmit} class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            姓名
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
            邮箱
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
            密码
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
            确认密码
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
          {isLoading() ? '注册中...' : '注册'}
        </button>
      </form>
    </div>
  )
}

/**
 * 用户菜单组件
 */
export function UserMenu() {
  const { state, logout } = useAuth()

  return (
    <Show 
      when={state.isAuthenticated && state.user} 
      fallback={
        <div class="flex space-x-2">
          <a href="/login" class="text-blue-600 hover:text-blue-800">登录</a>
          <a href="/register" class="text-green-600 hover:text-green-800">注册</a>
        </div>
      }
    >
      <div class="flex items-center space-x-4">
        <span class="text-gray-700">欢迎，{state.user?.name}</span>
        <button
          onClick={logout}
          class="text-red-600 hover:text-red-800"
        >
          登出
        </button>
      </div>
    </Show>
  )
}`
  }

  /**
   * 生成认证相关文件
   */
  static async generate(projectPath) {
    // 创建 auth 目录
    const authDir = join(projectPath, 'src', 'lib', 'auth')
    await fs.ensureDir(authDir)
    
    // 生成认证存储
    await fs.writeFile(
      join(authDir, 'auth-store.ts'), 
      this.generateAuthStore()
    )
    
    // 生成认证组件
    await fs.writeFile(
      join(projectPath, 'src', 'components', 'Auth.tsx'),
      this.generateAuthComponents()
    )
    
    // 生成使用说明
    const readme = `# 认证系统

## 功能特性
- ✅ 用户登录/注册
- ✅ JWT Token 管理
- ✅ 自动状态刷新
- ✅ 受保护路由
- ✅ 用户角色管理

## 快速开始

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
import { Show } from 'solid-js'

function MyComponent() {
  const { state, logout } = useAuth()
  
  return (
    <Show when={state.isAuthenticated} fallback={<LoginForm />}>
      <div>欢迎，{state.user?.name}!</div>
      <button onClick={logout}>登出</button>
    </Show>
  )
}
\`\`\`

### 3. 创建服务器端 API 路由

你需要创建以下 API 端点：

- \`POST /api/auth/login\` - 用户登录
- \`POST /api/auth/register\` - 用户注册
- \`POST /api/auth/logout\` - 用户登出
- \`GET /api/auth/me\` - 获取当前用户信息

## API 示例（TanStack Start）

\`\`\`typescript
// src/routes/api/auth/login.ts
import { json } from '@tanstack/solid-router'

export async function POST({ request }: { request: Request }) {
  const { email, password } = await request.json()
  
  // 这里添加你的认证逻辑
  // 验证用户凭据，生成 JWT token
  
  return json({
    user: { id: '1', email, name: 'User' },
    token: 'jwt-token-here'
  })
}
\`\`\`

## 环境变量

在 \`.env\` 文件中添加：
\`\`\`
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-session-secret
\`\`\`

## 注意事项

1. 这是一个基础的客户端认证实现
2. 服务器端逻辑需要你自己实现
3. 建议使用 HTTPS 在生产环境中
4. JWT 密钥应该足够复杂且保密
`
    
    await fs.writeFile(join(authDir, 'README.md'), readme)
  }
}