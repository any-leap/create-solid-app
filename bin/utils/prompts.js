import prompts from 'prompts'
import { getTemplateChoices } from '../config/templates.js'
import { getFeatureChoices } from '../config/features.js'
import { logger } from './logger.js'

/**
 * 处理用户取消操作
 */
function onCancel() {
  logger.warn('操作已取消')
  process.exit(1)
}

/**
 * 获取项目配置的交互式提示
 */
export async function getProjectPrompts(options = {}) {
  const questions = []
  
  // 只有在命令行未指定模板时才询问模板选择
  if (!options.template) {
    questions.push({
      type: 'select',
      name: 'template',
      message: '选择项目模板:',
      choices: getTemplateChoices(),
      initial: 1 // 默认选择 full-stack
    })
  }
  
  questions.push(
    {
      type: 'multiselect',
      name: 'features',
      message: '选择需要的功能模块:',
      choices: getFeatureChoices(),
      hint: '使用空格选择/取消，回车确认'
    },
    {
      type: 'text',
      name: 'description',
      message: '项目描述:',
      initial: '基于 TanStack Solid Start 的现代化 Web 应用'
    },
    {
      type: 'text',
      name: 'author',
      message: '作者:',
      initial: ''
    },
    {
      type: 'confirm',
      name: 'git',
      message: '初始化 Git 仓库?',
      initial: true
    },
    {
      type: 'confirm',
      name: 'install',
      message: '立即安装依赖?',
      initial: true
    }
  )

  return await prompts(questions, { onCancel })
}

/**
 * 获取项目名称的交互式提示
 */
export async function getProjectNamePrompt(validate) {
  const response = await prompts({
    type: 'text',
    name: 'projectName',
    message: '项目名称:',
    validate
  }, { onCancel })
  
  return response.projectName
}