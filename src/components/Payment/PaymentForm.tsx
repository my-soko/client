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
  const { loading, error, paymentData } = useSelector(
    (state: RootState) => state.payment
  );

  const [phone, setPhone] = useState(
    (productData.get("whatsappNumber") as string) || ""
  );
  const [waiting, setWaiting] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [paymentComplete, setPaymentComplete] = useState(false);

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

  // Polling payment status
  // Polling payment status every 4 seconds
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
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-center">Complete Payment</h2>

      {error && <p className="text-red-500 text-center mb-3">{error}</p>}

      {!waiting && !paymentComplete && (
        <form onSubmit={handlePayment} className="space-y-3">
          <input
            type="text"
            placeholder="07XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 rounded outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded text-white ${
              loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Processing..." : "Pay 1 KES"}
          </button>
        </form>
      )}

      {waiting && !paymentComplete && (
        <div className="mt-4 text-center">
          <p className="text-blue-600 font-semibold">
            Waiting for M-Pesa payment... ⏳
          </p>
          <p className="text-gray-600">Time left: {countdown}s</p>
        </div>
      )}

      {paymentComplete && (
        <p className="mt-3 text-green-600 text-center font-bold">
          Payment successful! 🎉
        </p>
      )}
    </div>
  );
};

export default PaymentForm;
