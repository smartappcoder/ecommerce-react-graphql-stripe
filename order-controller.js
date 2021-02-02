const stripe = require('stripe')('stripe-secret-key');

/* 
 Call from React client
      await strapi.createEntry("orders", {
        amount,
        brews: cartItems,
        city,
        postalCode,
        address,
        token
      });
*/

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

    // // send charge to Stripe (old code from class does not work
    // const charges = await stripe.charges.create({
    //     amount: amount * 100,
    //     currency: 'USD',
    //     description: `Order ${new Date(Date.now())} - User ${ctx.state.user._id}`,
    //     source: token
    // });

    // Update from stripe doc.
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
    const order = await strapi.services.orders.add({
        user: ctx.state.user._id,
        address,
        amount,
        brews,
        postalCode,
        city
    });
    console.log("Order       : ", order);

    return order;
  },
};
