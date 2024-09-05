import React, { useEffect, useState } from 'react';
import { message, Spin } from "antd";
import { clearToken } from './utils/clearToken';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from './utils/baseUrl';

import '../App.css';

export default function Login() {

    useEffect(() => {
        document.title = "EPB | Login";
    }, []);

    const navigate = useNavigate();
    const [btnText, setBtnText] = useState('Login');
    const [style, setStyle] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStyle({
            backgroundColor: "white",
            border: "1px solid #ff5e5e",
        })
        setBtnText(<Spin className='custom-spinner' />)

        const _id_ = document.getElementById("login-id").value;
        const _passwd_ = document.getElementById("login-passwd").value;
        const _userType_ = document.getElementById("user-type").value;

        const formData = new FormData();
        formData.append('id', _id_);
        formData.append('passwd', _passwd_);
        formData.append('userType', _userType_);

        try {
            const response = await fetch(`${baseUrl}/login`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data)

            message[`${data.messageType}`](data.messageContent);
            clearToken()
            if (data.messageType === 'success') {
                localStorage.setItem("token", data.token);
                localStorage.setItem("isLoggedIn", "true");
                if (data.user === 'admin') localStorage.setItem("isAdmin", "true");

                navigate('/');
                window.location.reload();
            } 
        } catch (error) {
            console.error('There was an error:', error);
            message.error('Server Error');
        } finally {
            setStyle(null);
            setBtnText('Submit');
            event.target.reset();
        }
    }

    // Enhanced, professional CSS with modern design trends
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #d0e1ff, #7ab1ff)', // Light-to-dark gradient
        fontFamily: "'Poppins', sans-serif", // Modern and professional font
    };

    const boxStyle = {
        backgroundColor: '#ffffff',
        borderRadius: '25px',
        padding: '60px 50px',
        maxWidth: '450px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)', // Deeper shadow for depth
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        margin: '0 20px',
        animation: 'fadeIn 1s ease', // Smooth fade-in animation
    };

    const titleStyle = {
        fontSize: '34px', // Slightly larger title
        marginBottom: '30px',
        fontWeight: '700', // Bolder title for emphasis
        color: '#0077b6',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        animation: 'slideIn 0.5s ease', // Slide-in animation for title
    };

    const inputStyle = {
        width: '100%',
        padding: '18px 25px', // Larger padding for inputs
        margin: '20px 0',
        borderRadius: '30px',
        border: '1px solid #d1d1d1',
        boxSizing: 'border-box',
        fontSize: '16px', 
        outline: 'none',
        transition: 'border 0.3s ease, box-shadow 0.3s ease', // Smooth transitions
        backgroundColor: '#f7f9fc',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)', // Light shadow on inputs for depth
    };

    const inputFocusStyle = {
        border: '1px solid #0077b6',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Emphasized shadow on focus
    };

    const labelStyle = {
        textAlign: 'left',
        color: '#333333',
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '5px',
        display: 'block',
    };

    const buttonStyle = {
        marginTop: '40px',
        // padding: '18px 40px', 
        backgroundColor: '#0077b6',
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: 'bold',
        borderRadius: '30px', 
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.2s ease', 
        width: '100%',
        boxShadow: '0 10px 20px rgba(0, 119, 182, 0.3)', // Elevated button shadow
    };

    const buttonHoverStyle = {
        backgroundColor: '#005f87', 
        transform: 'translateY(-3px)', // Slight button lift on hover
        boxShadow: '0 15px 25px rgba(0, 119, 182, 0.4)', // Stronger shadow on hover
    };

    const dropdownStyle = {
        width: '100%',
        // padding: '18px 25px',
        margin: '20px 0',
        borderRadius: '30px',
        border: '1px solid #d1d1d1',
        fontSize: '16px',
        outline: 'none',
        appearance: 'none',
        backgroundColor: '#f7f9fc', 
        cursor: 'pointer',
        backgroundImage: 'url(/icons/arrow-down.svg)', 
        backgroundPosition: 'right 20px center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '15px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)', // Subtle shadow for dropdown
    };

    const formGroupStyle = {
        textAlign: 'left',
        marginBottom: '20px',
    };

    const linkStyle = {
        fontSize: '14px',
        color: '#0077b6',
        marginTop: '20px',
        textDecoration: 'underline',
        cursor: 'pointer',
        display: 'block',
    };

    return (
        <>
            <div style={containerStyle}>
                <div style={boxStyle}>
                    <h1 style={titleStyle}>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <div style={formGroupStyle}>
                            <label style={labelStyle} htmlFor="login-id">ID</label>
                            <input 
                                style={inputStyle} 
                                type="text" 
                                id="login-id" 
                                placeholder="Enter ID" 
                                required 
                                onFocus={(e) => e.target.style = inputFocusStyle}
                                onBlur={(e) => e.target.style = inputStyle}
                            />
                        </div>
                        <div style={formGroupStyle}>
                            <label style={labelStyle} htmlFor="login-passwd">Password</label>
                            <input 
                                style={inputStyle} 
                                type="password" 
                                id="login-passwd" 
                                placeholder="Enter Password" 
                                required 
                                onFocus={(e) => e.target.style = inputFocusStyle}
                                onBlur={(e) => e.target.style = inputStyle}
                            />
                        </div>
                        <div style={formGroupStyle}>
                            <label style={labelStyle} htmlFor="user-type">You are?</label>
                            <select 
                                style={dropdownStyle} 
                                id="user-type" 
                                required
                            >
                                <option value="">Select User Type</option>
                                <option value="admin">Admin</option>
                                <option value="police">Police Department</option>
                                <option value="forensic">Forensic Department</option>
                            </select>
                        </div>
                        <div className="login-button">
                            <button 
                                type="submit" 
                                style={style ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
                                onMouseEnter={(e) => e.target.style = buttonHoverStyle}
                                onMouseLeave={(e) => e.target.style = buttonStyle}
                            >
                                {btnText}
                            </button>
                        </div>
                        {/* <a href="/forgot-password" style={linkStyle}>Forgot Password?</a> */}
                    </form>
                </div>
            </div>
        </>
    );
}
