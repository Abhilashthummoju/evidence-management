import React, { useEffect, useState } from 'react';
import { message, Spin } from "antd";
import '../App.css';

export default function Upload() {

  useEffect(() => {
    document.title = "EPB | Upload";
  }, []);

  const [btnText, setBtnText] = useState('Upload');
  const [style, setStyle] = useState(null);

  function containsOnlyNumbers(str) {
    return /^[0-9]+$/.test(str);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setStyle({
      backgroundColor: "white",
      border: "1px solid #ff5e5e",
    })
    setBtnText(<Spin className='custom-spinner' />)

    const _caseNo_ = document.getElementById("upload-case-no").value;
    if (!containsOnlyNumbers(_caseNo_)) {
      message.error("Invalid Case number");
      setStyle(null);
      setBtnText('Upload');
      event.target.reset();
      return false;
    }

    const _caseName_ = document.getElementById("upload-case-name").value;
    const _evidence_ = document.getElementById("upload-file").files[0];

    const formData = new FormData();
    formData.append('caseNo', _caseNo_);
    formData.append('caseName', _caseName_);
    formData.append('evidence', _evidence_);

    fetch('http://localhost:5001/api/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        message[`${data.messageType}`](data.messageContent);
        setStyle(null);
        setBtnText('Upload');
        event.target.reset();
      })
      .catch(error => {
        console.error('There was an error:', error);
        message.error("Server Error");
        setStyle(null);
        setBtnText('Upload');
        event.target.reset();
      });
  }

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f8ff, #e0f7fa)', // Gradient background for a more dynamic look
    padding: '20px',
  };

  const formStyle = {
    backgroundColor: '#ffffff', // White background for the form
    borderRadius: '20px',
    padding: '50px 40px',
    maxWidth: '550px',
    width: '100%',
    boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.1)', // Softer shadow for a floating effect
    textAlign: 'center',
    transform: 'scale(1)', // Initial scale
    transition: 'transform 0.3s ease-in-out', // Subtle hover animation
  };

  const titleStyle = {
    fontSize: '30px',
    marginBottom: '30px',
    fontWeight: 'bold',
    color: '#0077b6', // Light blue for the title
    textTransform: 'uppercase', // Make it uppercase for emphasis
    letterSpacing: '2px', // Adding some spacing between letters for style
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '12px',
    border: '1px solid #ccc',
    fontSize: '16px',
    transition: 'border 0.3s ease', // Smooth transition on focus
  };

  const labelStyle = {
    fontSize: '18px',
    marginBottom: '8px',
    color: '#003366',
    textAlign: 'left',
    display: 'block',
  };

  const buttonStyle = {
    marginTop:10,
    width: '100%',
    padding: '15px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#0077b6',
    color: '#fff',
    fontSize: '18px',
    cursor: 'pointer',
    boxShadow: '0px 8px 15px rgba(0, 119, 182, 0.3)', // Adding shadow for depth
    transition: 'background-color 0.3s ease, transform 0.3s ease', // Smoother hover effects
  };

  const buttonHoverStyle = {
    backgroundColor: '#005f8b', // Darker blue on hover
    transform: 'scale(1.05)', // Slight zoom on hover
  };

  return (
    <>
      <div style={containerStyle}>
        <div
          style={formStyle}
          onMouseEnter={() => setStyle({ transform: 'scale(1.02)' })} // Slight zoom effect on hover
          onMouseLeave={() => setStyle(null)}
        >
          <h1 style={titleStyle}>Upload Case Evidence</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-upload">
              <label htmlFor="upload-case-no" style={labelStyle}>Case number</label>
              <input
                type="text"
                id="upload-case-no"
                placeholder="Enter Case number"
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="upload-case-name" style={labelStyle}>Case name</label>
              <input
                type="text"
                id="upload-case-name"
                placeholder="Enter Case name"
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="upload-file" style={labelStyle}>Document</label>
              <input
                type="file"
                id="upload-file"
                required
                style={inputStyle}
              />
            </div>
            <div >
              <button
                type="submit"
                style={style ? { ...buttonStyle, ...style } : buttonStyle}
                onMouseEnter={() => setStyle({ ...buttonStyle, ...buttonHoverStyle })}
                onMouseLeave={() => setStyle(null)}
              >
                {btnText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
