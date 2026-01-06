/**
 * Checklist updater - updates docs/SETUP_CHECKLIST.md with validation results
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import type { ValidationCheck } from './validator'

export type ChecklistItem = {
  name: string
  status: 'passed' | 'failed' | 'pending'
  validation?: string // Validation result message
}

/**
 * Updates the checklist with validation results for a new creation
 */
export function updateChecklist(
  itemName: string,
  checks: ValidationCheck[],
  checklistPath: string = join(process.cwd(), 'docs', 'SETUP_CHECKLIST.md')
): void {
  const allPassed = checks.every(check => check.result.passed)
  const status = allPassed ? 'passed' : 'failed'
  
  let validationMessage: string
  if (allPassed) {
    validationMessage = 'passed'
  } else {
    const failedChecks = checks.filter(check => !check.result.passed)
    const actions: string[] = []
    
    failedChecks.forEach(check => {
      if (check.result.actions) {
        actions.push(...check.result.actions)
      }
    })
    
    if (actions.length > 0) {
      validationMessage = `failed - Actions needed:\n${actions.map((action, i) => `  ${i + 1}. ${action}`).join('\n')}`
    } else {
      validationMessage = `failed - ${failedChecks.map(c => c.result.message || c.name).join(', ')}`
    }
  }
  
  // Read current checklist
  let checklistContent = readFileSync(checklistPath, 'utf-8')
  
  // Find or create validation section
  const validationSection = '## 🔍 VALIDATION RESULTS\n\n'
  // Format validation message with proper indentation for multiline
  const formattedMessage = validationMessage.includes('\n')
    ? `\n${validationMessage.split('\n').map(line => `  ${line}`).join('\n')}`
    : validationMessage
  const validationEntry = `### ${itemName}\n- **Status**: ${status}\n- **Validation**: ${formattedMessage}\n\n`
  
  if (!checklistContent.includes(validationSection)) {
    // Add validation section before SUMMARY
    const summaryIndex = checklistContent.indexOf('## 📋 SUMMARY')
    if (summaryIndex !== -1) {
      checklistContent = 
        checklistContent.slice(0, summaryIndex) +
        validationSection +
        validationEntry +
        checklistContent.slice(summaryIndex)
    } else {
      // Append at the end
      checklistContent += '\n\n' + validationSection + validationEntry
    }
  } else {
    // Update existing entry or add new one
    // Escape special regex characters in itemName
    const escapedName = itemName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // Match from ### itemName to next ### or ## (section header), including multiple occurrences
    const itemPattern = new RegExp(`### ${escapedName}\\n[\\s\\S]*?(?=\\n### |\\n## |$)`, 'gm')
    
    // Remove all existing entries for this item
    checklistContent = checklistContent.replace(itemPattern, '')
    
    // Add new entry after validation section header
    const sectionIndex = checklistContent.indexOf(validationSection) + validationSection.length
    checklistContent = 
      checklistContent.slice(0, sectionIndex) +
      validationEntry +
      checklistContent.slice(sectionIndex)
  }
  
  // Write updated checklist
  writeFileSync(checklistPath, checklistContent, 'utf-8')
}

/**
 * Formats validation result for checklist entry
 */
export function formatForChecklist(checks: ValidationCheck[]): string {
  const allPassed = checks.every(check => check.result.passed)
  
  if (allPassed) {
    return 'passed'
  }
  
  const failedChecks = checks.filter(check => !check.result.passed)
  const actions: string[] = []
  
  failedChecks.forEach(check => {
    if (check.result.actions) {
      actions.push(...check.result.actions)
    }
  })
  
  if (actions.length === 0) {
    return `failed - ${failedChecks.map(c => c.result.message || c.name).join(', ')}`
  }
  
  return `failed - Actions needed:\n${actions.map((action, i) => `  ${i + 1}. ${action}`).join('\n')}`
}

