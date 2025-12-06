import React, { useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { initiatePayment, markPaid } from "../../redux/reducers/paymentSlice";


interface PaymentFormProps {
  userId: string;
  productId: string;
  onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ userId, productId, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, paymentData } = useSelector((state: RootState) => state.payment);
  const [phone, setPhone] = useState("");

  const handlePayment = async (e: FormEvent) => {
    e.preventDefault();
    const res = await dispatch(initiatePayment({ userId, productId, phone }));

    if (initiatePayment.fulfilled.match(res)) {
      alert("STK Push sent! Check your phone to complete payment.");
      dispatch(markPaid());
      onSuccess();
    }
  };

  return (
    <div className="max-w-md mx-auto p-5 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handlePayment} className="space-y-3">
        <input
          type="text"
          placeholder="07XXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          {loading ? "Processing..." : "Pay 1 KES"}
        </button>
      </form>
      {paymentData && (
        <p className="mt-3 text-green-600">
          CheckoutRequestID: {paymentData.checkoutRequestId}
        </p>
      )}
    </div>
  );
};

export default PaymentForm;
