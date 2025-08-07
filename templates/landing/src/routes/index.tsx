import { createFileRoute } from '@tanstack/solid-router'
import { Button } from "@kobalte/core/button"

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div class="min-h-screen bg-white">
      {/* Modern Header */}
      <header class="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">S</span>
              </div>
              <span class="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SolidApp
              </span>
            </div>
            <nav class="hidden md:flex items-center space-x-8">
              <a class="text-gray-600 hover:text-blue-600 transition-colors font-medium" href="#features">
                特性
              </a>
              <a class="text-gray-600 hover:text-blue-600 transition-colors font-medium" href="#pricing">
                价格
              </a>
              <a class="text-gray-600 hover:text-blue-600 transition-colors font-medium" href="#testimonials">
                案例
              </a>
              <button class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                免费试用
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Enhanced Design */}
      <section class="pt-24 pb-12 md:pt-32 md:pb-20 relative overflow-hidden">
        {/* Background Elements */}
        <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div class="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div class="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <div class="mb-8">
              <div class="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                🎉 全新版本 v2.0 现已发布
              </div>
            </div>
            
            <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              构建{' '}
              <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                下一代
              </span>
              <br />
              Web 应用
            </h1>
            
            <p class="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              基于 TanStack Solid Start 的现代化开发平台，
              让您专注于<strong>创新</strong>而非配置。
              快速构建高性能、可扩展的全栈应用。
            </p>

            {/* CTA Buttons */}
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={() => alert('🎉 使用 @kobalte/core Button 创建现代化的 UI！')}
              >
                🚀 免费开始构建 (Kobalte)
              </Button>
              <button class="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center space-x-2">
                <span>▶️</span>
                <span>观看演示</span>
              </button>
            </div>

            {/* Social Proof */}
            <div class="flex flex-col items-center space-y-4 text-gray-500">
              <p class="text-sm">已被全球 50,000+ 开发者信赖</p>
              <div class="flex items-center space-x-8 opacity-60">
                <CompanyLogo name="GitHub" />
                <CompanyLogo name="Vercel" />
                <CompanyLogo name="Microsoft" />
                <CompanyLogo name="Google" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              为什么选择 <span class="text-blue-600">SolidApp</span>？
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              我们重新定义了 Web 开发体验，让复杂的技术变得简单易用
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="⚡"
              title="极速性能"
              description="基于 Solid.js 的响应式框架，比 React 快 2-3 倍，包体积更小"
              gradient="from-yellow-400 to-orange-500"
            />
            <FeatureCard 
              icon="🛡️"
              title="类型安全"
              description="端到端 TypeScript 支持，在编译时发现错误，提高代码质量"
              gradient="from-blue-400 to-purple-500"
            />
            <FeatureCard 
              icon="🚀"
              title="开箱即用"
              description="数据库、认证、API、部署配置一应俱全，零配置开始开发"
              gradient="from-green-400 to-blue-500"
            />
            <FeatureCard 
              icon="🎨"
              title="现代化 UI"
              description="Tailwind CSS + 精美组件库，让您的应用颜值爆表"
              gradient="from-pink-400 to-red-500"
            />
            <FeatureCard 
              icon="🔧"
              title="开发者体验"
              description="热重载、智能提示、一键部署，让开发变成一种享受"
              gradient="from-purple-400 to-indigo-500"
            />
            <FeatureCard 
              icon="🌐"
              title="全栈支持"
              description="前端、后端、数据库、部署，全栈开发一站式解决方案"
              gradient="from-teal-400 to-cyan-500"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              开发者都在说什么？
            </h2>
            <p class="text-xl text-gray-600">真实用户，真实反馈</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="SolidApp 让我的开发效率提升了 300%，真的是太棒了！"
              author="张伟 - 全栈工程师"
              avatar="👨‍💻"
            />
            <TestimonialCard 
              quote="终于找到了完美的 Solid Start 脚手架，推荐给所有开发者！"
              author="李晓明 - 前端架构师"
              avatar="👨‍🚀"
            />
            <TestimonialCard 
              quote="从设置到部署只用了 10 分钟，这就是我要的开发体验。"
              author="王小红 - 创业者"
              avatar="👩‍💼"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl md:text-5xl font-bold text-white mb-6">
            准备开始构建了吗？
          </h2>
          <p class="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            加入全球 50,000+ 开发者的行列，开始构建下一代 Web 应用
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div class="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <input 
                class="bg-transparent border-none outline-none text-white placeholder-blue-200 text-lg"
                placeholder="输入您的邮箱"
                type="email"
              />
            </div>
            <button class="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              免费开始
            </button>
          </div>
          
          <p class="text-sm text-blue-200">
            🔒 我们重视您的隐私，绝不会发送垃圾邮件
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div class="flex items-center space-x-2 mb-4">
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span class="text-white font-bold text-sm">S</span>
                </div>
                <span class="font-bold text-xl">SolidApp</span>
              </div>
              <p class="text-gray-400">构建现代化 Web 应用的最佳选择</p>
            </div>
            
            <div>
              <h3 class="font-semibold mb-4">产品</h3>
              <ul class="space-y-2 text-gray-400">
                <li><a href="#" class="hover:text-white transition-colors">功能特性</a></li>
                <li><a href="#" class="hover:text-white transition-colors">定价</a></li>
                <li><a href="#" class="hover:text-white transition-colors">模板</a></li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-semibold mb-4">开发者</h3>
              <ul class="space-y-2 text-gray-400">
                <li><a href="#" class="hover:text-white transition-colors">文档</a></li>
                <li><a href="#" class="hover:text-white transition-colors">API 参考</a></li>
                <li><a href="#" class="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-semibold mb-4">支持</h3>
              <ul class="space-y-2 text-gray-400">
                <li><a href="#" class="hover:text-white transition-colors">帮助中心</a></li>
                <li><a href="#" class="hover:text-white transition-colors">社区</a></li>
                <li><a href="#" class="hover:text-white transition-colors">联系我们</a></li>
              </ul>
            </div>
          </div>
          
          <div class="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-400">© 2024 SolidApp. 保留所有权利。</p>
            <div class="flex space-x-6 mt-4 md:mt-0">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">服务条款</a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">隐私政策</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, gradient }: { 
  icon: string, 
  title: string, 
  description: string,
  gradient: string 
}) {
  return (
    <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
      <div class={`w-14 h-14 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center text-2xl mb-6`}>
        {icon}
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p class="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

function TestimonialCard({ quote, author, avatar }: { quote: string, author: string, avatar: string }) {
  return (
    <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
      <div class="text-4xl mb-4">"</div>
      <p class="text-gray-700 mb-6 leading-relaxed italic">{quote}</p>
      <div class="flex items-center space-x-3">
        <div class="text-2xl">{avatar}</div>
        <div>
          <p class="font-semibold text-gray-900">{author}</p>
        </div>
      </div>
    </div>
  )
}

function CompanyLogo({ name }: { name: string }) {
  return (
    <div class="bg-gray-100 px-4 py-2 rounded-lg">
      <span class="text-gray-600 font-medium text-sm">{name}</span>
    </div>
  )
}