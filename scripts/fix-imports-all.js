#!/usr/bin/env node

import { fixDuplicateImports } from '../fix-imports.js'
import fs from 'fs-extra'
import { join } from 'path'

/**
 * 为 create-solid-app 添加自动修复功能
 */
async function addFixToCreateApp() {
  console.log('🔧 为 create-solid-app 添加自动修复功能...')
  
  // 将修复脚本复制到 bin 目录
  const fixScript = await fs.readFile('../fix-imports.js', 'utf-8')
  await fs.writeFile('bin/fix-imports.js', fixScript)
  
  console.log('✅ 修复脚本已添加到 bin 目录')
}

// 如果直接运行脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  addFixToCreateApp().catch(console.error)
}

export { addFixToCreateApp }