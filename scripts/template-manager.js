#!/usr/bin/env node

/**
 * 模板管理器
 * 统一管理所有模板相关操作的入口工具
 */

import { program } from 'commander';
import chalk from 'chalk';
import { ConsistencyChecker } from './template-consistency-checker.js';
import { VersionSyncer } from './sync-template-versions.js';
import { TemplateFixer } from './fix-templates.js';
import { TemplateTester } from './test-templates.js';

const TEMPLATES = ['minimal', 'landing', 'full-stack', 'admin'];

console.log(chalk.bold.blue('🛠️  Create Solid App - 模板管理器'));
console.log(chalk.gray('智能化的模板维护工具集\n'));

program
  .name('template-manager')
  .description('管理 Create Solid App 的所有模板')
  .version('3.0.0');

// 检查一致性
program
  .command('check')
  .alias('c')
  .description('检查所有模板的一致性')
  .option('--templates <templates>', '指定要检查的模板 (逗号分隔)', TEMPLATES.join(','))
  .action(async (options) => {
    const templates = options.templates.split(',');
    const checker = new ConsistencyChecker();
    const success = await checker.run({ templates });
    process.exit(success ? 0 : 1);
  });

// 同步版本
program
  .command('sync')
  .alias('s')
  .description('同步所有模板的依赖版本')
  .option('-d, --dry-run', '预览模式，不实际修改文件')
  .option('--templates <templates>', '指定要同步的模板 (逗号分隔)', TEMPLATES.join(','))
  .action(async (options) => {
    const templates = options.templates.split(',');
    const syncer = new VersionSyncer();
    const success = await syncer.run({ dryRun: options.dryRun, templates });
    process.exit(success ? 0 : 1);
  });

// 修复模板
program
  .command('fix')
  .alias('f')
  .description('自动修复模板的配置问题')
  .option('-d, --dry-run', '预览模式，不实际修改文件')
  .option('--templates <templates>', '指定要修复的模板 (逗号分隔)', TEMPLATES.join(','))
  .action(async (options) => {
    const templates = options.templates.split(',');
    const fixer = new TemplateFixer();
    const success = await fixer.run({ dryRun: options.dryRun, templates });
    process.exit(success ? 0 : 1);
  });

// 测试模板
program
  .command('test')
  .alias('t')
  .description('测试所有模板的可用性')
  .option('--no-cleanup', '保留测试文件不清理')
  .option('--templates <templates>', '指定要测试的模板 (逗号分隔)', TEMPLATES.join(','))
  .action(async (options) => {
    const templates = options.templates.split(',');
    const tester = new TemplateTester();
    const success = await tester.run({ 
      skipCleanup: !options.cleanup, 
      templates 
    });
    process.exit(success ? 0 : 1);
  });

// 完整流程
program
  .command('all')
  .alias('a')
  .description('执行完整的模板维护流程')
  .option('-d, --dry-run', '预览模式，不实际修改文件')
  .option('--skip-test', '跳过测试步骤')
  .option('--templates <templates>', '指定要处理的模板 (逗号分隔)', TEMPLATES.join(','))
  .action(async (options) => {
    const templates = options.templates.split(',');
    
    console.log(chalk.bold.yellow('🚀 开始完整的模板维护流程...\n'));
    
    try {
      // 1. 修复模板
      console.log(chalk.blue('📝 步骤 1: 修复模板配置'));
      const fixer = new TemplateFixer();
      await fixer.run({ dryRun: options.dryRun, templates });
      
      // 2. 同步版本
      console.log(chalk.blue('\n📦 步骤 2: 同步依赖版本'));
      const syncer = new VersionSyncer();
      await syncer.run({ dryRun: options.dryRun, templates });
      
      // 3. 检查一致性
      console.log(chalk.blue('\n🔍 步骤 3: 检查一致性'));
      const checker = new ConsistencyChecker();
      const checkSuccess = await checker.run({ templates });
      
      if (!checkSuccess && !options.dryRun) {
        console.log(chalk.red('\n❌ 一致性检查失败，请检查问题'));
        process.exit(1);
      }
      
      // 4. 测试模板 (可选)
      if (!options.skipTest && !options.dryRun) {
        console.log(chalk.blue('\n🧪 步骤 4: 测试模板'));
        const tester = new TemplateTester();
        const testSuccess = await tester.run({ templates });
        
        if (!testSuccess) {
          console.log(chalk.red('\n❌ 模板测试失败'));
          process.exit(1);
        }
      }
      
      console.log(chalk.bold.green('\n🎉 模板维护流程完成！'));
      console.log(chalk.gray('所有模板现在都符合最新标准并已通过测试。'));
      
    } catch (error) {
      console.log(chalk.red(`\n💥 流程执行失败: ${error.message}`));
      process.exit(1);
    }
  });

// 信息命令
program
  .command('info')
  .alias('i')
  .description('显示模板系统信息')
  .action(() => {
    console.log(chalk.bold.blue('📋 模板系统信息'));
    console.log(chalk.gray('=' * 40));
    console.log(chalk.yellow('可用模板:'));
    TEMPLATES.forEach(template => {
      console.log(chalk.gray(`  • ${template}`));
    });
    
    console.log(chalk.yellow('\n可用命令:'));
    console.log(chalk.gray('  • check  - 检查模板一致性'));
    console.log(chalk.gray('  • sync   - 同步依赖版本'));
    console.log(chalk.gray('  • fix    - 修复配置问题'));
    console.log(chalk.gray('  • test   - 测试模板可用性'));
    console.log(chalk.gray('  • all    - 执行完整维护流程'));
    
    console.log(chalk.yellow('\n基于配置:'));
    console.log(chalk.gray('  • 基准项目: ../tantest'));
    console.log(chalk.gray('  • 配置文件: bin/config/base-template.js'));
    console.log(chalk.gray('  • 脚本目录: scripts/'));
  });

program.parse();

// 如果没有提供命令，显示帮助
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
