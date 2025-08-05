import { join } from 'path'
import fs from 'fs-extra'

/**
 * GitHub Actions CI/CD 配置生成器
 */
export class GitHubActionsGenerator {
  /**
   * 生成 CI/CD workflow
   */
  static generateWorkflow() {
    return `name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - uses: oven-sh/setup-bun@v1
      with:
        bun-version: latest
    
    - name: Install dependencies
      run: bun install --frozen-lockfile
    
    - name: Run tests
      run: bun run test
    
    - name: Build project
      run: bun run build
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to production
      run: echo "部署到生产环境"`
  }

  /**
   * 生成 GitHub Actions 配置
   */
  static async generate(projectPath) {
    await fs.ensureDir(join(projectPath, '.github', 'workflows'))
    await fs.writeFile(
      join(projectPath, '.github', 'workflows', 'ci.yml'), 
      this.generateWorkflow()
    )
  }
}