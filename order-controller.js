'use strict';

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
const stripe = require('stripe')('stripe-secret-key');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    const { amount, brews, city, postalCode, address, token } = ctx.request.body;

    /*
    amount,
    brews: cartItems,
    city,
    postalCode,
    address,
    token
    */

    console.log("Amount     : ", amount);
    console.log("Brews      : ", JSON.stringify(brews));
    console.log("city       : ", city);
    console.log("postalCode : ", postalCode);
    console.log("Address    : ", address);
    console.log("Token      : ", token);

    // // send charge to Stripe
    // const charges = await stripe.charges.create({
    //     amount: amount * 100,
    //     currency: 'USD',
    //     description: `Order ${new Date(Date.now())} - User ${ctx.state.user._id}`,
    //     source: token
    // });

    // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
    const charges = await stripe.charges.create({
      amount: amount * 100,
      currency: 'usd',
      source: 'tok_mastercard',
      description:  `Order ${new Date(Date.now())} - User ${ctx.state.user._id}`,
    });

    console.log("charges    : ", charges);
    console.log("ctx.state.user    : ", ctx.state.user);

    // Create order to database
    // const order = await strapi.services.orders.add({
    //     user: ctx.state.user._id,
    //     address,
    //     amount,
    //     brews,
    //     postalCode,
    //     city
    // });
    // console.log("Order       : ", order);

    let entity;
    entity = await strapi.services.orders.create({
        user: ctx.state.user._id,
        address,
        amount,
        brews,
        postalCode,
        city      
    });
    return sanitizeEntity(entity, { model: strapi.models.orders });
  },
};
