#!/usr/bin/env node

/**
 * 模板测试套件
 * 为每个模板生成测试项目并验证其是否能正常工作
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { rimraf } from 'rimraf';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const testDir = path.resolve(rootDir, '.template-tests');

const TEMPLATES = ['minimal', 'landing', 'full-stack', 'admin'];

class TemplateTester {
  constructor() {
    this.testResults = [];
    this.timeout = 60000; // 60 seconds timeout
  }

  log(template, message, type = 'info') {
    const colors = {
      info: chalk.blue,
      success: chalk.green,
      warning: chalk.yellow,
      error: chalk.red
    };
    
    const timestamp = new Date().toLocaleTimeString();
    console.log(colors[type](`[${timestamp}] [${template}] ${message}`));
  }

  async setupTestEnvironment() {
    console.log(chalk.blue('🏗️  设置测试环境...'));
    
    try {
      // 清理旧的测试目录
      await rimraf(testDir);
      await fs.mkdir(testDir, { recursive: true });
      
      console.log(chalk.green('✅ 测试环境准备完成'));
      return true;
    } catch (error) {
      console.log(chalk.red(`❌ 测试环境设置失败: ${error.message}`));
      return false;
    }
  }

  async createTestProject(templateName) {
    const projectName = `test-${templateName}`;
    const projectPath = path.resolve(testDir, projectName);
    
    this.log(templateName, '🏗️  创建测试项目...');
    
    try {
      // 创建项目目录
      await fs.mkdir(projectPath, { recursive: true });
      
      // 复制模板文件
      const templatePath = path.resolve(rootDir, 'templates', templateName);
      await this.copyTemplate(templatePath, projectPath);
      
      this.log(templateName, '✅ 项目创建成功', 'success');
      return projectPath;
    } catch (error) {
      this.log(templateName, `❌ 项目创建失败: ${error.message}`, 'error');
      throw error;
    }
  }

  async copyTemplate(source, destination) {
    const entries = await fs.readdir(source, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.resolve(source, entry.name);
      const destPath = path.resolve(destination, entry.name);
      
      if (entry.isDirectory()) {
        await fs.mkdir(destPath, { recursive: true });
        await this.copyTemplate(srcPath, destPath);
      } else {
        // 处理特殊文件名（如 _gitignore）
        const finalDestPath = entry.name === '_gitignore' ? 
          path.resolve(destination, '.gitignore') : destPath;
        
        await fs.copyFile(srcPath, finalDestPath);
      }
    }
  }

  async installDependencies(projectPath, templateName) {
    this.log(templateName, '📦 安装依赖...');
    
    try {
      // 使用 npm 安装依赖（更可靠）
      const startTime = Date.now();
      
      execSync('npm install', {
        cwd: projectPath,
        stdio: 'pipe',
        timeout: this.timeout
      });
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      this.log(templateName, `✅ 依赖安装成功 (${duration}s)`, 'success');
      return true;
    } catch (error) {
      this.log(templateName, `❌ 依赖安装失败: ${error.message}`, 'error');
      return false;
    }
  }

  async checkTypeScript(projectPath, templateName) {
    this.log(templateName, '🔍 TypeScript 类型检查...');
    
    try {
      execSync('npx tsc --noEmit', {
        cwd: projectPath,
        stdio: 'pipe',
        timeout: 30000
      });
      
      this.log(templateName, '✅ TypeScript 类型检查通过', 'success');
      return true;
    } catch (error) {
      this.log(templateName, `❌ TypeScript 类型检查失败`, 'error');
      
      // 输出错误详情
      const errorOutput = error.stdout || error.stderr;
      if (errorOutput) {
        console.log(chalk.red(errorOutput.toString()));
      }
      
      return false;
    }
  }

  async checkBuild(projectPath, templateName) {
    this.log(templateName, '🏗️  构建检查...');
    
    try {
      const startTime = Date.now();
      
      execSync('npm run build', {
        cwd: projectPath,
        stdio: 'pipe',
        timeout: this.timeout
      });
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      this.log(templateName, `✅ 构建成功 (${duration}s)`, 'success');
      
      // 检查构建产物
      const distPath = path.resolve(projectPath, 'dist');
      const distExists = await fs.access(distPath).then(() => true).catch(() => false);
      
      if (distExists) {
        this.log(templateName, '✅ 构建产物生成正确', 'success');
        return true;
      } else {
        this.log(templateName, '⚠️  构建产物目录不存在', 'warning');
        return false;
      }
    } catch (error) {
      this.log(templateName, `❌ 构建失败: ${error.message}`, 'error');
      
      // 输出构建错误详情
      const errorOutput = error.stdout || error.stderr;
      if (errorOutput) {
        console.log(chalk.red(errorOutput.toString()));
      }
      
      return false;
    }
  }

  async checkPackageJsonStructure(projectPath, templateName) {
    this.log(templateName, '📋 package.json 结构检查...');
    
    try {
      const packagePath = path.resolve(projectPath, 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packagePath, 'utf-8'));
      
      const requiredScripts = ['start', 'dev', 'build', 'serve'];
      const missingScripts = requiredScripts.filter(script => !packageJson.scripts?.[script]);
      
      if (missingScripts.length > 0) {
        this.log(templateName, `❌ 缺少必要脚本: ${missingScripts.join(', ')}`, 'error');
        return false;
      }

      const requiredDeps = ['@tanstack/solid-router', '@tanstack/solid-start', 'solid-js'];
      const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies?.[dep]);
      
      if (missingDeps.length > 0) {
        this.log(templateName, `❌ 缺少核心依赖: ${missingDeps.join(', ')}`, 'error');
        return false;
      }

      this.log(templateName, '✅ package.json 结构正确', 'success');
      return true;
    } catch (error) {
      this.log(templateName, `❌ package.json 检查失败: ${error.message}`, 'error');
      return false;
    }
  }

  async testTemplate(templateName) {
    console.log(chalk.bold.blue(`\n🧪 测试模板: ${templateName}`));
    console.log(chalk.gray('=' * 50));
    
    const result = {
      template: templateName,
      success: false,
      tests: {
        projectCreation: false,
        dependencyInstall: false,
        packageStructure: false,
        typeCheck: false,
        build: false
      },
      duration: 0,
      error: null
    };

    const startTime = Date.now();

    try {
      // 1. 创建测试项目
      const projectPath = await this.createTestProject(templateName);
      result.tests.projectCreation = true;

      // 2. 检查 package.json 结构
      result.tests.packageStructure = await this.checkPackageJsonStructure(projectPath, templateName);

      // 3. 安装依赖
      result.tests.dependencyInstall = await this.installDependencies(projectPath, templateName);
      
      if (result.tests.dependencyInstall) {
        // 4. TypeScript 检查
        result.tests.typeCheck = await this.checkTypeScript(projectPath, templateName);

        // 5. 构建检查
        result.tests.build = await this.checkBuild(projectPath, templateName);
      }

      // 判断整体成功
      result.success = Object.values(result.tests).every(test => test === true);
      
    } catch (error) {
      result.error = error.message;
      this.log(templateName, `❌ 测试失败: ${error.message}`, 'error');
    }

    result.duration = Date.now() - startTime;
    this.testResults.push(result);

    if (result.success) {
      this.log(templateName, `🎉 所有测试通过! (${(result.duration / 1000).toFixed(1)}s)`, 'success');
    } else {
      this.log(templateName, `💥 部分测试失败`, 'error');
    }

    return result;
  }

  generateReport() {
    console.log(chalk.bold.blue('\n📊 测试报告'));
    console.log(chalk.gray('=' * 50));

    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.success).length;
    const totalDuration = this.testResults.reduce((sum, r) => sum + r.duration, 0);

    console.log(chalk.blue(`总测试数: ${totalTests}`));
    console.log(chalk.green(`通过: ${passedTests}`));
    console.log(chalk.red(`失败: ${totalTests - passedTests}`));
    console.log(chalk.gray(`总耗时: ${(totalDuration / 1000).toFixed(1)}s`));

    // 详细结果
    this.testResults.forEach(result => {
      console.log(chalk.bold(`\n${result.template}:`));
      
      Object.entries(result.tests).forEach(([testName, passed]) => {
        const icon = passed ? '✅' : '❌';
        const color = passed ? chalk.green : chalk.red;
        console.log(color(`  ${icon} ${testName}`));
      });

      if (result.error) {
        console.log(chalk.red(`  💥 错误: ${result.error}`));
      }
    });

    return passedTests === totalTests;
  }

  async cleanup() {
    console.log(chalk.blue('\n🧹 清理测试环境...'));
    
    try {
      await rimraf(testDir);
      console.log(chalk.green('✅ 清理完成'));
    } catch (error) {
      console.log(chalk.yellow(`⚠️  清理失败: ${error.message}`));
    }
  }

  async run(options = {}) {
    const { skipCleanup = false, templates = TEMPLATES } = options;
    
    console.log(chalk.bold.blue('🧪 模板测试套件'));
    console.log(chalk.gray('自动测试所有模板的可用性\n'));

    // 设置环境
    const envReady = await this.setupTestEnvironment();
    if (!envReady) {
      return false;
    }

    try {
      // 测试所有模板
      for (const template of templates) {
        await this.testTemplate(template);
      }

      // 生成报告
      const allPassed = this.generateReport();

      return allPassed;
    } finally {
      // 清理环境
      if (!skipCleanup) {
        await this.cleanup();
      }
    }
  }
}

// 命令行运行
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const skipCleanup = args.includes('--no-cleanup');
  const templatesArg = args.find(arg => arg.startsWith('--templates='));
  const templates = templatesArg ? 
    templatesArg.split('=')[1].split(',') : 
    TEMPLATES;

  const tester = new TemplateTester();
  tester.run({ skipCleanup, templates }).then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { TemplateTester };
