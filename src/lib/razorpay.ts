export async function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if ((window as any).Razorpay) {
      resolve((window as any).Razorpay);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      if ((window as any).Razorpay) {
        resolve((window as any).Razorpay);
      } else {
        reject(new Error('Razorpay failed to load'));
      }
    };
    script.onerror = () => {
      reject(new Error('Failed to load Razorpay script'));
    };
    document.body.appendChild(script);
  });
}

interface PaymentOptions {
  amount: number;
  currency?: string;
  name?: string;
  description?: string;
  orderId?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  onClose?: () => void;
}

export async function initiatePayment({
  amount,
  currency = 'INR',
  name = 'Chit Fund Manager',
  description = 'Payment for Chit Fund',
  orderId,
  prefill,
  onSuccess,
  onError,
  onClose
}: PaymentOptions) {
  try {
    // Load Razorpay if not already loaded
    const Razorpay = await loadRazorpay();
    if (!Razorpay) {
      throw new Error('Failed to load payment processor');
    }

    // Create order on the server
    const orderResponse = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt: orderId || `receipt_${Date.now()}`,
        notes: {
          description,
        },
      }),
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.json();
      throw new Error(error.error || 'Failed to create order');
    }

    const order = await orderResponse.json();

    if (!order.id) {
      throw new Error('Invalid order response from server');
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name,
      description,
      order_id: order.id,
      handler: async function (response: any) {
        try {
          if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
            throw new Error('Invalid payment response');
          }

          // Verify payment on the server
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (!verifyResponse.ok) {
            const error = await verifyResponse.json();
            throw new Error(error.error || 'Payment verification failed');
          }

          const verification = await verifyResponse.json();
          
          if (verification.success && onSuccess) {
            onSuccess(response);
          } else {
            throw new Error('Payment verification failed');
          }
        } catch (error: any) {
          if (onError) {
            onError(error);
          }
          throw error;
        }
      },
      prefill: prefill || {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9000000000'
      },
      theme: {
        color: '#4F46E5'
      }
    };

    const rzp = new Razorpay(options);
    
    // Handle payment failure
    rzp.on('payment.failed', function (response: any) {
      if (onError) {
        onError(response.error || { description: 'Payment failed' });
      }
    });

    // Handle modal close
    if (onClose) {
      rzp.on('payment.modal.close', onClose);
    }
    
    // Open payment modal
    rzp.open();
    
  } catch (error: any) {
    if (onError) {
      onError(error);
    }
    throw error;
  }
}
