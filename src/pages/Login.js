import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { useOutletContext } from "react-router-dom";

import './Login.css'


function Login() {

    const [login] = useOutletContext();

   
    const successMessage = (msg) => {
        console.log(msg)
    }

    const errorMessage = (error) => {
        console.log(error);
    };

    return (
        <div id="login-button-container">
            <GoogleLogin click_listener={() => login()} onSuccess={successMessage} onFailure={errorMessage} />
        </div>
    )

}

export default Login;