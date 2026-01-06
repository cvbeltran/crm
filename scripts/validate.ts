/**
 * Validation script - validates a newly created file and updates the checklist
 * 
 * Usage: npm run validate <file-path> [item-name]
 * Example: npm run validate lib/actions/accounts.ts "Server Action: accounts.ts"
 */

import { validateFile } from '../lib/validation/validator'
import { updateChecklist, formatForChecklist } from '../lib/validation/checklist-updater'
import { join } from 'path'

const filePath = process.argv[2]
const itemName = process.argv[3] || filePath

if (!filePath) {
  console.error('Usage: npm run validate <file-path> [item-name]')
  console.error('Example: npm run validate lib/actions/accounts.ts "Server Action: accounts.ts"')
  process.exit(1)
}

const fullPath = join(process.cwd(), filePath)
const checks = validateFile(fullPath)
const result = formatForChecklist(checks)

// Update checklist
updateChecklist(itemName, checks)

console.log(`\n✅ Validation complete for: ${itemName}`)
console.log(`📋 Checklist updated\n`)

const allPassed = checks.every(check => check.result.passed)

if (allPassed) {
  console.log('✅ All checks passed!')
  process.exit(0)
} else {
  console.log('❌ Validation failed. See checklist for details.')
  console.log('\n' + result)
  process.exit(1)
}

