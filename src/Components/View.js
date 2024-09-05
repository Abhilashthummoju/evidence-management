import React, { useEffect, useState } from 'react';
import { Spin, Table } from "antd";
import { LinkOutlined } from '@ant-design/icons';
import '../App.css';

export default function View() {

  useEffect(() => {
    document.title = "EPB | View";
  }, []);

  const [cases, setCases] = useState("No Matches Found");

  const handleRequest = async (fileName, fileType) => {
    console.log("HANDLE CLOCKED");
    const caseNo = document.getElementById("view-search").value;
    const formData = new FormData();
    formData.append("caseNo", caseNo);
    formData.append("fileName", fileName);
    formData.append("fileType", fileType);

    try {
      const response = await fetch(`http://localhost:5001/api/coc`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      if (result.messageType === 'success') {
        const w = window.open(result.fileUrl, '_blank', 'location=no,height=600,width=800,scrollbars=yes,status=yes');
        w.addEventListener('load', () => {
          w.document.title = fileName;
        });
      } else {
        console.error('File not found');
      }

    } catch (error) {
      console.error('There was an error:', error);
    }
  };

  const clickkHandler = () => {
    setCases(<Spin className='custom-spinner' />);

    const columns = [
      {
        title: "Uploader's ID",
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: 'Evidence Name',
        dataIndex: 'fileName',
        key: 'fileName',
      },
      {
        title: 'Evidence Format',
        dataIndex: 'fileType',
        key: 'fileType',
      },
      {
        title: 'View',
        dataIndex: 'fileLink',
        key: 'fileLink',
        render: (text, record) => {
          return (
            <a
              href={record.fileLink}
              id='fileLink'
              target='_blank'
              rel="noopener noreferrer"
              onClick={(event) => {
                // event.preventDefault();
                handleRequest(record.fileName, record.fileType);
              }}
            ><LinkOutlined className='link-symbol' /></a>
          )
        }
      }
    ];

    const _caseNo_ = document.getElementById("view-search").value;
    const formData = new FormData();
    formData.append('caseNo', _caseNo_);

    fetch('http://localhost:5001/api/view', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (!data) {
          setCases("No Matches Found");
        } else {
          const dataSource = data;
          setCases(<Table className='custom-table' dataSource={dataSource} columns={columns} pagination={false} />);
        }
      })
      .catch(error => {
        console.error('There was an error:', error);
      });
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f8ff, #e0f7fa)', // Similar gradient background as the upload form
    padding: '20px',
  };

  const inputGroupStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const inputStyle = {
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #ccc',
    width: '300px',
    fontSize: '16px',
    transition: 'border 0.3s ease', // Smooth transition on focus
    marginRight: '10px',
  };

  const iconStyle = {
    fontSize: '20px',
    cursor: 'pointer',
    color: '#0077b6', // Blue icon to match the theme
    transition: 'color 0.3s ease',
  };

  const casesContainerStyle = {
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.1)', // Softer shadow for consistency
    maxWidth: '750px',
    width: '100%',
    margin: '0 auto',
  };

  const titleStyle = {
    fontSize: '30px',
    marginBottom: '20px',
    fontWeight: 'bold',
    color: '#0077b6',
  };

  return (
    <>
      <div style={containerStyle}>
        <div>
          <div style={inputGroupStyle}>
            <input
              type="search"
              id='view-search'
              style={inputStyle}
              placeholder="Search Case number"
              aria-label="Search"
              aria-describedby="search-addon"
            />
            <span onClick={clickkHandler}>
              <i className="fas fa-search" style={iconStyle}></i>
            </span>
          </div>

          <div style={casesContainerStyle}>
            <h5 style={titleStyle}>Evidence List</h5>
            <h5>{cases}</h5>
          </div>
        </div>
      </div>
    </>
  );
}
