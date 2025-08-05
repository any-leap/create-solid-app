import { createFileRoute } from '@tanstack/solid-start'

export const Route = createFileRoute('/')({
  component: AdminDashboard,
})

import { Button } from '~/components/ui/Button'

function AdminDashboard() {
  return (
    <div class="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span class="text-white font-bold text-sm">A</span>
                </div>
                <div>
                  <h1 class="text-xl font-semibold text-gray-900">管理控制台</h1>
                  <p class="text-xs text-gray-500">系统管理面板</p>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div class="flex items-center space-x-4">
              <div class="relative">
                <button class="p-2 text-gray-400 hover:text-gray-500 relative">
                  <span class="sr-only">通知</span>
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5c-3 3-8 3-11 0l-5-5h5m7 0v3a7.07 7.07 0 01-5 0v-3m5 0l5-5-5-5H7l-5 5 5 5h8z" />
                  </svg>
                  <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
              </div>

              <div class="flex items-center space-x-3">
                <span class="text-sm text-gray-700">欢迎回来，</span>
                <span class="text-sm font-medium text-gray-900">管理员</span>
                <div class="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-medium text-sm">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 mb-8 text-white">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold mb-2">🎉 欢迎使用管理后台</h2>
              <p class="text-blue-100 mb-4">今天是美好的一天，让我们一起管理您的应用吧！</p>
              <Button class="bg-white text-blue-600 hover:bg-blue-50 font-medium">
                查看最新功能
              </Button>
            </div>
            <div class="hidden md:block">
              <div class="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                <span class="text-4xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="总用户数"
            value="1,234"
            change="+12%"
            changeType="positive"
            icon="👥"
            color="blue"
          />
          <StatCard
            title="今日访问"
            value="856"
            change="+8%"
            changeType="positive"
            icon="📈"
            color="green"
          />
          <StatCard
            title="总收入"
            value="¥89,420"
            change="+15%"
            changeType="positive"
            icon="💰"
            color="purple"
          />
          <StatCard
            title="活跃订单"
            value="342"
            change="-2%"
            changeType="negative"
            icon="📦"
            color="orange"
          />
        </div>

        {/* Content Grid */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div class="lg:col-span-2">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-900">⚡ 快速操作</h3>
                <Button variant="ghost" size="sm" class="text-blue-600 hover:text-blue-700 p-0 h-auto">查看全部</Button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ActionCard icon="👥" title="用户管理" description="管理用户账户和权限" />
                <ActionCard icon="📊" title="数据分析" description="查看详细的数据报告" />
                <ActionCard icon="⚙️" title="系统设置" description="配置系统参数" />
                <ActionCard icon="🔒" title="安全中心" description="管理安全策略" />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">🕒 最近活动</h3>
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div class="space-y-4">
              <ActivityItem
                action="新用户注册"
                user="张三"
                time="5分钟前"
                type="user"
              />
              <ActivityItem
                action="订单创建"
                user="李四"
                time="10分钟前"
                type="order"
              />
              <ActivityItem
                action="数据导出"
                user="王五"
                time="15分钟前"
                type="export"
              />
              <ActivityItem
                action="系统备份"
                user="系统"
                time="30分钟前"
                type="system"
              />
            </div>
            <Button
              variant="ghost"
              class="w-full mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              size="sm"
            >
              查看所有活动
            </Button>
          </div>
        </div>

        {/* Performance Charts Placeholder */}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <ChartCard title="📈 用户增长趋势" />
          <ChartCard title="💹 收入统计" />
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, changeType, icon, color }: {
  title: string,
  value: string,
  change: string,
  changeType: 'positive' | 'negative',
  icon: string,
  color: string
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  }

  return (
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between mb-4">
        <div class={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-xl flex items-center justify-center text-white text-xl`}>
          {icon}
        </div>
        <div class={`text-sm font-medium ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </div>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p class="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

function ActionCard({ icon, title, description }: { icon: string, title: string, description: string }) {
  return (
    <div class="p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all group">
      <div class="flex items-start space-x-3">
        <div class="text-2xl group-hover:scale-110 transition-transform">{icon}</div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-gray-900 group-hover:text-blue-700">{title}</p>
          <p class="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  )
}

function ActivityItem({ action, user, time, type }: { action: string, user: string, time: string, type: string }) {
  const typeIcons = {
    user: '👤',
    order: '🛒',
    export: '📤',
    system: '⚙️'
  }

  return (
    <div class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
      <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm">
        {typeIcons[type]}
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900">{action}</p>
        <p class="text-xs text-gray-500">用户: {user}</p>
      </div>
      <div class="text-xs text-gray-400">{time}</div>
    </div>
  )
}

function ChartCard({ title }: { title: string }) {
  return (
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div class="h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
        <div class="text-center text-gray-500">
          <div class="text-4xl mb-2">📊</div>
          <p class="text-sm">图表数据加载中...</p>
          <p class="text-xs mt-1">集成您喜欢的图表库</p>
        </div>
      </div>
    </div>
  )
}