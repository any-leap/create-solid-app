import { join } from 'path'
import fs from 'fs-extra'

/**
 * 数据库生成器 - 配置 Drizzle ORM + SQLite
 */
export class DatabaseGenerator {
  
  /**
   * 生成数据库配置文件和依赖
   */
  static async generate(projectPath) {
    // 创建数据库配置目录
    const dbDir = join(projectPath, 'src/lib/db')
    await fs.ensureDir(dbDir)

    // 创建 Drizzle 配置文件
    await this.generateDrizzleConfig(projectPath)
    
    // 创建数据库连接文件
    await this.generateDatabaseConnection(dbDir)
    
    // 创建 schema 文件
    await this.generateDatabaseSchema(dbDir)
    
    // 创建示例查询文件
    await this.generateExampleQueries(projectPath)
    
    // 创建迁移脚本
    await this.generateMigrationScripts(projectPath)
    
    // 创建数据库目录
    const dataDir = join(projectPath, 'data')
    await fs.ensureDir(dataDir)
    
    // 添加 .gitignore 条目
    await this.updateGitignore(projectPath)
  }

  /**
   * 生成 drizzle.config.ts
   */
  static async generateDrizzleConfig(projectPath) {
    const configPath = join(projectPath, 'drizzle.config.ts')
    
    const content = `import type { Config } from 'drizzle-kit'

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'better-sqlite3',
  dbCredentials: {
    url: './data/app.db'
  },
  verbose: true,
  strict: true
} satisfies Config`

    await fs.writeFile(configPath, content)
  }

  /**
   * 生成数据库连接文件
   */
  static async generateDatabaseConnection(dbDir) {
    const connectionPath = join(dbDir, 'index.ts')
    
    const content = `import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import * as schema from './schema'

// 创建 SQLite 数据库连接
const sqlite = new Database('./data/app.db')

// 创建 Drizzle 实例
export const db = drizzle(sqlite, { schema })

// 运行迁移
export async function runMigrations() {
  try {
    await migrate(db, { migrationsFolder: './drizzle' })
    console.log('✅ 数据库迁移完成')
  } catch (error) {
    console.error('❌ 数据库迁移失败:', error)
    throw error
  }
}

// 关闭数据库连接
export function closeDatabase() {
  sqlite.close()
}

// 导出类型
export type Database = typeof db
export * from './schema'`

    await fs.writeFile(connectionPath, content)
  }

  /**
   * 生成数据库 schema
   */
  static async generateDatabaseSchema(dbDir) {
    const schemaPath = join(dbDir, 'schema.ts')
    
    const content = `import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// 用户表
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
  updatedAt: text('updated_at').default(sql\`CURRENT_TIMESTAMP\`)
})

// 文章表 (示例)
export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: integer('author_id').references(() => users.id),
  published: integer('published', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
  updatedAt: text('updated_at').default(sql\`CURRENT_TIMESTAMP\`)
})

// 导出类型
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert`

    await fs.writeFile(schemaPath, content)
  }

  /**
   * 生成迁移相关脚本
   */
  static async generateMigrationScripts(projectPath) {
    // 在 package.json 的 scripts 中添加数据库相关命令会在 template-manager.js 中处理
    // 这里创建一个 migrations 目录的 README
    const migrationsDir = join(projectPath, 'drizzle')
    await fs.ensureDir(migrationsDir)
    
    const readmePath = join(migrationsDir, 'README.md')
    const content = `# 数据库迁移

这个目录包含由 Drizzle Kit 生成的数据库迁移文件。

## 常用命令

\`\`\`bash
# 生成迁移文件
bun run db:generate

# 应用迁移
bun run db:migrate

# 查看数据库
bun run db:studio

# 删除数据库 (开发环境)
bun run db:reset
\`\`\`

## 注意事项

- 不要手动编辑这些文件
- 确保在生产环境前备份数据库
- 迁移文件应该提交到版本控制中
`

    await fs.writeFile(readmePath, content)
  }

