import React, { useState, useRef  } from 'react';
import './App.css'

function FileUploader() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [intervalTime, setIntervalTime] = useState(0.1); 
  const [addressDirection, setAddressDirection] = useState('http://localhost:5000/reciver')


  // const flagCounter = useRef(new Map());
  const lastUploadTime = localStorage.getItem('lastUploadTime') ? new Date(localStorage.getItem('lastUploadTime')) : null;


  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
    console.log("Selected files:", event.target.files);
  };

  const handleIntervalChange = (event) => {
    setIntervalTime(event.target.value);
    console.log("New interval time:", event.target.value);
  };

  const handleAddressDirection = (event) =>{
    setAddressDirection(event.target.value);
    console.log('New Address Location:', event.target.value);
  }

  const startUploading = () => {
    console.log("Starting the upload process...");
    setInterval(() => {
      checkAndUploadNewFiles();
    }, intervalTime * 60000); 
  };

  let flag = 0
  const checkAndUploadNewFiles = () => {
    console.log('Last upload time:', lastUploadTime);
    const newFiles = selectedFiles.filter(file => {
      console.log('File:', file.name, 'Last modified:', new Date(file.lastModified).toLocaleString());
      return !lastUploadTime || file.lastModified > lastUploadTime.getTime();
    });

    if (newFiles.length > 0 && flag<2) {
      console.log("New files found for upload:", newFiles,"   flag:",flag);
      flag++
      uploadFiles(newFiles);
    } else {
      console.log("No new files to upload");
    }
  };

  const uploadFiles = (files) => {
    console.log("We are  in uploadFile function");

    console.log("Files to upload:", files);

    if (files.length === 0) {
      console.log("No files to upload");  
      return;
    }
    files.forEach((file) => {
    console.log("-------------forEach--------------");

      const formData = new FormData();
      formData.append('file', file);
      
      fetch(addressDirection, {
        
        method: 'POST',
        body: formData,
      })
      
      .then((response) =>{
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        response.json()
         })
      .then((data) => {
        console.log(`------File uploaded successfully: ${data}`);
        localStorage.setItem('lastUploadTime', new Date().toISOString());
      })
      .catch((error) => console.error('Error:', error));
    });
  };

  return (
    <div>
      <h2>File Uploader</h2>
        
      <input type="file" multiple onChange={handleFileChange} webkitdirectory="true" />
      
      <div>
        <label>
          Address : 
          <input name='addressInput'  value={addressDirection} onChange={handleAddressDirection} />
        </label>
      </div>
        

      <div>
        <label>
          Check every (minutes):
          <input type="number" value={intervalTime} onChange={handleIntervalChange} />
        </label>
      </div>

      <button onClick={startUploading}>Start Uploading</button>
    </div>
  );
}

export default FileUploader;
