'use server'

import { createClient } from '@/lib/supabase/server'

export async function getDashboardMetrics() {
  const supabase = await createClient()

  // Get opportunity counts by state
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('state')

  const opportunityCounts = {
    lead: 0,
    qualified: 0,
    proposal: 0,
    closed_won: 0,
    closed_lost: 0,
    total: opportunities?.length || 0,
  }

  opportunities?.forEach((opp) => {
    if (opp.state in opportunityCounts) {
      opportunityCounts[opp.state as keyof typeof opportunityCounts]++
    }
  })

  // Get quote counts by state
  const { data: quotes } = await supabase.from('quotes').select('state')

  const quoteCounts = {
    draft: 0,
    pending_approval: 0,
    approved: 0,
    rejected: 0,
    total: quotes?.length || 0,
  }

  quotes?.forEach((quote) => {
    if (quote.state in quoteCounts) {
      quoteCounts[quote.state as keyof typeof quoteCounts]++
    }
  })

  // Get handover counts by state
  const { data: handovers } = await supabase
    .from('handovers')
    .select('state')

  const handoverCounts = {
    pending: 0,
    accepted: 0,
    flagged: 0,
    total: handovers?.length || 0,
  }

  handovers?.forEach((handover) => {
    if (handover.state in handoverCounts) {
      handoverCounts[handover.state as keyof typeof handoverCounts]++
    }
  })

  // Get recent activity (last 10 items)
  const recentActivity = []

  // Recent opportunities
  const { data: recentOpportunities } = await supabase
    .from('opportunities')
    .select('id, name, state, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  recentOpportunities?.forEach((opp) => {
    recentActivity.push({
      type: 'opportunity',
      id: opp.id,
      name: opp.name,
      state: opp.state,
      created_at: opp.created_at,
    })
  })

  // Recent quotes
  const { data: recentQuotes } = await supabase.from('quotes').select('id, quote_number, state, created_at').order('created_at', { ascending: false }).limit(5)

  recentQuotes?.forEach((quote) => {
    recentActivity.push({
      type: 'quote',
      id: quote.id,
      name: quote.quote_number,
      state: quote.state,
      created_at: quote.created_at,
    })
  })

  // Sort by created_at and take top 10
  recentActivity.sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
    return dateB - dateA
  })

  return {
    opportunities: opportunityCounts,
    quotes: quoteCounts,
    handovers: handoverCounts,
    recentActivity: recentActivity.slice(0, 10),
  }
}

