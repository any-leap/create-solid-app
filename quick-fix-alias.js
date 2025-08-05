#!/usr/bin/env node

/**
 * 快速修复脚本 - 可以直接在任何项目中运行
 */

import fs from 'fs-extra'
import { join } from 'path'

async function quickFix(projectPath = process.cwd()) {
  console.log(`🔧 快速修复 ${projectPath} 中的重复 import...`)
  
  // 确保使用绝对路径
  const absolutePath = join(process.cwd(), projectPath)
  const routesDir = join(absolutePath, 'src/routes')
  
  if (!await fs.pathExists(routesDir)) {
    console.log(`❌ 未找到 src/routes 目录: ${routesDir}`)
    return
  }
  
  const files = await findTsxFiles(routesDir)
  let fixedCount = 0
  
  for (const file of files) {
    let content = await fs.readFile(file, 'utf-8')
    const originalContent = content
    
    // 移除错误的 solid-router import
    content = content.replace(
      /import \{ createFileRoute \} from '@tanstack\/solid-router'\n?/g,
      ''
    )
    
    if (content !== originalContent) {
      await fs.writeFile(file, content)
      fixedCount++
      console.log(`  ✅ 修复: ${file.replace(absolutePath, '.')}`)
    }
  }
  
  console.log(`🎉 完成！修复了 ${fixedCount} 个文件`)
}

async function findTsxFiles(dir) {
  const files = []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await findTsxFiles(fullPath))
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      files.push(fullPath)
    }
  }
  
  return files
}

// 运行脚本
quickFix().catch(console.error)