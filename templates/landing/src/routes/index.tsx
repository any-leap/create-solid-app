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
                Features
              </a>
              <a class="text-gray-600 hover:text-blue-600 transition-colors font-medium" href="#pricing">
                Pricing
              </a>
              <a class="text-gray-600 hover:text-blue-600 transition-colors font-medium" href="#testimonials">
                Testimonials
              </a>
              <button class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                Free Trial
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
                🎉 New Version v2.0 Now Available
              </div>
            </div>
            
            <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Build{' '}
              <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Next-Gen
              </span>
              <br />
              Web Apps
            </h1>
            
            <p class="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Modern development platform based on TanStack Solid Start,
              focus on <strong>innovation</strong> rather than configuration.
              Rapidly build high-performance, scalable full-stack applications.
            </p>

            {/* CTA Buttons */}
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={() => alert('🎉 Create modern UI with @kobalte/core Button!')}
              >
                🚀 Start Building Free (Kobalte)
              </Button>
              <button class="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center space-x-2">
                <span>▶️</span>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Social Proof */}
            <div class="flex flex-col items-center space-y-4 text-gray-500">
              <p class="text-sm">Trusted by 50,000+ developers worldwide</p>
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
              Why Choose <span class="text-blue-600">SolidApp</span>?
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              We redefine the Web development experience, making complex technology simple and easy to use
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="⚡"
              title="Lightning Fast"
              description="Reactive framework based on Solid.js, 2-3x faster than React with smaller bundle size"
              gradient="from-yellow-400 to-orange-500"
            />
            <FeatureCard 
              icon="🛡️"
              title="Type Safe"
              description="End-to-end TypeScript support, catch errors at compile time, improve code quality"
              gradient="from-blue-400 to-purple-500"
            />
            <FeatureCard 
              icon="🚀"
              title="Ready to Use"
              description="Database, authentication, API, deployment configuration all included, zero configuration to start development"
              gradient="from-green-400 to-blue-500"
            />
            <FeatureCard 
              icon="🎨"
              title="Modern UI"
              description="Tailwind CSS + beautiful component library, make your app look amazing"
              gradient="from-pink-400 to-red-500"
            />
            <FeatureCard 
              icon="🔧"
              title="Developer Experience"
              description="Hot reload, smart suggestions, one-click deployment, make development enjoyable"
              gradient="from-purple-400 to-indigo-500"
            />
            <FeatureCard 
              icon="🌐"
              title="Full-stack Support"
              description="Frontend, backend, database, deployment - complete full-stack development solution"
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
              What Are Developers Saying?
            </h2>
            <p class="text-xl text-gray-600">Real users, real feedback</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="SolidApp improved my development efficiency by 300%, it's absolutely amazing!"
              author="John Smith - Full-stack Engineer"
              avatar="👨‍💻"
            />
            <TestimonialCard 
              quote="Finally found the perfect Solid Start scaffolding, recommend it to all developers!"
              author="Michael Lee - Frontend Architect"
              avatar="👨‍🚀"
            />
            <TestimonialCard 
              quote="From setup to deployment took only 10 minutes, this is the development experience I want."
              author="Sarah Wang - Entrepreneur"
              avatar="👩‍💼"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Building?
          </h2>
          <p class="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join 50,000+ developers worldwide and start building next-generation Web applications
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div class="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <input 
                class="bg-transparent border-none outline-none text-white placeholder-blue-200 text-lg"
                placeholder="Enter your email"
                type="email"
              />
            </div>
            <button class="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              Start Free
            </button>
          </div>
          
          <p class="text-sm text-blue-200">
            🔒 We respect your privacy and will never send spam emails
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
              <p class="text-gray-400">The best choice for building modern Web applications</p>
            </div>
            
            <div>
              <h3 class="font-semibold mb-4">Product</h3>
              <ul class="space-y-2 text-gray-400">
                <li><a href="#" class="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Templates</a></li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-semibold mb-4">Developers</h3>
              <ul class="space-y-2 text-gray-400">
                <li><a href="#" class="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" class="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" class="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-semibold mb-4">Support</h3>
              <ul class="space-y-2 text-gray-400">
                <li><a href="#" class="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div class="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-400">© 2024 SolidApp. All rights reserved.</p>
            <div class="flex space-x-6 mt-4 md:mt-0">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
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