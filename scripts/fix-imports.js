#!/usr/bin/env node

/**
 * 导入路径修复工具
 * 修复所有模板中错误的导入路径
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const templatesDir = path.resolve(rootDir, 'templates');

const TEMPLATES = ['minimal', 'landing', 'full-stack', 'admin'];

// 导入映射规则
const IMPORT_MAPPINGS = [
  // Router 相关的导入应该从 @tanstack/solid-router
  {
    from: `from '@tanstack/solid-start'`,
    to: `from '@tanstack/solid-router'`,
    includes: ['createFileRoute', 'Link', 'Outlet', 'useRouter', 'useNavigate', 'useMatch'],
    excludes: ['createServerFn', 'redirect', 'notFound', 'createApp', 'Await', 'ErrorComponent']
  },
  // 某些导入需要保持从 @tanstack/solid-start
  {
    from: `from '@tanstack/solid-router'`,
    to: `from '@tanstack/solid-start'`,
    includes: ['createServerFn', 'redirect', 'notFound', 'createApp', 'Await', 'ErrorComponent'],
    excludes: []
  }
];

class ImportFixer {
  constructor() {
    this.fixes = [];
    this.dryRun = false;
  }

  log(template, message, type = 'info') {
    const colors = {
      info: chalk.blue,
      success: chalk.green,
      warning: chalk.yellow,
      error: chalk.red
    };
    
    console.log(colors[type](`[${template}] ${message}`));
  }

  async fixFileImports(filePath, templateName) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      let newContent = content;
      let hasChanges = false;

      // 分析导入语句
      const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
      let match;
      const imports = [];

      while ((match = importRegex.exec(content)) !== null) {
        const importList = match[1].split(',').map(imp => imp.trim());
        const moduleName = match[2];
        imports.push({
          full: match[0],
          imports: importList,
          module: moduleName,
          start: match.index,
          end: match.index + match[0].length
        });
      }

      // 处理每个导入语句
      for (const imp of imports.reverse()) { // 从后往前处理，避免索引问题
        if (imp.module === '@tanstack/solid-start') {
          // 检查是否有需要移动到 @tanstack/solid-router 的导入
          const routerImports = imp.imports.filter(item => 
            ['createFileRoute', 'Link', 'Outlet', 'useRouter', 'useNavigate', 'useMatch', 'createRootRoute', 'HeadContent', 'Scripts'].includes(item)
          );
          
          const solidStartImports = imp.imports.filter(item => 
            !routerImports.includes(item)
          );

          if (routerImports.length > 0) {
            let replacement = '';
            
            // 如果有 router 导入，创建 router 导入语句
            if (routerImports.length > 0) {
              replacement += `import { ${routerImports.join(', ')} } from '@tanstack/solid-router'`;
            }
            
            // 如果还有其他 solid-start 导入，保留它们
            if (solidStartImports.length > 0) {
              if (replacement) replacement += '\n';
              replacement += `import { ${solidStartImports.join(', ')} } from '@tanstack/solid-start'`;
            }

            newContent = newContent.substring(0, imp.start) + replacement + newContent.substring(imp.end);
            hasChanges = true;
          }
        }
      }

      if (hasChanges) {
        if (!this.dryRun) {
          await fs.writeFile(filePath, newContent);
        }
        
        const relativePath = path.relative(templatesDir, filePath);
        this.log(templateName, `✅ 修复导入: ${relativePath}`, 'success');
        this.fixes.push(`${templateName}: ${relativePath}`);
      }

    } catch (error) {
      const relativePath = path.relative(templatesDir, filePath);
      this.log(templateName, `❌ 修复失败 ${relativePath}: ${error.message}`, 'error');
    }
  }

  async fixTemplate(templateName) {
    console.log(chalk.blue(`\n🔧 修复模板: ${templateName}`));
    
    const templatePath = path.resolve(templatesDir, templateName);
    
    // 递归查找所有 .tsx 和 .ts 文件
    const files = await this.findFiles(templatePath, ['.tsx', '.ts']);
    
    for (const file of files) {
      await this.fixFileImports(file, templateName);
    }
  }

  async findFiles(dir, extensions) {
    const files = [];
    
    async function walk(currentDir) {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.resolve(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (extensions.some(ext => entry.name.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    }
    
    await walk(dir);
    return files;
  }

  async run(options = {}) {
    this.dryRun = options.dryRun || false;
    const { templates = TEMPLATES } = options;
    
    console.log(chalk.bold.blue('🔧 导入路径修复工具'));
    console.log(chalk.gray('修复所有模板中错误的导入路径\n'));
    
    if (this.dryRun) {
      console.log(chalk.yellow('🔍 预览模式 - 不会实际修改文件\n'));
    }

    // 修复所有模板
    for (const template of templates) {
      await this.fixTemplate(template);
    }

    // 生成报告
    console.log(chalk.bold.blue('\n📊 修复报告'));
    
    if (this.fixes.length === 0) {
      console.log(chalk.green('✅ 所有导入路径都正确！'));
    } else {
      console.log(chalk.yellow(`🔧 修复了 ${this.fixes.length} 个文件:`));
      this.fixes.forEach(fix => console.log(chalk.gray(`  • ${fix}`)));
    }

    return true;
  }
}

// 命令行运行
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-d');
  const templatesArg = args.find(arg => arg.startsWith('--templates='));
  const templates = templatesArg ? 
    templatesArg.split('=')[1].split(',') : 
    TEMPLATES;

  const fixer = new ImportFixer();
  fixer.run({ dryRun, templates }).then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { ImportFixer };
