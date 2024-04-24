import React, { useState, useEffect } from "react";

const MultiStepForm = ({ totalPayment, productsQuantity, cartItems }) => {
  const [deliveryOption, setDeliveryOption] = useState("normal");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [locationType, setLocationType] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [transactionSent, setTransactionSent] = useState(false);
  const [step, setStep] = useState(1);

  // Calculate total amount including delivery fee
  const totalAmount = parseFloat(totalPayment) + parseFloat(deliveryFee);

  // Function to send transaction details via WhatsApp
  const sendTransactionDetails = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!transactionSent) {
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

      setTransactionSent(true); // Prevent duplicate messages
    }
  };

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
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

  // Check if both delivery type and location are selected
  const isProceedEnabled = deliveryOption !== "" && locationType !== "";

  return (
    <div className="row">
      <div className="col-md-6 col-md-offset-3">
        <form id="msform">
          {/* progressbar */}
          <ul id="progressbar">
            <li className={step === 1 ? "active" : ""}>Personal Details</li>
            <li className={step === 2 ? "active" : ""}>Delivery Details</li>
          </ul>
          {/* fieldsets */}
          <fieldset style={{ display: step === 1 ? "block" : "none" }}>
            <h2 className="fs-title">Personal Details</h2>
            <h3 className="fs-subtitle">Tell us something more about you</h3>

            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
            />

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
              pattern="[0-9]*" // Pattern to allow only numbers
              title="Please enter only numbers"
              placeholder="Phone Number"
              required
            />

            <input
              type="email"
              name="phone"
              placeholder="Email Address"
              required
            />
            <input
              type="button"
              onClick={nextStep}
              className="next action-button"
              value="Next"
            />
          </fieldset>
          <fieldset style={{ display: step === 2 ? "block" : "none" }}>
            <h2 className="fs-title">Delivery Details</h2>
            <h3 className="fs-subtitle">
              Please Provide Your Delivery Details
            </h3>
            <input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Delivery Address"
              required
            />
            <h3 className="fs-subtitles">Choose delivery type</h3>
            <div className="delivery-options">
              <div className="radio-label">
                <input
                  type="radio"
                  id="normal-delivery"
                  name="delivery-option"
                  value="normal"
                  checked={deliveryOption === "normal"}
                  onChange={() => setDeliveryOption("normal")}
                />
                <label htmlFor="normal-delivery">Normal Delivery</label>
              </div>
              <div>
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
            </div>

            <h3 className="fs-subtitles">Choose Location</h3>
            <div className="location-type">
              <div className="radio-label">
                <input
                  type="radio"
                  id="mainland"
                  name="location-type"
                  value="mainland"
                  checked={locationType === "mainland"}
                  onChange={() => setLocationType("mainland")}
                />
                <label htmlFor="mainland">Mainland</label>
              </div>

              <div className="radio-label">
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
            </div>
            <div className="delivery-buttons">
              <input
                type="button"
                onClick={prevStep}
                className="previous action-button-previous"
                value="Previous"
              />
              <button
                type="button"
                className="submit action-button"
                disabled={!isProceedEnabled} // Disable button if not enabled
                onClick={(e) => {
                  if (!transactionSent && isProceedEnabled) {
                    sendTransactionDetails(e);
                  }
                }}
              >
                Proceed to payment
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default MultiStepForm;
