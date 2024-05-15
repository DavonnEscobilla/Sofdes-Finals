import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function ImageInference() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    // Create a preview of the selected image
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
      setPreview(reader.result);
    };
  };

  const loadImageBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); // Extract base64 part
      reader.onerror = (error) => reject(error);
    });
  };

  const handleInference = async () => {
    if (!file) {
      alert("Please select an image file.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const imageBase64 = await loadImageBase64(file);
      const response = await axios({
        method: "POST",
        url: "https://detect.roboflow.com/handwritten-flowchart/1",
        params: {
          api_key: "ZAASQIZeBhRJ0JihHevX"
        },
        data: imageBase64,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      setResult(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (result && preview) {
      drawResult(result);
    }
  }, [result, preview]);

  const drawResult = (data) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = preview;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      if (data.predictions) {
        data.predictions.forEach(prediction => {
          if (prediction.bbox) {
            const { x, y, width, height } = prediction.bbox;
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
          }
        });
      }
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', marginBottom: '50px', color: 'white' }}>
      <h1 style={{ fontSize: '2em', marginBottom: '20px' }}>Upload Image for Inference</h1>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#1f2937', color: 'white', border: '1px solid #374151', borderRadius: '5px' }} 
      />
      {preview && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px' }}>Image Preview</h2>
          <div style={{ position: 'relative' }}>
            <canvas ref={canvasRef} style={{ border: '1px solid #ddd', marginTop: '10px' }}></canvas>
          </div>
        </div>
      )}
      <button 
        onClick={handleInference} 
        disabled={loading} 
        style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        {loading ? 'Inferring...' : 'Infer Image'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {result && (
        <div style={{ marginTop: '20px', textAlign: 'left', width: '80%', maxWidth: '600px', wordWrap: 'break-word', backgroundColor: '#1f2937', padding: '20px', borderRadius: '10px' }}>
          <h2 style={{ marginBottom: '10px' }}>Inference Result</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'white' }}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ImageInference;
