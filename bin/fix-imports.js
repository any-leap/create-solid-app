import fs from 'fs-extra'
import { join } from 'path'

/**
 * 递归查找所有路由文件
 */
async function findRouteFiles(dir) {
  const files = []
  
  async function scan(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name)
      
      if (entry.isDirectory()) {
        await scan(fullPath)
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        files.push(fullPath)
      }
    }
  }
  
  await scan(dir)
  return files
}

/**
 * 修复重复的 createFileRoute import 问题
 */
async function fixDuplicateImports(projectPath) {
  console.log(`🔧 修复项目中的重复 import: ${projectPath}`)
  
  // 查找所有路由文件
  const routesDir = join(projectPath, 'src/routes')
  if (!await fs.pathExists(routesDir)) {
    console.log(`❌ 路由目录不存在: ${routesDir}`)
    return 0
  }
  
  const routeFiles = await findRouteFiles(routesDir)
  
  let fixedCount = 0
  
  for (const filePath of routeFiles) {
    try {
      let content = await fs.readFile(filePath, 'utf-8')
      const originalContent = content
      
      // 检查是否有重复的 createFileRoute import
      const hasWrongImport = content.includes("import { createFileRoute } from '@tanstack/solid-router'")
      const hasCorrectImport = content.includes("from '@tanstack/solid-start'")
      
      if (hasWrongImport && hasCorrectImport) {
        console.log(`  ❌ 发现重复 import: ${filePath.replace(projectPath, '.')}`)
        
        // 移除错误的 solid-router import 行
        content = content.replace(
          /import \{ createFileRoute \} from '@tanstack\/solid-router'\n?/g,
          ''
        )
        
        // 清理多余的空行
        content = content.replace(/\n\n\n+/g, '\n\n')
        
        if (content !== originalContent) {
          await fs.writeFile(filePath, content, 'utf-8')
          fixedCount++
          console.log(`  ✅ 已修复: ${filePath.replace(projectPath, '.')}`)
        }
      }
    } catch (error) {
      console.error(`  ❌ 修复失败: ${filePath}`, error.message)
    }
  }
  
  console.log(`\n🎉 修复完成！共修复了 ${fixedCount} 个文件`)
  return fixedCount
}

// 如果直接运行脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  const projectPath = process.argv[2] || process.cwd()
  fixDuplicateImports(projectPath).catch(console.error)
}

export { fixDuplicateImports }