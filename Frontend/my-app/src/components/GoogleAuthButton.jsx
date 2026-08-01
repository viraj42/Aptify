import { useGoogleLogin } from "@react-oauth/google";
import { googleLoginUser } from "../api/auth.api";
import useAuth from "../utils/useAuth";
import { useNavigate } from "react-router-dom";

function GoogleAuthButton({ setAlertMsg, text = "Google Account" }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        if (setAlertMsg) setAlertMsg("");
        const data = await googleLoginUser(tokenResponse.access_token);
        if (!data?.user || !data?.token) {
          throw new Error(data.message || "Google authentication failed");
        }
        login(data.user, data.token);
        navigate("/dashboard");
      } catch (err) {
        if (setAlertMsg) setAlertMsg(err.message || "Google authentication failed");
      }
    },
    onError: () => {
      if (setAlertMsg) setAlertMsg("Google Login Failed. Please try again.");
    },
  });

  return (
    <button
      type="button"
      onClick={() => handleGoogleLogin()}
      className="flex items-center justify-center gap-2.5 w-full bg-surface/50 dark:bg-surface/10 border border-border/60 py-2.5 rounded-xl font-semibold hover:bg-muted/30 transition-all text-sm text-foreground shadow-sm hover:shadow-md cursor-pointer"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/500px-Google_%22G%22_logo.svg.png"
        alt="Google"
        className="w-4 h-4"
      />
      {text}
    </button>
  );
}

export default GoogleAuthButton;
