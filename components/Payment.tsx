import CustomButton from "@/components/CustomButton";
import { fetchAPI } from "@/lib/fetch";
import { useStripe } from "@stripe/stripe-react-native";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";

const Payment = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

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
          //   name: fullName || email.split("@")[0],
          //   email: email,
          //   amount: amount,
          //   paymentMethodId: paymentMethod.id,
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

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      //   defaultBillingDetails: {
      //     name: fullName,
      //   },
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      setSuccess(true);
      Alert.alert("Success", "Your order is confirmed!");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

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
