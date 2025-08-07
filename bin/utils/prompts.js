import prompts from 'prompts'
import { getTemplateChoices } from '../config/templates.js'
import { getFeatureChoices } from '../config/features.js'
import { logger } from './logger.js'

/**
 * Handle user cancellation
 */
function onCancel() {
  logger.warn('Operation cancelled')
  process.exit(1)
}

/**
 * Get interactive prompts for project configuration
 */
export async function getProjectPrompts(options = {}) {
  const questions = []
  
  // Only ask for template selection when not specified via command line
  if (!options.template) {
    questions.push({
      type: 'select',
      name: 'template',
      message: 'Choose project template:',
      choices: getTemplateChoices(),
      initial: 1 // Default to full-stack
    })
  }
  
  questions.push(
    {
      type: 'multiselect',
      name: 'features',
      message: 'Select required feature modules:',
      choices: getFeatureChoices(),
      hint: 'Use space to select/deselect, Enter to confirm'
    },
    {
      type: 'text',
      name: 'description',
      message: 'Project description:',
      initial: 'Modern Web application based on TanStack Solid Start'
    },
    {
      type: 'text',
      name: 'author',
      message: 'Author:',
      initial: ''
    },
    {
      type: 'confirm',
      name: 'git',
      message: 'Initialize Git repository?',
      initial: true
    },
    {
      type: 'confirm',
      name: 'install',
      message: 'Install dependencies immediately?',
      initial: true
    }
  )

  return await prompts(questions, { onCancel })
}

/**
 * Get interactive prompt for project name
 */
export async function getProjectNamePrompt(validate) {
  const response = await prompts({
    type: 'text',
    name: 'projectName',
    message: 'Project name:',
    validate
  }, { onCancel })
  
  return response.projectName
}