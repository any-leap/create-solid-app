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
  
  // Add feature selection conditionally based on template choice
  questions.push({
    type: (prev, answers) => {
      const selectedTemplate = answers.template || options.template
      const isRouterTemplate = selectedTemplate === 'start-bare' || selectedTemplate === 'start-basic'
      return isRouterTemplate ? null : 'multiselect'
    },
    name: 'features',
    message: 'Select required feature modules:',
    choices: getFeatureChoices(),
    hint: 'Use space to select/deselect, Enter to confirm'
  })
  
  questions.push(
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

  const response = await prompts(questions, { onCancel })
  
  // For Router templates, provide empty features array since they don't use feature modules
  const selectedTemplate = response.template || options.template
  const isRouterTemplate = selectedTemplate === 'start-bare' || selectedTemplate === 'start-basic'
  if (isRouterTemplate && !response.features) {
    response.features = []
  }
  
  return response
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