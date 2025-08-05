import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  return (
    <div class="min-h-screen bg-gray-50">
      {/* Header */}
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-semibold text-gray-900">管理后台</h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-500">欢迎，管理员</span>
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="总用户数" value="1,234" change="+12%" />
          <StatCard title="今日访问" value="856" change="+8%" />
          <StatCard title="总收入" value="¥89,420" change="+15%" />
          <StatCard title="订单数" value="342" change="+3%" />
        </div>

        {/* Content Sections */}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">快速操作</h3>
            <div class="space-y-3">
              <ActionItem icon="👥" label="用户管理" description="查看和管理用户账户" />
              <ActionItem icon="📊" label="数据分析" description="查看详细的数据报告" />
              <ActionItem icon="⚙️" label="系统设置" description="配置系统参数" />
              <ActionItem icon="🔒" label="权限管理" description="管理用户权限和角色" />
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">最近活动</h3>
            <div class="space-y-3">
              <ActivityItem 
                action="新用户注册" 
                user="张三" 
                time="5分钟前" 
              />
              <ActivityItem 
                action="订单创建" 
                user="李四" 
                time="10分钟前" 
              />
              <ActivityItem 
                action="数据导出" 
                user="王五" 
                time="15分钟前" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-500">{title}</p>
          <p class="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div class="text-sm text-green-600">{change}</div>
      </div>
    </div>
  )
}

function ActionItem({ icon, label, description }: { icon: string; label: string; description: string }) {
  return (
    <div class="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
      <div class="text-2xl mr-3">{icon}</div>
      <div>
        <p class="font-medium text-gray-900">{label}</p>
        <p class="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  )
}

function ActivityItem({ action, user, time }: { action: string; user: string; time: string }) {
  return (
    <div class="flex items-center justify-between py-2">
      <div>
        <p class="text-sm font-medium text-gray-900">{action}</p>
        <p class="text-xs text-gray-500">用户: {user}</p>
      </div>
      <div class="text-xs text-gray-400">{time}</div>
    </div>
  )
}