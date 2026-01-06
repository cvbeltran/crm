/**
 * Validation system entry point
 * Use this to validate new creations and update the checklist
 */

import { validateFile, formatValidationResults } from './validator'
import { updateChecklist, formatForChecklist } from './checklist-updater'

/**
 * Validates a newly created file and updates the checklist
 * 
 * @param filePath - Path to the file to validate (relative to project root)
 * @param itemName - Name to display in checklist (e.g., "Server Action: accounts.ts")
 */
export function validateAndUpdateChecklist(filePath: string, itemName: string): void {
  const checks = validateFile(filePath)
  const result = formatForChecklist(checks)
  
  // Update checklist
  updateChecklist(itemName, checks)
  
  // Return result for immediate feedback
  return result as any
}

/**
 * Quick validation without updating checklist
 */
export function validate(filePath: string) {
  return validateFile(filePath)
}

export * from './validator'
export * from './checklist-updater'

