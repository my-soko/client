// src/components/Payment/PaymentForm.tsx
import React, { useState, useEffect, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { initiatePayment, markPaid } from "../../redux/reducers/paymentSlice";
import type { ProductPayload } from "../../types/product";

interface PaymentFormProps {
  userId: string;
  productId: string;
  productData: ProductPayload;
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

  const [phone, setPhone] = useState(productData.whatsappNumber || "");
  const [waiting, setWaiting] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const basePrice = productData.discountPrice || productData.price;
  const fee = Math.max(1, Math.ceil(basePrice * 0.01));

  const handlePayment = async (e: FormEvent) => {
    e.preventDefault();
    if (waiting) return;

    const res = await dispatch(
      initiatePayment({
        userId,
        productId,
        phone,
        productData,
      })
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
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setWaiting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [waiting]);

  // Poll payment status
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
          }, 2000);
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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-center text-green-700 dark:text-green-400 mb-3">
        M-Pesa Payment
      </h2>

      <p className="text-center text-red-600 dark:text-red-400 font-semibold mb-4">
        ⚠️ Do not close this page until your payment is verified.
      </p>

      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-400">Posting Fee (1%)</span>
          <span className="font-semibold">{fee} KES</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-400">Product Price</span>
          <span className="font-semibold">{basePrice} KES</span>
        </div>
        <hr className="my-3 border-gray-300 dark:border-gray-600" />
        <div className="flex justify-between text-lg font-bold">
          <span>Total to Pay</span>
          <span>{fee} KES</span>
        </div>
      </div>

      {/* Initial payment form */}
      {!waiting && !paymentComplete && (
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              M-Pesa Phone Number
            </label>
            <input
              type="tel"
              placeholder="07XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 rounded-lg transition"
          >
            {loading ? "Processing..." : `Pay ${fee} KES via M-Pesa`}
          </button>
        </form>
      )}

      {/* Waiting for STK push */}
      {waiting && !paymentComplete && (
        <div className="text-center py-8">
          <div className="animate-pulse text-green-600 dark:text-green-400 text-xl font-semibold mb-4">
            Waiting for payment...
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Please complete the payment on your phone
          </p>
          <p className="text-2xl font-bold mt-4">{countdown}s</p>
        </div>
      )}

      {/* Payment successful */}
      {paymentComplete && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            Payment Successful!
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Your product is being posted automatically...
          </p>
          <p className="text-sm text-gray-500 mt-6">
            Redirecting to home in 2 seconds
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;