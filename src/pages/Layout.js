import {Outlet, useNavigate} from 'react-router-dom';
import { useState, useEffect } from 'react';

import './Layout.css';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

import axios from 'axios';

function Layout() {
    //top level layout of app

    const [ user, setUser ] = useState([]);
    const [ profile, setProfile ] = useState([]);
    
    const navigate = useNavigate();

    useEffect(() => {
        //redirect to /notes by default
        if (window.location.pathname === "/" || window.location.pathname === "/login" && profile !== null && profile !== undefined && profile !== []) {
            console.log("Profile: " + JSON.stringify(profile));
            console.log("user: " + user.access_token)
            navigate('/notes');
        }
            
        else if (profile === null || profile === undefined || profile === []) {
            console.log("Profile: " + JSON.parse(profile));
            navigate('/login');
        }
    }, [profile]);
    
    const toggleNoteNav = () => {
        //toggles note navigation sidebar
        const nav = document.getElementById("note-navigator");
        if (nav.style.display == "none") {
            nav.style.display = "flex";
        }
        else {
            nav.style.display = "none";
        }        
    }

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                    })
                    .catch((err) => console.log(err));
            }
            
        }, [user] );

    const login = useGoogleLogin({
        onSuccess: (codeRespone) => setUser(codeRespone),
        onError: (error) => console.log('Login failed:', error),
    });

    const logOut = () => {
        googleLogout();
        setProfile(null);
    };

    return (
        <div className = "page-content">
            
            <div className='navbar'>
                <button id='sidebar-toggle' onClick={toggleNoteNav}>&#9776;</button>
                <div className='app-title'>
                    <h1>Lotion</h1>
                    <h4>Like Notion, but worse</h4>
                </div>
                <div className='login-container'>
                    {profile ? (<button onClick={logOut}>Log out</button>) : (<button onClick={login}>Log in</button>)}
                </div>
            </div>

            <div className='outlet-content'>
                <Outlet context={[login, logOut]} />                
            </div>

        </div>
        );
}

export default Layout;