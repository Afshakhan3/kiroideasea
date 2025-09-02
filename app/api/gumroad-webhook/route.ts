import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verify webhook (optional - add your Gumroad webhook secret verification here)
    const webhookSecret = process.env.GUMROAD_WEBHOOK_SECRET
    if (webhookSecret) {
      // Add webhook verification logic here if needed
    }

    // Extract purchase data
    const {
      purchaser_email,
      product_name,
      sale_id,
      sale_timestamp,
      price,
    } = body

    if (!purchaser_email || !product_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Find user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', purchaser_email)
      .single()

    if (userError || !user) {
      console.error('User not found:', purchaser_email)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Determine plan type based on product name
    let planType: string
    let expiryDate: string | null = null

    if (product_name.toLowerCase().includes('single') || price === '1.00') {
      planType = 'single'
    } else if (product_name.toLowerCase().includes('unlimited') || product_name.toLowerCase().includes('giver')) {
      planType = 'unlimited'
      // Set expiry date to 5 years from now
      const expiry = new Date()
      expiry.setFullYear(expiry.getFullYear() + 5)
      expiryDate = expiry.toISOString()
    } else if (product_name.toLowerCase().includes('investor')) {
      planType = 'investor'
      // Set expiry date to 5 years from now
      const expiry = new Date()
      expiry.setFullYear(expiry.getFullYear() + 5)
      expiryDate = expiry.toISOString()
    } else {
      console.error('Unknown product:', product_name)
      return NextResponse.json({ error: 'Unknown product' }, { status: 400 })
    }

    // Update user payment status
    const { error: updateError } = await supabase
      .from('users')
      .update({
        is_paid: true,
        plan_type: planType,
        expiry_date: expiryDate,
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating user:', updateError)
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    console.log(`Payment processed for ${purchaser_email}: ${planType}`)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Payment processed successfully',
      user_id: user.id,
      plan_type: planType
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}