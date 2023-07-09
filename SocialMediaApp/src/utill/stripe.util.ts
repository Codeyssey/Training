import * as dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const STRIPE_SECRET_KEY: string = process.env.PORT as string;
const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2022-08-01',
});

const createCustomer = async () => {
  const params: Stripe.CustomerCreateParams = {
    description: 'test customer',
  };

  const customer: Stripe.Customer = await stripe.customers.create(params);

  console.log(customer.id);
};
