import { Outlet } from "react-router-dom"

export default function ForgotPassword(){

  const email = {endpoint: "https://api.yunistore.in/auth/forgot-password/verify-email/email",
                to :"/forgot-password/enter-otp"
};
const otp = {endpoint: "https://api.yunistore.in/auth/forgot-password/verify-email/otp",
to: "/forgot-password/reset-password"     }               



return <Outlet context={{email, otp}} />
}