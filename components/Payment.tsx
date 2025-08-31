import CustomButton from "@/components/CustomButton";
import React from "react";

const Payment = () => {
  const openPaymentSheet = async () => {};

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
