#!/usr/bin/env node

/**
 * 模板修复工具
 * 自动修复所有模板的一致性问题
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { 
  generatePackageJson, 
  baseTsConfig, 
  generateViteConfig,
  baseRouterTemplate 
} from '../bin/config/base-template.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const templatesDir = path.resolve(rootDir, 'templates');

const TEMPLATES = ['minimal', 'landing', 'full-stack', 'admin'];

class TemplateFixer {
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

  async fixPackageJson(templateName) {
    const packagePath = path.resolve(templatesDir, templateName, 'package.json');
    const expectedPackage = generatePackageJson(templateName);
    
    try {
      const currentPackage = JSON.parse(await fs.readFile(packagePath, 'utf-8'));
      
      // 保留现有的额外依赖，但确保核心配置正确
      const fixedPackage = {
        ...currentPackage,
        scripts: expectedPackage.scripts,
        dependencies: {
          ...expectedPackage.dependencies,
          // 保留模板特有的额外依赖
          ...this.getTemplateSpecificDependencies(templateName, currentPackage)
        },
        devDependencies: {
          ...expectedPackage.devDependencies,
          // 保留模板特有的开发依赖
          ...this.getTemplateSpecificDevDependencies(templateName, currentPackage)
        }
      };

      if (!this.dryRun) {
        await fs.writeFile(packagePath, JSON.stringify(fixedPackage, null, 2) + '\n');
      }
      
      this.log(templateName, '✅ package.json 已修复', 'success');
      this.fixes.push(`${templateName}: 修复 package.json`);
      
    } catch (error) {
      this.log(templateName, `❌ package.json 修复失败: ${error.message}`, 'error');
    }
  }

  getTemplateSpecificDependencies(templateName, currentPackage) {
    const allowedExtras = {
      'full-stack': [
        '@modular-forms/solid', '@tanstack/solid-query',
        'clsx', 'lucide-solid', 'redaxios', 'tailwind-merge', 'valibot'
      ],
      'admin': [
        '@modular-forms/solid', '@tanstack/solid-devtools',
        '@tanstack/solid-query', 'clsx', 'lucide-solid', 'redaxios', 
        'tailwind-merge', 'valibot'
      ]
    };

    const allowed = allowedExtras[templateName] || [];
    const extras = {};
    
    for (const dep of allowed) {
      if (currentPackage.dependencies?.[dep]) {
        extras[dep] = currentPackage.dependencies[dep];
      }
    }
    
    return extras;
  }

  getTemplateSpecificDevDependencies(templateName, currentPackage) {
    const allowedExtras = {
      'full-stack': ['vitest'],
      'admin': ['vitest', 'vite-bundle-analyzer']
    };

    const allowed = allowedExtras[templateName] || [];
    const extras = {};
    
    for (const dep of allowed) {
      if (currentPackage.devDependencies?.[dep]) {
        extras[dep] = currentPackage.devDependencies[dep];
      }
    }
    
    return extras;
  }

  async fixTsConfig(templateName) {
    const tsConfigPath = path.resolve(templatesDir, templateName, 'tsconfig.json');
    
    try {
      if (!this.dryRun) {
        await fs.writeFile(tsConfigPath, JSON.stringify(baseTsConfig, null, 2) + '\n');
      }
      
      this.log(templateName, '✅ tsconfig.json 已修复', 'success');
      this.fixes.push(`${templateName}: 修复 tsconfig.json`);
      
    } catch (error) {
      this.log(templateName, `❌ tsconfig.json 修复失败: ${error.message}`, 'error');
    }
  }

  async fixViteConfig(templateName) {
    const viteConfigPath = path.resolve(templatesDir, templateName, 'vite.config.ts');
    const expectedConfig = generateViteConfig(templateName);
    
    try {
      if (!this.dryRun) {
        await fs.writeFile(viteConfigPath, expectedConfig);
      }
      
      this.log(templateName, '✅ vite.config.ts 已修复', 'success');
      this.fixes.push(`${templateName}: 修复 vite.config.ts`);
      
    } catch (error) {
      this.log(templateName, `❌ vite.config.ts 修复失败: ${error.message}`, 'error');
    }
  }

  async fixRouter(templateName) {
    const routerPath = path.resolve(templatesDir, templateName, 'src', 'router.tsx');
    
    try {
      if (!this.dryRun) {
        await fs.writeFile(routerPath, baseRouterTemplate);
      }
      
      this.log(templateName, '✅ router.tsx 已修复', 'success');
      this.fixes.push(`${templateName}: 修复 router.tsx`);
      
    } catch (error) {
      this.log(templateName, `❌ router.tsx 修复失败: ${error.message}`, 'error');
    }
  }

  async fixTemplate(templateName) {
    console.log(chalk.blue(`\n🔧 修复模板: ${templateName}`));
    
    await this.fixPackageJson(templateName);
    await this.fixTsConfig(templateName);
    await this.fixViteConfig(templateName);
    await this.fixRouter(templateName);
  }

  async run(options = {}) {
    this.dryRun = options.dryRun || false;
    const { templates = TEMPLATES } = options;
    
    console.log(chalk.bold.blue('🔧 模板修复工具'));
    console.log(chalk.gray('自动修复所有模板的一致性问题\n'));
    
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
      console.log(chalk.green('✅ 所有模板都无需修复！'));
    } else {
      console.log(chalk.yellow(`🔧 完成了 ${this.fixes.length} 项修复:`));
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

  const fixer = new TemplateFixer();
  fixer.run({ dryRun, templates }).then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { TemplateFixer };
