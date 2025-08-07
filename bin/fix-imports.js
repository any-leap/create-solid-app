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
 * Fix duplicate createFileRoute import issues
 */
async function fixDuplicateImports(projectPath) {
  console.log(`🔧 Fixing duplicate imports in project: ${projectPath}`)
  
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
      
      // 检查是否有重复的 createFileRoute import（同一个导入来自两个不同的包）
      const solidRouterImportMatch = content.match(/import\s*\{([^}]*createFileRoute[^}]*)\}\s*from\s*'@tanstack\/solid-router'/);
      const solidStartImportMatch = content.match(/import\s*\{([^}]*createFileRoute[^}]*)\}\s*from\s*'@tanstack\/solid-start'/);
      
      if (solidRouterImportMatch && solidStartImportMatch) {
        console.log(`  ❌ 发现重复 import: ${filePath.replace(projectPath, '.')}`)
        
        // 移除来自 solid-start 的 createFileRoute import
        content = content.replace(
          /import\s*\{[^}]*createFileRoute[^}]*\}\s*from\s*'@tanstack\/solid-start'\n?/g,
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
  
  console.log(`\n🎉 Fix completed! Fixed ${fixedCount} files`)
  return fixedCount
}

// If running script directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const projectPath = process.argv[2] || process.cwd()
  fixDuplicateImports(projectPath).catch(console.error)
}

export { fixDuplicateImports }