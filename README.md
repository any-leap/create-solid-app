# @any-l/create-solid-app

> 🚀 Modern TanStack Solid Start project scaffolding tool

English | [中文](./README-CN.md)

## 📦 Quick Start

Using Bun (recommended):

```bash
bunx @any-l/create-solid-app my-project
```

Using npm:

```bash
npx @any-l/create-solid-app my-project
```

## ✨ Features

- 🎨 **Interactive Configuration** - Customize project features based on your needs
- ⚡ **Multiple Templates** - Minimal, TanStack Router examples, Full-stack, Admin, Landing page
- 🛠️ **Optional Feature Modules** - Database, Authentication, Docker, CI/CD, Testing
- 📦 **Smart Dependency Management** - Install only necessary dependencies
- 🔄 **Automated Configuration** - One-click generation of complete project structure

## 🎯 Project Templates

### 📌 Minimal (minimal)

- Basic TanStack Solid Start configuration
- TypeScript + Tailwind CSS
- Development tooling setup

### 🔥 TanStack Router Bare (start-bare)

- Minimal TanStack Router example with basic routing
- Essential routing components (Counter, About page)
- Perfect for learning TanStack Router fundamentals
- TypeScript support

### 🛠️ TanStack Router Basic (start-basic)

- Comprehensive TanStack Router example
- Advanced routing features (nested layouts, API routes)
- Route loaders, error boundaries, and middleware
- TypeScript + Tailwind CSS
- Complete routing showcase

### 🚀 Full-stack (full-stack)

- Complete full-stack application framework
- Database integration (Drizzle ORM)
- API routes and middleware
- User authentication system

### 🏢 Admin Dashboard (admin)

- Modern admin interface
- Data tables and form components
- Permission management system
- Dashboard layout

### 🌐 Landing Page (landing)

- Marketing-oriented page structure
- SEO optimization configuration
- Responsive design
- Performance optimization

## ⚙️ Optional Features

- **🗄️ Database** - Drizzle ORM + SQLite/PostgreSQL
- **🔐 User Authentication** - Auth.js integration
- **🐳 Docker** - Containerized deployment configuration
- **⚙️ CI/CD** - GitHub Actions workflow
- **🧪 Testing** - Vitest testing framework
- **📊 Monitoring** - Performance and error monitoring

## 📖 Usage Example

```bash
# Create project
bunx @any-l/create-solid-app my-awesome-app

# Quick start with specific template
bunx @any-l/create-solid-app my-router-app --template start-basic

# Interactive selection
? Choose project template:
  Minimal Application
  TanStack Router Bare
> TanStack Router Basic
  Full-stack Application
  Admin Dashboard
  Landing Page

# Enter project directory
cd my-awesome-app

# Start development server
bun run dev
```

## 🚀 Generated Project Structure

```
my-awesome-app/
├── src/
│   ├── components/     # Reusable components
│   ├── routes/        # Page routes
│   ├── lib/           # Utility libraries
│   └── styles/        # Style files
├── public/            # Static assets
├── drizzle/          # Database related (optional)
├── docker/           # Docker configuration (optional)
├── .github/          # CI/CD workflow (optional)
└── package.json
```

## 🛠️ Development Commands

The generated project includes the following commands:

```bash
bun run dev        # Start development server
bun run build      # Build production version
bun run start      # Start production server
bun run test       # Run tests
bun run lint       # Code linting
```

## 📋 System Requirements

- **Node.js** >= 18.0.0
- **Bun** >= 1.0.0 (recommended) or **npm** >= 8.0.0

## 🏗️ Technical Architecture

### Why Choose Bun + Node.js Hybrid Architecture?

This scaffolding adopts a **Bun as package manager + Node.js as runtime** hybrid architecture for the following reasons:

#### ✅ Bun Advantages (Package Management)

- 🚀 **Ultra-fast Installation**: 10-20 times faster than npm/yarn
- 📦 **Great Compatibility**: Fully compatible with npm ecosystem
- 🔧 **Built-in Tools**: Integrated bundler, test runner, and package manager

#### ✅ Node.js Necessity (Runtime)

- 🏛️ **Official Support**: TanStack Start is officially designed based on Node.js
- 🔌 **API Compatibility**: Depends on Node.js-specific APIs and features
- 🛡️ **Stable and Reliable**: Best choice for production environment

