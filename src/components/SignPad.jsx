import React, { useRef, useState, useEffect } from "react";

const SignPad = ({ existingSignature = null, setNewTextData }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [imageURL, setImageURL] = useState(existingSignature || null);
  const [isModified, setIsModified] = useState(false);
  const [isSignatureExists, setIsSignatureExists] = useState(
    !!existingSignature
  ); 

  useEffect(() => {
    if (existingSignature) {
      loadExistingSignature(existingSignature);
    }
  }, [existingSignature]);

  const loadExistingSignature = (imageSrc) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;
    image.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  };

  const getMousePosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = (e) => {
    if (isSignatureExists) {
      // alert("Please clear the existing signature before drawing a new one.");
      return;
    }

    if (!isModified) {
      clearSignature(); 
    }
    setIsModified(true);

    const { x, y } = getMousePosition(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || isSignatureExists) return;
    const { x, y } = getMousePosition(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setImageURL(null);
    setIsModified(false);
    setIsSignatureExists(false);
    setNewTextData(null);
  };

  const saveSignature = () => {
    try {
      const canvas = canvasRef.current;
      if (!isModified) {
        // alert("Please sign before saving.");
        return;
      }

      const base64Image = canvas.toDataURL("image/png");
      console.log("Base64 Signature:", base64Image);
      setNewTextData(base64Image);
      setImageURL(base64Image);
      setIsSignatureExists(true);
    } catch (error) {
      console.error("Error saving signature:", error);
    }
  };

  return (
    <div className="signaturePad_box signaturePad-section">
      <h2 className="signaturePad_title">Nota di testo</h2>
      {isSignatureExists && (
        <p className="text-red-500 mb-2">
          Cancella la nota di testo esistente prima di scriverne una nuova.
        </p>
      )}
      <div className="signatureCanvas_max">
        <canvas
          ref={canvasRef}
          width={400}
          height={100}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className={isSignatureExists ? "cursor-not-allowed opacity-50" : ""}
        />
      </div>
      <div className="d-flex justify-content-end gap-md-4 gap-2 mt-2 flex-wrap">
        <button
          type="button"
          className="btn btn-primary"
          onClick={clearSignature}
        >
          Nota chiara
        </button>
        <button
          type="button"
          className={`btn ${
            isModified ? "btn-primary" : "btn-secondry text-gray-500"
          }`}
          onClick={saveSignature}
          disabled={!isModified}
        >
          Salva nota
        </button>
      </div>
    </div>
  );
};

export default SignPad;
