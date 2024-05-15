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
          const { x, y, width, height } = prediction.bbox;
          ctx.strokeStyle = 'red';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, width, height);
        });
      }
    };
  };

  return (
    <div>
      <h1>Upload Image for Inference</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && (
        <div>
          <h2>Image Preview</h2>
          <img src={preview} alt="Selected" style={{ display: 'none' }} />
          <canvas ref={canvasRef}></canvas>
        </div>
      )}
      <button onClick={handleInference} disabled={loading}>
        {loading ? 'Inferring...' : 'Infer Image'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <div>
          <h2>Inference Result</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ImageInference;
