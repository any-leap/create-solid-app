#!/usr/bin/env node

/**
 * 模板版本同步器
 * 自动同步所有模板的核心依赖版本，确保一致性
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { generatePackageJson } from '../bin/config/base-template.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const templatesDir = path.resolve(rootDir, 'templates');
const tanTestDir = path.resolve(rootDir, '..', 'tantest');

const TEMPLATES = ['minimal', 'landing', 'full-stack', 'admin'];

class VersionSyncer {
  constructor() {
    this.changes = [];
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

  async getLatestVersions() {
    console.log(chalk.blue('🔍 获取最新版本信息...'));
    
    try {
      // 从 tantest 获取基准版本
      const tanTestPackage = JSON.parse(
        await fs.readFile(path.resolve(tanTestDir, 'package.json'), 'utf-8')
      );

      const baseVersions = {
        dependencies: tanTestPackage.dependencies || {},
        devDependencies: tanTestPackage.devDependencies || {}
      };

      console.log(chalk.green('✅ 成功获取基准版本'));
      return baseVersions;
    } catch (error) {
      console.log(chalk.red(`❌ 无法获取基准版本: ${error.message}`));
      throw error;
    }
  }

  async updateTemplatePackageJson(templateName, latestVersions) {
    const packagePath = path.resolve(templatesDir, templateName, 'package.json');
    
    try {
      const currentPackage = JSON.parse(await fs.readFile(packagePath, 'utf-8'));
      const expectedPackage = generatePackageJson(templateName);
      
      let hasChanges = false;
      const changes = [];

      // 创建新的 package.json
      const newPackage = {
        ...currentPackage,
        scripts: expectedPackage.scripts,
        dependencies: { ...currentPackage.dependencies },
        devDependencies: { ...currentPackage.devDependencies }
      };

      // 更新依赖版本
      for (const [dep, expectedVersion] of Object.entries(expectedPackage.dependencies)) {
        const currentVersion = currentPackage.dependencies?.[dep];
        if (currentVersion !== expectedVersion) {
          newPackage.dependencies[dep] = expectedVersion;
          changes.push(`依赖 ${dep}: ${currentVersion || '未安装'} → ${expectedVersion}`);
          hasChanges = true;
        }
      }

      // 更新开发依赖版本
      for (const [dep, expectedVersion] of Object.entries(expectedPackage.devDependencies)) {
        const currentVersion = currentPackage.devDependencies?.[dep];
        if (currentVersion !== expectedVersion) {
          newPackage.devDependencies[dep] = expectedVersion;
          changes.push(`开发依赖 ${dep}: ${currentVersion || '未安装'} → ${expectedVersion}`);
          hasChanges = true;
        }
      }

      // 移除不应该存在的旧依赖（如果在基础配置中没有定义）
      const unnecessaryDeps = [];
      
      // 检查是否有不需要的依赖
      for (const dep of Object.keys(currentPackage.dependencies || {})) {
        if (!expectedPackage.dependencies[dep] && !this.isAllowedExtraDependency(templateName, dep)) {
          unnecessaryDeps.push(dep);
        }
      }

      if (unnecessaryDeps.length > 0) {
        this.log(templateName, `发现可能不需要的依赖: ${unnecessaryDeps.join(', ')}`, 'warning');
      }

      if (hasChanges) {
        this.changes.push({ template: templateName, changes });
        
        if (!this.dryRun) {
          await fs.writeFile(packagePath, JSON.stringify(newPackage, null, 2) + '\n');
          this.log(templateName, `✅ 更新了 package.json`, 'success');
          changes.forEach(change => this.log(templateName, `  • ${change}`, 'info'));
        } else {
          this.log(templateName, `📋 将要更新 package.json:`, 'warning');
          changes.forEach(change => this.log(templateName, `  • ${change}`, 'info'));
        }
      } else {
        this.log(templateName, `✅ package.json 已是最新`, 'success');
      }

    } catch (error) {
      this.log(templateName, `❌ 更新失败: ${error.message}`, 'error');
    }
  }

  isAllowedExtraDependency(templateName, dependency) {
    // 某些模板允许有额外的依赖
    const allowedExtras = {
      'full-stack': [
        '@kobalte/core', '@modular-forms/solid', '@tanstack/solid-query',
        'clsx', 'lucide-solid', 'redaxios', 'tailwind-merge', 'valibot'
      ],
      'admin': [
        '@kobalte/core', '@modular-forms/solid', '@tanstack/solid-devtools',
        '@tanstack/solid-query', 'clsx', 'lucide-solid', 'redaxios', 
        'tailwind-merge', 'valibot'
      ]
    };

    return allowedExtras[templateName]?.includes(dependency) || false;
  }

  async syncAllTemplates() {
    console.log(chalk.bold.blue('🔄 模板版本同步器'));
    console.log(chalk.gray('将所有模板同步到最新的基准配置\n'));

    try {
      const latestVersions = await this.getLatestVersions();

      for (const template of TEMPLATES) {
        console.log(chalk.blue(`\n🔄 同步模板: ${template}`));
        await this.updateTemplatePackageJson(template, latestVersions);
      }

      // 生成报告
      console.log(chalk.bold.blue('\n📊 同步报告'));
      
      if (this.changes.length === 0) {
        console.log(chalk.green('✅ 所有模板都已是最新版本！'));
      } else {
        console.log(chalk.yellow(`📝 更新了 ${this.changes.length} 个模板:`));
        this.changes.forEach(({ template, changes }) => {
          console.log(chalk.yellow(`\n  ${template}:`));
          changes.forEach(change => console.log(chalk.gray(`    • ${change}`)));
        });
      }

      return true;
    } catch (error) {
      console.log(chalk.red(`\n❌ 同步失败: ${error.message}`));
      return false;
    }
  }

  async run(options = {}) {
    this.dryRun = options.dryRun || false;
    
    if (this.dryRun) {
      console.log(chalk.yellow('🔍 预览模式 - 不会实际修改文件\n'));
    }

    return await this.syncAllTemplates();
  }
}

// 命令行参数处理
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-d');
  
  const syncer = new VersionSyncer();
  syncer.run({ dryRun }).then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { VersionSyncer };
