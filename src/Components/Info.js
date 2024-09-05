import React from 'react';
import { isLoggedIn } from './utils/localStorage';

export default function Info() {
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)', // Softer pastel gradient
    };

    const boxStyle = {
        backgroundColor: '#ffffff', // White box background
        borderRadius: '25px',
        padding: '50px',
        color: '#003366', // Dark blue text
        maxWidth: '800px',
        width: '90%',
        margin: '0 auto',
        textAlign: 'center',
        boxShadow: '0px 18px 30px rgba(0, 0, 0, 0.1)', // More prominent shadow for depth
        transition: 'transform 0.4s ease, box-shadow 0.4s ease', // Smooth transition for interactions
    };

    const titleStyle = {
        fontSize: '32px',
        marginBottom: '10px',
        fontWeight: '700',
        color: '#0077b6', // Stylish light blue for the title
        textTransform: 'uppercase',
        letterSpacing: '2px', // Wide letter spacing for a sleek title
    };

    const subtitleStyle = {
        fontSize: '20px',
        marginBottom: '25px',
        color: '#333', // Darker gray for subtitle
        fontWeight: '500',
    };

    const paragraphStyle = {
        fontSize: '18px',
        lineHeight: '1.8',
        color: '#555', // Softer gray for the text
        marginBottom: '20px',
    };

    const listStyle = {
        textAlign: 'left',
        margin: '20px 0',
        paddingLeft: '30px',
    };

    const listItemStyle = {
        marginBottom: '15px',
        fontSize: '17px',
        fontWeight: '500',
    };

    const buttonStyle = {
        marginTop: '30px',
        padding: '12px 25px',
        background: 'linear-gradient(45deg, #0077b6, #00b4d8)', // Gradient button
        color: '#ffffff',
        fontSize: '18px',
        borderRadius: '30px',
        border: 'none',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, background-color 0.3s ease',
        boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1)', // Soft shadow for the button
    };

    const buttonHover = {
        transform: 'scale(1.05)', // Slight scale-up on hover
    };

    const dividerStyle = {
        width: '50px',
        height: '4px',
        backgroundColor: '#0077b6',
        margin: '20px auto',
        borderRadius: '2px',
    };

    return (
        isLoggedIn() ? (
            <div style={containerStyle}>
                <div style={boxStyle}>
                    <h2 style={titleStyle}>Welcome to the Forensic Evidence Management System!</h2>
                    <div style={dividerStyle}></div> {/* Added divider for visual break */}
                    <p style={paragraphStyle}>
                        🔍 <strong>Securing Justice with Every Case!</strong>
                        <br />
                        We are thrilled to have you on board as a crucial part of our team dedicated to upholding the integrity of forensic evidence. With our cutting-edge platform, you now hold the key to managing and tracking evidence efficiently, ensuring that every detail is meticulously preserved and every case is handled with precision.
                    </p>
                    <p style={paragraphStyle}>
                        <strong>🔒 Secure:</strong> Your data is safe with our state-of-the-art security measures.
                        <br />
                        <strong>🚀 Efficient:</strong> Streamline your evidence management with our intuitive interface.
                        <br />
                        <strong>🔗 Connected:</strong> Stay informed and in control with real-time updates and comprehensive logs.
                    </p>
                    <button 
                        style={buttonStyle} 
                        onMouseOver={e => e.currentTarget.style.transform = buttonHover.transform}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Explore Now
                    </button>
                </div>
            </div>
        ) : (
            <div style={containerStyle}>
                <div style={boxStyle}>
                    <h2 style={titleStyle}>Revolutionizing Forensic Evidence with Blockchain Technology</h2>
                    <div style={dividerStyle}></div> {/* Added divider for visual break */}
                    <p style={subtitleStyle}>
                        Bringing transparency, security, and integrity to forensic evidence management. Experience the future of justice with blockchain.
                    </p>
                    <p style={paragraphStyle}>
                        In the world of justice, evidence is everything. But what if evidence could be secured in a way that makes tampering impossible? Blockchain technology provides a revolutionary solution for managing forensic evidence with unmatched transparency, immutability, and security.
                    </p>
                    <p style={paragraphStyle}>
                        With our platform, each piece of evidence is cryptographically stored and verified on the blockchain, ensuring the integrity of every case.
                    </p>
                    <ul style={listStyle}>
                        <li style={listItemStyle}><strong>Tamper-Proof Storage:</strong> Immutable blockchain records guarantee that once evidence is stored, it cannot be altered.</li>
                        <li style={listItemStyle}><strong>Enhanced Chain of Custody:</strong> Track every step of evidence handling in real time, ensuring transparency.</li>
                        <li style={listItemStyle}><strong>Decentralized Trust:</strong> No single point of failure, ensuring security through distributed ledger technology.</li>
                    </ul>
                </div>
            </div>
        )
    );
}
