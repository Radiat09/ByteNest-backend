import Stripe from "stripe";
import config from "../../config/env";

const stripe = new Stripe(config.stripeSecretKey);

const createStripeSession = async (
  orderId: string,
  cartData: any[],
  customerDetail: any
): Promise<string> => {
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

  const cartIDs = cartData.map((item: any) => item._id || item.cartID);

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    metadata: {
      orderID: orderId,
      cartIDs: JSON.stringify(cartIDs),
      email: customerDetail.email.toLowerCase(),
    },
    mode: "payment",
    success_url: `${config.frontendUrl}/payment/success`,
    cancel_url: `${config.frontendUrl}/payment/cancel?orderId=${orderId}`,
  });

  return session.url!;
};

export default createStripeSession;
