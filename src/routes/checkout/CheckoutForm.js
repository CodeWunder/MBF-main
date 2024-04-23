import React, { useState } from "react";

const CheckoutForm = ({ totalPayment, productsQuantity }) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [transactionSent, setTransactionSent] = useState(false);

  // Calculate total amount including delivery fee
  const deliveryFee = 0; // Assuming no delivery fee for this example
  const totalAmount = parseFloat(totalPayment) + parseFloat(deliveryFee);

  // Function to send transaction details via WhatsApp
  const sendTransactionDetails = () => {
    const message = `Transaction Details: \nName: ${name}\nPhone: ${phoneNumber}\nAddress: ${address}\nTotal Amount: ₦${totalAmount.toFixed(2)}`;

    // Create the WhatsApp message link
    const whatsappLink = `https://wa.me/2348122390396?text=${encodeURIComponent(message)}`;

    // Open the link in a new tab
    window.open(whatsappLink, "_blank");

    setTransactionSent(true); // Optional: Set state to prevent duplicate messages
  };

  return (
    <section className="checkout-personal-information">
      <form>
        <h3>Delivery details</h3>

        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />

        <label htmlFor="phone-number">Phone Number:</label>
        <input
          type="tel"
          id="phone-number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="input-field"
        />

        <label htmlFor="address">Delivery Address:</label>
        <textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input-field"
        />

        <article className="checkout-carttotals">
          {productsQuantity === 0 ? null : (
            <section className="cart-totals">
              <section className="totals-content">
                <h4 className="cart-totals-sum">Delivery Fee:</h4>
                <p>₦ {parseFloat(deliveryFee).toFixed(2)}</p>
              </section>
              <section className="totals-content">
                <h4 className="cart-totals-sum">Product Price:</h4>
                <p>₦ {parseFloat(totalPayment).toFixed(2)}</p>
              </section>
              <section className="totals-content">
                <h4 className="cart-totals-sum">Total Amount:</h4>
                <p>₦ {totalAmount.toFixed(2)}</p>
              </section>
            </section>
          )}
        </article>

        {/* Button to send WhatsApp message */}
        <button
          type="button"
          className="active-button-style"
          onClick={() => {
            if (!transactionSent) {
              sendTransactionDetails();
            }
          }}
        >
          Proceed to payment
        </button>
      </form>
    </section>
  );
};

export default CheckoutForm;
