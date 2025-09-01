import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, amount } = body;

  // Check request input
  if (!name || !email || !amount) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  // Check if the customer is already created in Stripe side
  let customer;
  const doesCustomerExist = await stripe.customers.list({
    email,
  });

  // Create a new customer in Stripe if the customer does not exist
  if (doesCustomerExist.data.length > 0) {
    customer = doesCustomerExist.data[0];
  } else {
    const newCustomer = await stripe.customers.create({
      name,
      email,
    });

    customer = newCustomer;
  }

  // Create an ephemeral Key grants the SDK temporary access to sensitive customer info.
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    // eslint-disable-next-line prettier/prettier
    { apiVersion: "2025-08-27.basil" }
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(amount) * 100,
    currency: "usd",
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
  });

  return new Response(
    JSON.stringify({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      // eslint-disable-next-line prettier/prettier
    })
  );
}
