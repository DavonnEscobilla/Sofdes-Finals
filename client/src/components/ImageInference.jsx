import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

function ImageInference() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const theme = useSelector((state) => state.theme.theme);

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
    <div className={`min-h-screen max-w-2xl mx-auto flex flex-col justify-center items-center gap-6 p-3 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <h1 className='text-3xl font-semibold'>Upload Image for Inference</h1>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        className={`mb-4 p-2 ${theme === 'dark' ? 'bg-gray-800 text-white border border-gray-600' : 'bg-gray-200 text-gray-900 border border-gray-400'} rounded cursor-pointer`}
      />
      {preview && (
        <div className='text-center'>
          <h2 className='mb-2 text-xl'>Image Preview</h2>
          <div className='relative'>
            <canvas ref={canvasRef} className={`border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'} rounded`}></canvas>
          </div>
        </div>
      )}
      <button 
        onClick={handleInference} 
        disabled={loading} 
        className='mt-4 px-4 py-2 text-lg font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50'
      >
        {loading ? 'Inferring...' : 'Infer Image'}
      </button>
      {error && <p className='mt-4 text-red-500'>{error}</p>}
      {result && (
        <div className={`mt-6 p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'} rounded`}>
          <h2 className='mb-2 text-xl'>Inference Result</h2>
          <pre className='whitespace-pre-wrap break-words'>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ImageInference;
