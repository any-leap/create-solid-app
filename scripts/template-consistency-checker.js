#!/usr/bin/env node

/**
 * 模板一致性检查器
 * 验证所有模板是否遵循基准配置
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { 
  basePackageJson, 
  baseTsConfig, 
  generatePackageJson,
  templateExtensions 
} from '../bin/config/base-template.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const templatesDir = path.resolve(rootDir, 'templates');
const tanTestDir = path.resolve(rootDir, '..', 'tantest');

// 可用的模板列表
const TEMPLATES = ['minimal', 'landing', 'full-stack', 'admin'];

// 需要检查的核心依赖
const CORE_DEPENDENCIES = [
  '@tanstack/solid-router',
  '@tanstack/solid-start', 
  'solid-js'
];

const CORE_DEV_DEPENDENCIES = [
  '@tailwindcss/vite',
  'tailwindcss',
  'typescript',
  'vite',
  'vite-plugin-solid',
  'vite-tsconfig-paths'
];

class ConsistencyChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.successes = [];
  }

  log(type, template, message) {
    const entry = { template, message };
    switch (type) {
      case 'error':
        this.errors.push(entry);
        console.log(chalk.red(`❌ [${template}] ${message}`));
        break;
      case 'warning':
        this.warnings.push(entry);
        console.log(chalk.yellow(`⚠️  [${template}] ${message}`));
        break;
      case 'success':
        this.successes.push(entry);
        console.log(chalk.green(`✅ [${template}] ${message}`));
        break;
    }
  }

  async checkTanTestReference() {
    console.log(chalk.blue('\n🔍 检查 tantest 基准项目...'));
    
    try {
      const tanTestPackage = JSON.parse(
        await fs.readFile(path.resolve(tanTestDir, 'package.json'), 'utf-8')
      );
      
      const tanTestTsConfig = JSON.parse(
        await fs.readFile(path.resolve(tanTestDir, 'tsconfig.json'), 'utf-8')
      );

      // 验证 tantest 是否包含必要的依赖
      const missingDeps = CORE_DEPENDENCIES.filter(dep => !tanTestPackage.dependencies?.[dep]);
      if (missingDeps.length > 0) {
        this.log('error', 'tantest', `缺少核心依赖: ${missingDeps.join(', ')}`);
        return false;
      }

      // 验证 tsconfig 配置
      if (tanTestTsConfig.compilerOptions?.moduleResolution !== 'bundler') {
        this.log('error', 'tantest', 'tsconfig.json moduleResolution 应该是 "bundler"');
        return false;
      }

      this.log('success', 'tantest', '基准项目配置正确');
      return true;
    } catch (error) {
      this.log('error', 'tantest', `无法读取基准项目: ${error.message}`);
      return false;
    }
  }

  async checkTemplatePackageJson(templateName) {
    const templatePath = path.resolve(templatesDir, templateName, 'package.json');
    const expectedPackage = generatePackageJson(templateName);
    
    try {
      const actualPackage = JSON.parse(await fs.readFile(templatePath, 'utf-8'));
      
      // 检查核心依赖版本
      for (const dep of CORE_DEPENDENCIES) {
        const expectedVersion = expectedPackage.dependencies[dep];
        const actualVersion = actualPackage.dependencies?.[dep];
        
        if (!actualVersion) {
          this.log('error', templateName, `缺少核心依赖: ${dep}`);
        } else if (actualVersion !== expectedVersion) {
          this.log('warning', templateName, `${dep} 版本不匹配: 期望 ${expectedVersion}, 实际 ${actualVersion}`);
        } else {
          this.log('success', templateName, `${dep} 版本正确`);
        }
      }

      // 检查开发依赖版本
      for (const dep of CORE_DEV_DEPENDENCIES) {
        const expectedVersion = expectedPackage.devDependencies[dep];
        const actualVersion = actualPackage.devDependencies?.[dep];
        
        if (!actualVersion) {
          this.log('error', templateName, `缺少开发依赖: ${dep}`);
        } else if (actualVersion !== expectedVersion) {
          this.log('warning', templateName, `${dep} 版本不匹配: 期望 ${expectedVersion}, 实际 ${actualVersion}`);
        }
      }

      // 检查脚本命令
      const expectedScripts = expectedPackage.scripts;
      for (const [script, command] of Object.entries(expectedScripts)) {
        if (actualPackage.scripts?.[script] !== command) {
          this.log('warning', templateName, `脚本 "${script}" 不匹配: 期望 "${command}", 实际 "${actualPackage.scripts?.[script] || '未定义'}"`);
        }
      }

    } catch (error) {
      this.log('error', templateName, `无法读取 package.json: ${error.message}`);
    }
  }

  async checkTemplateTsConfig(templateName) {
    const templatePath = path.resolve(templatesDir, templateName, 'tsconfig.json');
    
    try {
      const actualTsConfig = JSON.parse(await fs.readFile(templatePath, 'utf-8'));
      
      // 检查关键配置项
      const keyConfigs = [
        ['compilerOptions.moduleResolution', 'bundler'],
        ['compilerOptions.jsx', 'preserve'],
        ['compilerOptions.jsxImportSource', 'solid-js'],
        ['compilerOptions.target', 'ES2022'],
        ['compilerOptions.module', 'ESNext']
      ];

      for (const [configPath, expectedValue] of keyConfigs) {
        const keys = configPath.split('.');
        let actualValue = actualTsConfig;
        
        for (const key of keys) {
          actualValue = actualValue?.[key];
        }

        if (actualValue !== expectedValue) {
          this.log('warning', templateName, `tsconfig ${configPath} 不匹配: 期望 "${expectedValue}", 实际 "${actualValue}"`);
        } else {
          this.log('success', templateName, `tsconfig ${configPath} 正确`);
        }
      }

      // 检查是否过于复杂
      const compilerOptions = actualTsConfig.compilerOptions || {};
      const optionCount = Object.keys(compilerOptions).length;
      
      if (optionCount > 15) {
        this.log('warning', templateName, `tsconfig.json 配置过于复杂 (${optionCount} 个选项)，建议简化`);
      }

    } catch (error) {
      this.log('error', templateName, `无法读取 tsconfig.json: ${error.message}`);
    }
  }

  async checkTemplateRouter(templateName) {
    const routerPath = path.resolve(templatesDir, templateName, 'src', 'router.tsx');
    
    try {
      const routerContent = await fs.readFile(routerPath, 'utf-8');
      
      // 检查导入语句
      if (routerContent.includes("from '@tanstack/solid-start'")) {
        this.log('error', templateName, 'router.tsx 错误导入自 @tanstack/solid-start，应该是 @tanstack/solid-router');
      } else if (routerContent.includes("from '@tanstack/solid-router'")) {
        this.log('success', templateName, 'router.tsx 导入正确');
      } else {
        this.log('warning', templateName, 'router.tsx 导入语句检测异常');
      }

      // 检查路由器配置
      if (routerContent.includes('scrollRestoration: true')) {
        this.log('success', templateName, 'router.tsx 包含 scrollRestoration 配置');
      } else {
        this.log('warning', templateName, 'router.tsx 缺少 scrollRestoration 配置');
      }

    } catch (error) {
      this.log('error', templateName, `无法读取 router.tsx: ${error.message}`);
    }
  }

  async checkViteConfig(templateName) {
    const viteConfigPath = path.resolve(templatesDir, templateName, 'vite.config.ts');
    
    try {
      const viteContent = await fs.readFile(viteConfigPath, 'utf-8');
      
      // 检查插件顺序（重要！）
      const pluginOrder = [
        'tsConfigPaths()',
        'tanstackStart(',
        'viteSolid(',
        'tailwindcss()'
      ];

      let lastIndex = -1;
      for (const plugin of pluginOrder) {
        const index = viteContent.indexOf(plugin);
        if (index === -1) {
          this.log('error', templateName, `vite.config.ts 缺少插件: ${plugin}`);
        } else if (index < lastIndex) {
          this.log('error', templateName, `vite.config.ts 插件顺序错误，${plugin} 应该在更后面`);
        } else {
          lastIndex = index;
        }
      }

      if (lastIndex !== -1) {
        this.log('success', templateName, 'vite.config.ts 插件顺序正确');
      }

      // 检查端口配置
      if (viteContent.includes('port: 3000')) {
        this.log('success', templateName, 'vite.config.ts 端口配置正确');
      } else {
        this.log('warning', templateName, 'vite.config.ts 端口配置可能不标准');
      }

    } catch (error) {
      this.log('error', templateName, `无法读取 vite.config.ts: ${error.message}`);
    }
  }

  async checkTemplate(templateName) {
    console.log(chalk.blue(`\n🔍 检查模板: ${templateName}`));
    
    await this.checkTemplatePackageJson(templateName);
    await this.checkTemplateTsConfig(templateName);
    await this.checkTemplateRouter(templateName);
    await this.checkViteConfig(templateName);
  }

  async run() {
    console.log(chalk.bold.blue('🚀 模板一致性检查器'));
    console.log(chalk.gray('检查所有模板是否遵循 tantest 基准配置\n'));

    // 检查基准项目
    const tanTestValid = await this.checkTanTestReference();
    if (!tanTestValid) {
      console.log(chalk.red('\n❌ 基准项目配置有问题，请先修复 tantest 项目'));
      return false;
    }

    // 检查所有模板
    for (const template of TEMPLATES) {
      await this.checkTemplate(template);
    }

    // 生成报告
    console.log(chalk.bold.blue('\n📊 检查报告'));
    console.log(chalk.green(`✅ 成功: ${this.successes.length}`));
    console.log(chalk.yellow(`⚠️  警告: ${this.warnings.length}`));
    console.log(chalk.red(`❌ 错误: ${this.errors.length}`));

    if (this.errors.length === 0) {
      console.log(chalk.bold.green('\n🎉 所有模板配置正确！'));
      return true;
    } else {
      console.log(chalk.bold.red('\n🔧 需要修复的问题:'));
      this.errors.forEach(error => {
        console.log(chalk.red(`  • [${error.template}] ${error.message}`));
      });
      return false;
    }
  }
}

// 如果直接运行此脚本
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const checker = new ConsistencyChecker();
  checker.run().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { ConsistencyChecker };
