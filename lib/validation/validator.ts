/**
 * Validation system for new creations
 * Validates files, components, pages, server actions, etc. against project requirements
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export type ValidationResult = {
  passed: boolean
  message?: string
  actions?: string[] // Actionable prompts for fixing issues
}

export type ValidationCheck = {
  name: string
  result: ValidationResult
}

/**
 * Validates a server action file
 */
export function validateServerAction(filePath: string): ValidationCheck[] {
  const checks: ValidationCheck[] = []
  
  if (!existsSync(filePath)) {
    return [{
      name: 'File exists',
      result: {
        passed: false,
        message: 'File does not exist',
        actions: [`Create the server action file at ${filePath}`]
      }
    }]
  }

  const content = readFileSync(filePath, 'utf-8')
  
  // Check for 'use server' directive
  checks.push({
    name: 'Server directive',
    result: content.includes("'use server'") || content.includes('"use server"')
      ? { passed: true }
      : {
          passed: false,
          message: 'Missing "use server" directive',
          actions: ['Add "use server" directive at the top of the file']
        }
  })

  // Check for role-based authorization
  const hasRoleCheck = content.includes('hasRole') || 
                       content.includes('hasAnyRole') || 
                       content.includes('getUserRole') ||
                       content.includes('getUserProfile')
  checks.push({
    name: 'Role-based authorization',
    result: hasRoleCheck
      ? { passed: true }
      : {
          passed: false,
          message: 'Missing role-based authorization checks',
          actions: [
            'Import auth helpers: import { hasRole, hasAnyRole, getUserRole } from "@/lib/auth"',
            'Add role checks before sensitive operations',
            'Ensure Operations role cannot access sensitive fields (cost, margin, discounts)'
          ]
        }
  })

  // Check for error handling
  const hasErrorHandling = content.includes('try') && content.includes('catch') ||
                          content.includes('error') ||
                          content.includes('Error')
  checks.push({
    name: 'Error handling',
    result: hasErrorHandling
      ? { passed: true }
      : {
          passed: false,
          message: 'Missing error handling',
          actions: [
            'Add try-catch blocks around database operations',
            'Return proper error messages to the client',
            'Handle Supabase errors gracefully'
          ]
        }
  })

  // Check for state transition validation (if applicable)
  if (filePath.includes('state-transitions') || 
      filePath.includes('opportunities') || 
      filePath.includes('quotes') || 
      filePath.includes('handovers')) {
    // Check if file imports from state-transitions (delegates validation)
    const delegatesToStateTransitions = content.includes('state-transitions') ||
                                        content.includes('updateQuoteState') ||
                                        content.includes('updateOpportunityState') ||
                                        content.includes('updateHandoverState') ||
                                        content.includes('validateQuoteTransition') ||
                                        content.includes('validateOpportunityTransition') ||
                                        content.includes('validateHandoverTransition')
    
    const hasTransitionValidation = delegatesToStateTransitions ||
                                    content.includes('isValidTransition') ||
                                    content.includes('OPPORTUNITY_TRANSITIONS') ||
                                    content.includes('QUOTE_TRANSITIONS') ||
                                    content.includes('HANDOVER_TRANSITIONS')
    checks.push({
      name: 'State transition validation',
      result: hasTransitionValidation
        ? { passed: true }
        : {
            passed: false,
            message: 'Missing state transition validation',
            actions: [
              'Import from state-transitions: import { updateQuoteState, updateOpportunityState, updateHandoverState } from "@/lib/actions/state-transitions"',
              'Or import transition helpers: import { isValidTransition, OPPORTUNITY_TRANSITIONS, QUOTE_TRANSITIONS, HANDOVER_TRANSITIONS } from "@/lib/types/workflows"',
              'Validate state transitions before updating records',
              'Prevent backward transitions after closure'
            ]
          }
    })
  }

  // Check for Operations visibility restrictions (for quotes)
  if (filePath.includes('quotes')) {
    const hasOperationsCheck = content.includes('quotes_for_operations') ||
                              content.includes('OPERATIONS') ||
                              (content.includes('operations') && content.includes('view'))
    checks.push({
      name: 'Operations visibility restrictions',
      result: hasOperationsCheck
        ? { passed: true }
        : {
            passed: false,
            message: 'Missing Operations visibility restrictions',
            actions: [
              'Check user role before querying quotes',
              'Use quotes_for_operations view for Operations role',
              'Ensure Operations cannot see: cost, margin, margin_percentage, discount_percentage',
              'Ensure Operations can see: deal value, scope, dates'
            ]
          }
    })
  }

  return checks
}

/**
 * Validates a page component
 */
export function validatePage(filePath: string): ValidationCheck[] {
  const checks: ValidationCheck[] = []
  
  if (!existsSync(filePath)) {
    return [{
      name: 'File exists',
      result: {
        passed: false,
        message: 'File does not exist',
        actions: [`Create the page file at ${filePath}`]
      }
    }]
  }

  const content = readFileSync(filePath, 'utf-8')
  
  // Check for 'use client' or server component patterns
  const isClientComponent = content.includes("'use client'") || content.includes('"use client"')
  const isServerComponent = content.includes('async') && content.includes('export default')
  
  checks.push({
    name: 'Component type',
    result: isClientComponent || isServerComponent
      ? { passed: true }
      : {
          passed: false,
          message: 'Unclear component type',
          actions: [
            'Add "use client" directive if using hooks/interactivity',
            'Or use async server component for data fetching'
          ]
        }
  })

  // Check for protected route (if not auth page)
  if (!filePath.includes('login') && !filePath.includes('signup')) {
    const hasAuthCheck = content.includes('getCurrentUser') ||
                        content.includes('getUserProfile') ||
                        content.includes('ProtectedRoute') ||
                        content.includes('redirect')
    checks.push({
      name: 'Protected route',
      result: hasAuthCheck
        ? { passed: true }
        : {
            passed: false,
            message: 'Missing authentication check',
            actions: [
              'Add authentication check using getCurrentUser() or getUserProfile()',
              'Redirect to login if user is not authenticated',
              'Or wrap page with ProtectedRoute component'
            ]
          }
    })
  }

  // Check for role-based UI (if applicable)
  if (filePath.includes('quotes') || filePath.includes('approvals') || filePath.includes('handovers')) {
    const hasRoleCheck = content.includes('hasRole') ||
                        content.includes('hasAnyRole') ||
                        content.includes('getUserRole') ||
                        content.includes('role')
    checks.push({
      name: 'Role-based UI',
      result: hasRoleCheck
        ? { passed: true }
        : {
            passed: false,
            message: 'Missing role-based UI logic',
            actions: [
              'Check user role to conditionally render UI elements',
              'Hide sensitive fields for Operations role (cost, margin, discounts)',
              'Show appropriate actions based on user role'
            ]
          }
    })
  }

  return checks
}

/**
 * Validates a component file
 */
export function validateComponent(filePath: string): ValidationCheck[] {
  const checks: ValidationCheck[] = []
  
  if (!existsSync(filePath)) {
    return [{
      name: 'File exists',
      result: {
        passed: false,
        message: 'File does not exist',
        actions: [`Create the component file at ${filePath}`]
      }
    }]
  }

  const content = readFileSync(filePath, 'utf-8')
  
  // Check for proper export
  const hasExport = content.includes('export') && 
                    (content.includes('function') || content.includes('const') || content.includes('export default'))
  checks.push({
    name: 'Component export',
    result: hasExport
      ? { passed: true }
      : {
          passed: false,
          message: 'Missing component export',
          actions: ['Export the component as default or named export']
        }
  })

  // Check for TypeScript types
  const hasTypes = content.includes(':') && 
                   (content.includes('Props') || content.includes('interface') || content.includes('type'))
  checks.push({
    name: 'TypeScript types',
    result: hasTypes
      ? { passed: true }
      : {
          passed: false,
          message: 'Missing TypeScript types',
          actions: [
            'Add TypeScript types for component props',
            'Define Props interface or type'
          ]
        }
  })

  return checks
}

/**
 * Validates a database migration
 */
export function validateMigration(filePath: string): ValidationCheck[] {
  const checks: ValidationCheck[] = []
  
  if (!existsSync(filePath)) {
    return [{
      name: 'File exists',
      result: {
        passed: false,
        message: 'File does not exist',
        actions: [`Create the migration file at ${filePath}`]
      }
    }]
  }

  const content = readFileSync(filePath, 'utf-8')
  
  // Check for RLS policies if creating tables
  if (content.includes('CREATE TABLE')) {
    const hasRLS = content.includes('ALTER TABLE') && content.includes('ENABLE ROW LEVEL SECURITY') ||
                   content.includes('RLS') ||
                   content.includes('row level security')
    checks.push({
      name: 'RLS policies',
      result: hasRLS
        ? { passed: true }
        : {
            passed: false,
            message: 'Missing RLS policies for new table',
            actions: [
              'Enable RLS: ALTER TABLE table_name ENABLE ROW LEVEL SECURITY',
              'Create policies for SELECT, INSERT, UPDATE, DELETE',
              'Use helper functions: get_user_role(), has_role(), has_any_role()',
              'Ensure role-based access control'
            ]
          }
    })
  }

  // Check for updated_at trigger
  if (content.includes('CREATE TABLE')) {
    const hasTrigger = content.includes('update_updated_at_column') ||
                      content.includes('CREATE TRIGGER') ||
                      content.includes('updated_at')
    checks.push({
      name: 'Updated_at trigger',
      result: hasTrigger
        ? { passed: true }
        : {
            passed: false,
            message: 'Missing updated_at trigger',
            actions: [
              'Add updated_at column to table',
              'Create trigger: CREATE TRIGGER update_table_name_updated_at BEFORE UPDATE ON table_name FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()'
            ]
          }
    })
  }

  return checks
}

/**
 * Main validation function - determines file type and validates accordingly
 */
export function validateFile(filePath: string): ValidationCheck[] {
  if (filePath.includes('lib/actions')) {
    return validateServerAction(filePath)
  } else if (filePath.includes('app/') && filePath.endsWith('page.tsx')) {
    return validatePage(filePath)
  } else if (filePath.includes('components/')) {
    return validateComponent(filePath)
  } else if (filePath.includes('supabase/') && filePath.includes('.sql')) {
    return validateMigration(filePath)
  }
  
  // Default: basic file existence check
  return [{
    name: 'File exists',
    result: existsSync(filePath)
      ? { passed: true }
      : {
          passed: false,
          message: 'File does not exist',
          actions: [`Create the file at ${filePath}`]
        }
  }]
}

/**
 * Formats validation results for checklist
 */
export function formatValidationResults(checks: ValidationCheck[]): string {
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
    return 'failed - No specific actions provided'
  }
  
  return `failed - Actions needed:\n${actions.map((action, i) => `${i + 1}. ${action}`).join('\n')}`
}

