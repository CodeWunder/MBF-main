import React, { useState, useEffect } from "react";
import { PaystackButton } from "react-paystack";

const CheckoutForm = ({ totalPayment, productsQuantity, cartItems }) => {
  const [deliveryOption, setDeliveryOption] = useState("normal");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [locationType, setLocationType] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [transactionSent, setTransactionSent] = useState(false);

  // Calculate total amount including delivery fee
  const totalAmount = parseFloat(totalPayment) + parseFloat(deliveryFee);

  // Function to send transaction details via WhatsApp
  const sendTransactionDetails = () => {
    const deliveryType = deliveryOption === "express" ? "Express" : "Normal";
    const location = locationType === "island" ? "Island" : "Mainland";

    // Generating product details for each item in cart
    const productDetails = cartItems.map((item) => {
      const selectedAttributes = item.userSelectedAttributes
        .map((attr) => attr.attributeValue)
        .join(", ");
      return `${item.ItemName} (${selectedAttributes}) - (${item.quantity} ${
        item.quantity > 1 ? "items" : "item"
      })`;
    });

    const message = `Hello MBF Enterprise, my name is ${name}. I want to order using ${deliveryType} delivery on ${location} to ${address} and this is my phone number: ${phoneNumber}.

    These are the product details:
    Product Details:
    ${productDetails.join("\n")}
    Product Price: ₦${parseFloat(totalPayment).toFixed(2)}
    Delivery Fee: ₦${parseFloat(deliveryFee).toFixed(2)}
    Total Amount: ₦${totalAmount.toFixed(2)}`;

    // Create the WhatsApp message link
    const whatsappLink = `https://wa.me/2347067903294?text=${encodeURIComponent(
      message
    )}`;

    // Open the link in a new tab
    window.open(whatsappLink, "_blank");

    setTransactionSent(true); // Optional: Set state to prevent duplicate messages
  };

  // Calculate delivery fee based on options
  useEffect(() => {
    let fee = 0;
    if (deliveryOption === "normal" && locationType === "island") {
      fee = 7000;
    } else if (deliveryOption === "normal" && locationType === "mainland") {
      fee = 4000;
    } else if (deliveryOption === "express" && locationType === "island") {
      fee = 8000;
    } else if (deliveryOption === "express" && locationType === "mainland") {
      fee = 6000;
    }
    setDeliveryFee(fee.toFixed(2)); // Format to 2 decimal places
  }, [deliveryOption, locationType]);

  // Paystack configuration
  const paystackConfig = {
    reference: new Date().getTime().toString(), // unique reference
    email: "user@example.com", // customer's email
    amount: totalAmount * 100, // amount in kobo
    publicKey: "YOUR_PAYSTACK_PUBLIC_KEY", // your Paystack public key
    onSuccess: () => {
      sendTransactionDetails();
      setTransactionSent(true);
    },
    onClose: () => alert("Transaction was not completed, window closed."),
  };

  return (
    <section className="checkout-personal-information">
      <form>
        <h3>Delivery details</h3>
        <div className="delivery-options">
          <input
            type="radio"
            id="normal-delivery"
            name="delivery-option"
            value="normal"
            checked={deliveryOption === "normal"}
            onChange={() => setDeliveryOption("normal")}
          />
          <label htmlFor="normal-delivery">Normal Delivery</label>

          <input
            type="radio"
            id="express-delivery"
            name="delivery-option"
            value="express"
            checked={deliveryOption === "express"}
            onChange={() => setDeliveryOption("express")}
          />
          <label htmlFor="express-delivery">Express Delivery</label>
        </div>

        <div className="location-type">
          <input
            type="radio"
            id="mainland"
            name="location-type"
            value="mainland"
            checked={locationType === "mainland"}
            onChange={() => setLocationType("mainland")}
          />
          <label htmlFor="mainland">Mainland</label>

          <input
            type="radio"
            id="island"
            name="location-type"
            value="island"
            checked={locationType === "island"}
            onChange={() => setLocationType("island")}
          />
          <label htmlFor="island">Island</label>
        </div>
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
          onChange={(e) => {
            // Only allow numbers, no spaces or special characters
            const formattedPhoneNumber = e.target.value.replace(/\D/g, "");
            setPhoneNumber(formattedPhoneNumber);
          }}
          className="input-field"
          pattern="[0-9]*"  // Pattern to allow only numbers
          title="Please enter only numbers"
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
        <PaystackButton {...paystackConfig} />
      
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
