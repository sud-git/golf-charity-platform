import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createErrorResponse } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    // Verify Stripe signature
    const stripeSignature = request.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeSignature || !webhookSecret) {
      console.error('Missing Stripe webhook signature or secret');
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    // Get raw body for signature verification
    const body = await request.text();
    
    // TODO: Verify signature using stripe.webhooks.constructEvent
    // For now, parse the body as JSON
    let event;
    try {
      event = JSON.parse(body);
    } catch (error) {
      console.error('Invalid JSON in Stripe webhook:', error);
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    // Handle specific events
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSucceeded(paymentIntent: any) {
  try {
    const { metadata } = paymentIntent;
    if (!metadata?.userId || !metadata?.subscriptionId) {
      console.warn('Missing userId or subscriptionId in payment metadata');
      return;
    }

    // Update subscription status to active
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        current_period_start: new Date().toISOString().split('T')[0],
        renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
      })
      .eq('id', metadata.subscriptionId)
      .eq('user_id', metadata.userId);

    if (error) {
      console.error('Failed to update subscription:', error);
    } else {
      console.log(`✓ Subscription ${metadata.subscriptionId} activated`);
    }
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  try {
    const { metadata } = subscription;
    if (!metadata?.userId || !metadata?.subscriptionId) {
      console.warn('Missing metadata in subscription update');
      return;
    }

    const status = subscription.status === 'active' ? 'active' : 'inactive';

    const { error } = await supabase
      .from('subscriptions')
      .update({ status })
      .eq('id', metadata.subscriptionId);

    if (error) {
      console.error('Failed to update subscription status:', error);
    } else {
      console.log(`✓ Subscription ${metadata.subscriptionId} updated to ${status}`);
    }
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionCanceled(subscription: any) {
  try {
    const { metadata } = subscription;
    if (!metadata?.userId || !metadata?.subscriptionId) {
      console.warn('Missing metadata in subscription cancellation');
      return;
    }

    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('id', metadata.subscriptionId);

    if (error) {
      console.error('Failed to cancel subscription:', error);
    } else {
      console.log(`✓ Subscription ${metadata.subscriptionId} cancelled`);
    }
  } catch (error) {
    console.error('Error handling subscription cancelled:', error);
  }
}

async function handlePaymentFailed(invoice: any) {
  try {
    const { metadata } = invoice;
    if (!metadata?.userId) {
      console.warn('Missing userId in payment failed event');
      return;
    }

    // Log payment failure for investigation
    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'payment_failed' })
      .eq('user_id', metadata.userId)
      .eq('status', 'active');

    if (error) {
      console.error('Failed to update subscription to payment_failed:', error);
    } else {
      console.log(`⚠️ Payment failed for user ${metadata.userId}`);
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}
