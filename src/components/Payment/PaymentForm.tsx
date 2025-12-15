import React, { useState, useEffect, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { initiatePayment, markPaid } from "../../redux/reducers/paymentSlice";

interface PaymentFormProps {
  userId: string;
  productId: string;
  productData: FormData;
  onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  userId,
  productId,
  productData,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, paymentData } = useSelector(
    (state: RootState) => state.payment
  );

  const [phone, setPhone] = useState(
    (productData.get("whatsappNumber") as string) || ""
  );
  const [waiting, setWaiting] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const basePrice = Number(productData.get("discountPrice")) 
  || Number(productData.get("price"));

const fee = Math.max(1, Math.ceil(basePrice * 0.01));


  const handlePayment = async (e: FormEvent) => {
    e.preventDefault();
    if (waiting) return;

    const res = await dispatch(
      initiatePayment({ userId, productId, phone, productData })
    );
    if (initiatePayment.fulfilled.match(res)) {
      setWaiting(true);
      setCountdown(60);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (!waiting) return;
    const timer = setInterval(() => {
      setCountdown((prev) =>
        prev <= 1 ? (clearInterval(timer), setWaiting(false), 0) : prev - 1
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [waiting]);
  useEffect(() => {
    if (!waiting || !paymentData?.checkoutRequestId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/payment/status/${paymentData.checkoutRequestId}`
        );
        const data = await res.json();

        if (data.status === "completed") {
          dispatch(markPaid());
          setPaymentComplete(true);
          setWaiting(false);

          setTimeout(() => {
            onSuccess();
          }, 1500);
        }

        if (data.status === "failed") {
          setWaiting(false);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        console.log("Status check failed");
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [waiting, paymentData, dispatch, onSuccess]);

  return (
   <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
  <h2 className="text-2xl font-bold text-center text-green-700 mb-3">
    M-Pesa Payment
  </h2>

  <p className="text-center text-red-600 font-semibold mb-4">
    ⚠️ Do not close this page until your payment is verified.
  </p>

  <p className="text-center text-gray-600 mb-4">
    Confirm the details below to continue.
  </p>

  <div className="bg-gray-50 p-4 rounded-lg border mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-gray-600">Posting Fee (1%)</span>
      <span className="font-semibold">{fee} KES</span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-600">Product Price</span>
      <span className="font-semibold">{basePrice} KES</span>
    </div>

    <hr className="my-2" />

    <div className="flex justify-between text-lg font-bold">
      <span>Total</span>
      <span>{fee} KES</span>
    </div>
  </div>

  {!waiting && !paymentComplete && (
    <form onSubmit={handlePayment} className="space-y-3">

      <label className="text-sm font-semibold text-gray-700">
        M-Pesa Phone Number(07xxxxxxxx)
      </label>
      <input
        type="text"
        placeholder="07XXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border p-3 rounded-lg outline-none focus:border-green-500"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg text-white font-semibold shadow-md"
      >
        {loading ? "Processing..." : `Pay ${fee} KES via M-Pesa`}
      </button>
    </form>
  )}

  {waiting && !paymentComplete && (
    <div className="mt-4 text-center">
      <div className="animate-pulse text-green-700 font-semibold">
        Waiting for M-Pesa STK Push…
      </div>
      <p className="text-gray-500">Please check your phone</p>
      <p className="font-semibold mt-1">Time left: {countdown}s</p>
    </div>
  )}

  {paymentComplete && (
    <div className="text-center mt-4">
      <p className="text-green-600 font-bold text-lg">
        Payment Successful! 🎉
      </p>
    </div>
  )}
</div>

  );
};

export default PaymentForm;
