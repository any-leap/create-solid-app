import { join } from 'path'
import fs from 'fs-extra'

/**
 * Docker 配置生成器
 */
export class DockerGenerator {
  /**
   * 生成 Dockerfile
   */
  static generateDockerfile() {
    return `FROM oven/bun:1-alpine AS base
WORKDIR /app

# 安装依赖
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# 构建应用
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# 运行时
FROM base AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 solidjs

COPY --from=builder /app/.output ./.output
RUN chown -R solidjs:nodejs /app

USER solidjs
EXPOSE 3000
ENV PORT 3000

CMD ["bun", ".output/server/index.mjs"]`
  }

  /**
   * 生成 docker-compose.yml
   */
  static generateDockerCompose() {
    return `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  # 如果使用数据库，取消注释以下配置
  # db:
  #   image: postgres:15-alpine
  #   environment:
  #     POSTGRES_DB: myapp
  #     POSTGRES_USER: user
  #     POSTGRES_PASSWORD: password
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data
  #   ports:
  #     - "5432:5432"

# volumes:
#   postgres_data:`
  }

  /**
   * 生成所有 Docker 配置文件
   */
  static async generate(projectPath) {
    await fs.writeFile(join(projectPath, 'Dockerfile'), this.generateDockerfile())
    await fs.writeFile(join(projectPath, 'docker-compose.yml'), this.generateDockerCompose())
  }
}