> **Important Note**: According to [Bun official documentation](https://bun.sh/guides/ecosystem/solidstart), TanStack Start currently depends on some Node.js APIs that Bun has not yet implemented. Therefore, we use Bun to initialize projects and install dependencies, but use Node.js to run the development server.

### 🗄️ Database Integration (Drizzle ORM)

If you choose the database feature, the scaffolding will automatically configure [Drizzle ORM](https://bun.sh/guides/ecosystem/drizzle):

```bash
# Install Drizzle ORM (runtime)
bun add drizzle-orm

# Install Drizzle Kit (development tool)
bun add -D drizzle-kit
```

This leverages both Bun's fast installation advantages and ensures perfect compatibility with TanStack Start.

### 🔄 Complete Development Workflow

```bash
# 1. Use Bun for fast dependency installation
bun install

# 2. Use Node.js to run development server (via Vite)
bun run dev     # This actually runs vite dev (using Node.js)

# 3. Use Bun to add new dependencies
bun add some-package

# 4. Use Node.js to build production version
bun run build  # This actually runs vite build (using Node.js)
```

## 🔧 Configuration

The scaffolding automatically generates the following configuration files:

- `tailwind.config.mjs` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration
- `.env.example` - Environment variables template
- `drizzle.config.ts` - Database configuration (if selected)
- `package.json` - Uses standard Vite commands, compatible with Node.js runtime

## 💡 Best Practices

### 🚀 Recommended Development Workflow

1. **Use Bun for dependency management**:

   ```bash
   bun add package-name     # Add dependency
   bun remove package-name  # Remove dependency
   bun update              # Update all dependencies
   ```

2. **Use standard commands for development**:

   ```bash
   bun run dev    # Development server (uses Node.js + Vite underneath)
   bun run build  # Production build (uses Node.js + Vite underneath)
   ```

3. **Database development** (if database feature is selected):
   ```bash
   bun run db:generate  # Generate migration files
   bun run db:migrate   # Apply migrations
   bun run db:studio    # Open database management interface
   ```

### ❓ Frequently Asked Questions

**Q: Why not use Bun directly to run TanStack Start?**

A: TanStack Start depends on some Node.js APIs that Bun hasn't fully implemented yet. Following [Bun's official recommendation](https://bun.sh/guides/ecosystem/solidstart), we use Bun for dependency management (faster) and Node.js for running the application (more stable).

**Q: How to deploy in production environment?**

A: Production deployment is recommended with Node.js. The build command `bun run build` generates Node.js-compatible artifacts that can be deployed directly to any Node.js-supporting environment.

**Q: Can I use npm exclusively?**

A: Absolutely! All commands are compatible with npm:

```bash
npx @any-l/create-solid-app my-project
cd my-project
npm install
npm run dev
```

**Q: Why choose Node.js over Bun for Vite?**

A: Although Bun has its own bundler, Vite has better plugin support and stability in the SolidJS ecosystem. Our strategy is "use Bun for package management, use Vite for building", taking full advantage of both.

## 🤝 Contributing

Welcome to submit Issues and Pull Requests!

## 📄 License

MIT License

## 📝 Version History

### v3.4.0 (Latest) - TanStack Router Integration

- ✅ **New Templates**: Added TanStack Router bare and basic examples
- ✅ **Official Examples**: Direct integration from TanStack Router repository
- ✅ **Enhanced Templates**: start-bare for learning, start-basic for production
- ✅ **Smart Prompts**: Automatic feature detection for Router templates

### v3.0.0 - Major Update

- ✅ **Fixed Core Issues**: Redesigned based on TanStack Start official documentation
- ✅ **Bun + Node.js Architecture**: Best balance of performance and compatibility
- ✅ **Dependency Fixes**: Added missing `@tanstack/solid-router`
- ✅ **Configuration Optimization**: TypeScript and Vite configurations follow best practices
- ✅ **Routing Fixes**: Correct import paths and configuration

### v2.x - Deprecated

⚠️ v2.x versions have configuration issues, strongly recommend upgrading to v3.0.0

## 🔗 Related Links

- [📚 CHANGELOG.md](./CHANGELOG.md) - Detailed update log
- [🔄 MIGRATION-V3.md](./MIGRATION-V3.md) - v3.0.0 migration guide
- [🌐 TanStack Start Documentation](https://tanstack.com/start/latest/docs/framework/solid/build-from-scratch)
- [⚡ Bun Ecosystem Guide](https://bun.sh/guides/ecosystem/solidstart)

---

**🎉 Start building your next Solid application!**