  /**
   * 更新 .gitignore
   */
  static async updateGitignore(projectPath) {
    const gitignorePath = join(projectPath, '.gitignore')
    
    // 检查是否已经存在 .gitignore
    let content = ''
    if (await fs.pathExists(gitignorePath)) {
      content = await fs.readFile(gitignorePath, 'utf-8')
    }

    // 添加数据库相关忽略项
    const dbIgnoreEntries = [
      '',
      '# Database',
      'data/*.db',
      'data/*.db-*',
      '*.sqlite',
      '*.sqlite3'
    ]

    // 检查是否已经包含数据库忽略项
    if (!content.includes('# Database')) {
      content += dbIgnoreEntries.join('\n') + '\n'
      await fs.writeFile(gitignorePath, content)
    }
  }

  /**
   * 生成示例查询文件
   */
  static async generateExampleQueries(projectPath) {
    const queriesDir = join(projectPath, 'src/lib/db/queries')
    await fs.ensureDir(queriesDir)
    
    // 用户查询示例
    const userQueriesPath = join(queriesDir, 'users.ts')
    const userQueriesContent = `import { eq } from 'drizzle-orm'
import { db, users, type NewUser } from '../'

// 获取所有用户
export async function getAllUsers() {
  return await db.select().from(users)
}

// 根据 ID 获取用户
export async function getUserById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id))
  return result[0]
}

// 根据邮箱获取用户
export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email))
  return result[0]
}

// 创建新用户
export async function createUser(userData: NewUser) {
  const result = await db.insert(users).values(userData).returning()
  return result[0]
}

// 更新用户
export async function updateUser(id: number, userData: Partial<NewUser>) {
  const result = await db.update(users)
    .set({ ...userData, updatedAt: new Date().toISOString() })
    .where(eq(users.id, id))
    .returning()
  return result[0]
}

// 删除用户
export async function deleteUser(id: number) {
  await db.delete(users).where(eq(users.id, id))
}`

    await fs.writeFile(userQueriesPath, userQueriesContent)

    // 文章查询示例
    const postQueriesPath = join(queriesDir, 'posts.ts')
    const postQueriesContent = `import { eq, desc } from 'drizzle-orm'
import { db, posts, users, type NewPost } from '../'

// 获取所有文章（包含作者信息）
export async function getAllPosts() {
  return await db.select({
    id: posts.id,
    title: posts.title,
    content: posts.content,
    published: posts.published,
    createdAt: posts.createdAt,
    author: {
      id: users.id,
      name: users.name,
      email: users.email
    }
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .orderBy(desc(posts.createdAt))
}

// 获取已发布的文章
export async function getPublishedPosts() {
  return await db.select({
    id: posts.id,
    title: posts.title,
    content: posts.content,
    createdAt: posts.createdAt,
    author: {
      id: users.id,
      name: users.name
    }
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .where(eq(posts.published, true))
  .orderBy(desc(posts.createdAt))
}

// 根据 ID 获取文章
export async function getPostById(id: number) {
  const result = await db.select({
    id: posts.id,
    title: posts.title,
    content: posts.content,
    published: posts.published,
    createdAt: posts.createdAt,
    author: {
      id: users.id,
      name: users.name,
      email: users.email
    }
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .where(eq(posts.id, id))
  
  return result[0]
}

// 创建新文章
export async function createPost(postData: NewPost) {
  const result = await db.insert(posts).values(postData).returning()
  return result[0]
}

// 更新文章
export async function updatePost(id: number, postData: Partial<NewPost>) {
  const result = await db.update(posts)
    .set({ ...postData, updatedAt: new Date().toISOString() })
    .where(eq(posts.id, id))
    .returning()
  return result[0]
}

// 发布文章
export async function publishPost(id: number) {
  const result = await db.update(posts)
    .set({ published: true, updatedAt: new Date().toISOString() })
    .where(eq(posts.id, id))
    .returning()
  return result[0]
}

// 删除文章
export async function deletePost(id: number) {
  await db.delete(posts).where(eq(posts.id, id))
}`

    await fs.writeFile(postQueriesPath, postQueriesContent)
  }
}
