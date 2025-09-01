import CustomButton from "@/components/CustomButton";
import { fetchAPI } from "@/lib/fetch";
import { PaymentProps } from "@/types/type";
import { useStripe } from "@stripe/stripe-react-native";
import React, { useState } from "react";
import { Alert } from "react-native";

const Payment = ({
  fullName,
  email,
  amount,
  driverId,
  rideTime,
}: PaymentProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [success, setSuccess] = useState<boolean>(false);

  // Get paymentIntent, ephemeralKey and customer from server api
  const fetchPaymentSheetParams = async () => {
    const { paymentIntent, ephemeralKey, customer } = await fetchAPI(
      "/(api)/(stripe)/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName || email.split("@")[0],
          email: email,
          amount: amount,
        }),
        // eslint-disable-next-line prettier/prettier
      }
    );

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  // Call fetchPaymentSheetParams function and initPaymentSheet Strip api
  // to initialize payment sheet
  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      defaultBillingDetails: {
        name: fullName,
      },
    });
  };

  // Call initializePaymentSheet function and presentPaymentSheet Strip api
  // to open Strip payment sheet modal
  const openPaymentSheet = async () => {
    // call initializePaymentSheet function
    await initializePaymentSheet();

    // call presentPaymentSheet Strip api to open Strip payment sheet modal
    const { error } = await presentPaymentSheet();

    // If failed to open Strip payment sheet modal, or user canceled the payment intent
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      // If user finished payment successfully after Strip payment sheet modal opened
      setSuccess(true);
      Alert.alert("Success", "🎉 Your payment was successful!");
      // NOTE: In real industry work, the best practice is to listen to
      // Strip webhook event instead of executing the callback function.
      // TODO: Call the server api to create the ride
    }
  };

  return (
    <>
      <CustomButton
        title="Confirm Ride"
        className="my-10"
        onPress={openPaymentSheet}
      />
    </>
  );
};

export default Payment;
