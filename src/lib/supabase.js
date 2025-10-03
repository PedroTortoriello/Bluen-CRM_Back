import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL 
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database initialization function
export const initializeDatabase = async () => {
  try {
    // Check if users table exists
    const { data: existingUsers } = await supabase
      .from('BluenSDR')
      .select('id')
      .limit(1)
    
    console.log('Database connection successful')
    return true
  } catch (error) {
    console.error('Database initialization error:', error)
    return false
  }
}

// Helper functions for common operations
export const leadOperations = {
  async getAll() {
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        companies (
          name,
          industry
        ),
        interactions (
          id,
          type,
          notes,
          createdAt
        )
      `)
      .order('createdAt', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        companies (*),
        interactions (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(leadData) {
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

export const dashboardOperations = {
  async getMetrics() {
    // Get total leads count
    const { count: totalLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact' })

    // Get leads by status
    const { data: leadsByStatus } = await supabase
      .from('leads')
      .select('status')

    // Get recent interactions
    const { data: recentInteractions } = await supabase
      .from('interactions')
      .select(`
        *,
        leads (name, email)
      `)
      .order('createdAt', { ascending: false })
      .limit(10)

    // Calculate status distribution
    const statusCounts = leadsByStatus?.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1
      return acc
    }, {}) || {}

    return {
      totalLeads: totalLeads || 0,
      statusCounts,
      recentInteractions: recentInteractions || []
    }
  }
}