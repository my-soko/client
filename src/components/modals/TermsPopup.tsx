import React from "react";

interface TermsPopupProps {
  open: boolean;
  onClose: () => void;
}

const TermsPopup: React.FC<TermsPopupProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl overflow-y-auto max-h-[80vh]">
        <h2 className="text-2xl font-bold mb-4">Terms & Conditions</h2>

        <p className="text-gray-700 mb-4">
          Welcome to My-Soko! Before creating your account, please read the
          following terms carefully.
        </p>

        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>You agree to provide accurate registration information.</li>
          <li>
            You are responsible for maintaining the confidentiality of your
            account.
          </li>
          <li>
            You may not use this platform for any fraudulent or illegal
            activity.
          </li>
          <li>
            My-Soko reserves the right to suspend accounts violating our
            policies.
          </li>
          <li>
            Payments, disputes, and returns must follow our marketplace rules.
          </li>
        </ul>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TermsPopup;
