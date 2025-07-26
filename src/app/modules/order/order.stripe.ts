import Stripe from "stripe";
import config from "../../config/env";

const stripe = new Stripe(config.stripeSecretKey);

const createStripeSession = async (
  orderId: string,
  cartData: any[],
  customerDetail: any
): Promise<{ url: string; payment_status: string; status: string }> => {
  const lineItems = cartData.map((item: any) => ({
    price_data: {
      currency: "bdt",
      product_data: {
        name: item.title,
        images: item.imageUrl,
      },
      unit_amount: Math.round((item.discountedPrice || item.price) * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    metadata: {
      orderID: orderId,
      email: customerDetail.email.toLowerCase(),
    },
    mode: "payment",
    success_url: `${config.frontendUrl}/payment/success`,
    cancel_url: `${config.frontendUrl}/payment/cancel?orderId=${orderId}`,
  });

  return {
    url: session.url!,
    payment_status: session.payment_status,
    status: session.status,
  };
};

export default createStripeSession;
