import { GoogleLogin } from "@react-oauth/google";
import { useOutletContext } from "react-router-dom";

import './Login.css'


function Login() {

    const [login, logOut] = useOutletContext();

   
    const errorMessage = (error) => {
        console.log(error);
    };

    return (
        <div id="login-button-container">
            <GoogleLogin onSuccess={login} onFailure={errorMessage} />
        </div>
    )

}

export default Login;