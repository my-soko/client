import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { googleLogin } from "../../redux/reducers/authReducer";

interface GoogleBtnProps {
  onSuccess?: () => void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google?: any;
  }
}

const GoogleButton = ({ onSuccess }: GoogleBtnProps) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: async (response: any) => {
          const res = await dispatch(
            googleLogin({ token: response.credential })
          );

          if (googleLogin.fulfilled.match(res)) {
            onSuccess?.();
          }
        },
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInBtn")!,
        {
          theme: "outline",
          size: "large",
          width: "100%",
        }
      );
    }
  }, []);

  return <div id="googleSignInBtn" className="w-full mt-3"></div>;
};

export default GoogleButton;
