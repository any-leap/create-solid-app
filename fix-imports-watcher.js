#!/usr/bin/env node

/**
 * 监控文件变化并自动修复重复导入
 */

import fs from 'fs-extra'
import { join } from 'path'
import { watch } from 'chokidar'

function setupWatcher(projectPath = process.cwd()) {
  const routesPattern = join(projectPath, 'src/routes/**/*.{ts,tsx}')
  
  console.log(`👀 监控文件变化: ${routesPattern}`)
  
  const watcher = watch(routesPattern, {
    ignored: /(^|[\/\\])\../, // 忽略隐藏文件
    persistent: true
  })
  
  watcher.on('change', async (filePath) => {
    await fixFileImports(filePath)
  })
  
  watcher.on('add', async (filePath) => {
    await fixFileImports(filePath)
  })
  
  console.log('✅ 监控已启动，将自动修复重复的 import')
  console.log('按 Ctrl+C 停止监控')
}

async function fixFileImports(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf-8')
    const originalContent = content
    
    // 检查是否有重复的 createFileRoute import
    const hasWrongImport = content.includes("import { createFileRoute } from '@tanstack/solid-router'")
    const hasCorrectImport = content.includes("from '@tanstack/solid-start'")
    
    if (hasWrongImport && hasCorrectImport) {
      // 移除错误的导入
      content = content.replace(
        /import \{ createFileRoute \} from '@tanstack\/solid-router'\n?/g,
        ''
      )
      
      if (content !== originalContent) {
        await fs.writeFile(filePath, content)
        console.log(`🔧 自动修复: ${filePath}`)
      }
    }
  } catch (error) {
    console.error(`修复失败 ${filePath}:`, error.message)
  }
}

// 如果直接运行
if (import.meta.url === `file://${process.argv[1]}`) {
  setupWatcher(process.argv[2])
}

export { setupWatcher }