import React from "react";
//components
import EmptyCart from "../cart/EmptyCart.js";
import MultiStepForm from "./MultiForm.js";

const Checkout = ({
  cartItems,
  productsQuantity,
  totalPayment,
  checkoutSummary,
}) => {
  return (
    <main className="checkout">
      <h2>Checkout</h2>
      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <article className="checkout-content">
          <div className="checkout-form-container">{checkoutSummary}</div>
          <MultiStepForm
            cartItems={cartItems}
            productsQuantity={productsQuantity}
            totalPayment={totalPayment}
          />
        </article>
      )}
    </main>
  );
};

export default Checkout;
