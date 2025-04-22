import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import SignPad from "./SignPad";
const EditSection2 = ({ handleEdit }) => {
    const canvasRef = useRef(null);
    const [capturedFile1, setCapturedFile1] = useState(null);
    const [shapes, setShapes] = useState([]);
    const [currentShape, setCurrentShape] = useState([]);
    const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
    const [image, setImage] = useState(null);
    const [originalImageUrl, setOriginalImageUrl] = useState(null);
    const [imagefile, setImageFile] = useState(null)
    const [newTextData, setNewTextData] = useState("")
    const [isWriteMode, setIsWriteMode] = useState(false);
    const [texts, setTexts] = useState([]);
    const CLOSE_DISTANCE = 10;
  
    // Load the original image
    useEffect(() => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = originalImageUrl === null ? "img/camera2.png" : originalImageUrl;
      img.onload = () => setImage(img);
    }, [originalImageUrl]);
  
  
  
    const redraw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (image) ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
        shapes.forEach((shape, index) => {
          const isSelected = index === selectedShapeIndex;
          shape.points.forEach((point) => drawPoint(ctx, point.x, point.y, shape.withLines ? "black" : "red"));
          drawLines(ctx, shape.points, shape.withLines ? "black" : "red");
          if (shape.withLines) fillWithDiagonalLines(ctx, shape.points, isSelected);
        });
    
        currentShape.forEach((point) => drawPoint(ctx, point.x, point.y, "black"));
        if (currentShape.length > 1) drawLines(ctx, currentShape, "black");
    
        texts.forEach(({ text, x, y }) => {
          ctx.fillStyle = "blue";
          ctx.font = "18px Arial";
          ctx.fillText(text, x, y);
        });
      };
    
      useEffect(() => redraw(), [shapes, currentShape, image, selectedShapeIndex, texts]);

    const drawPoint = (ctx, x, y, color) => {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    };
  
    const drawLines = (ctx, points, color) => {
      if (points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    };
  
     const fillWithDiagonalLines = (ctx, points, isSelected) => {
    if (points.length < 3) return;

    const patternCanvas = document.createElement("canvas");
    const patternCtx = patternCanvas.getContext("2d");
    patternCanvas.width = 10;
    patternCanvas.height = 10;
    patternCtx.fillStyle = isSelected ? "rgba(0, 128, 0, 0.5)" : "rgba(255, 255, 0, 0.5)";
    patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);

    const pattern = ctx.createPattern(patternCanvas, "repeat");

    ctx.save();
    ctx.fillStyle = pattern;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
    
    const handleCanvasClick = async (e) => {
        if (!imagefile) {
          Swal.fire({
            title: "Nessuna immagine disponibile",
            text: "Carica un'immagine prima di disegnare sulla tela.",
            icon: "warning",
          });
          return;
        }
    
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
    
        if (isWriteMode) {
          const clickedTextIndex = texts.findIndex((t) => {
            const textWidth = 100;
            const textHeight = 20;
            return x >= t.x && x <= t.x + textWidth && y <= t.y && y >= t.y - textHeight;
          });
    
          if (clickedTextIndex !== -1) {
            const { isConfirmed, isDenied } = await Swal.fire({
                title: `Cosa vuoi fare con questo testo?`,
                icon: "question",
              showDenyButton: true,
              showCancelButton: true,
              confirmButtonText: "Modificare",
              denyButtonText: "Eliminare",
              cancelButtonText: "Cancellare",
            });
    
            if (isDenied) {
              setTexts((prev) => prev.filter((_, i) => i !== clickedTextIndex));
            } else if (isConfirmed) {
              const { value: newText } = await Swal.fire({
                title: "Modifica testo",
                input: "text",
                inputValue: texts[clickedTextIndex].text,
                showCancelButton: true,
              });
    
              if (newText) {
                setTexts((prev) =>
                  prev.map((t, i) =>
                    i === clickedTextIndex ? { ...t, text: newText } : t
                  )
                );
              }
            }
            return;
          }
    
          const { value: text } = await Swal.fire({
            title: "Inserisci il testo",
            input: "text",
            inputPlaceholder: "Scrivi qualcosa...",
            cancelButtonText: "Cancellare",
            showCancelButton: true,
          });
    
          if (text) {
            setTexts((prev) => [...prev, { text, x, y }]);
          }
    
          return;
        }
    
        const clickedShapeIndex = shapes.findIndex((shape) => isPointInShape({ x, y }, shape.points));
        if (clickedShapeIndex >= 0) {
          setSelectedShapeIndex(clickedShapeIndex);
        } else {
          setCurrentShape((prev) => [...prev, { x, y }]);
        }
      };
      
    const isPointInShape = (point, shapePoints) => {
      let inside = false;
      for (let i = 0, j = shapePoints.length - 1; i < shapePoints.length; j = i++) {
        const xi = shapePoints[i].x, yi = shapePoints[i].y;
        const xj = shapePoints[j].x, yj = shapePoints[j].y;
        if ((yi > point.y) !== (yj > point.y) && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }
      return inside;
    };
  
    const deleteSelectedShape = async () => {
      if (selectedShapeIndex === null) return;
      const result = await Swal.fire({
        title: "Sei sicuro?",
        text: "Vuoi eliminare la forma selezionata?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sì, cancellalo!",
        cancelButtonText: "Cancellare",
      });
      if (result.isConfirmed) {
        setShapes((prev) => prev.filter((_, index) => index !== selectedShapeIndex));
        setSelectedShapeIndex(null);
      } else {
        setSelectedShapeIndex(null);
      }
    };
  
    useEffect(() => {
      if (selectedShapeIndex !== null) deleteSelectedShape();
    }, [selectedShapeIndex]);
  
  
    // handle image file here
    const handleChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setOriginalImageUrl(URL.createObjectURL(file));
        setImageFile(file)
      }
    };
  
  
    return (
      <>
        <div className="mt-5">
          <SignPad setNewTextData={setNewTextData} />
        </div>
        <div className="col-lg-12 mb-4 mt-4">
          <div className="records_photography_box">
            <div>
              <canvas ref={canvasRef} width="999" height="600" onClick={handleCanvasClick} />
            </div>
            <div className="right_photographyBtn">
              <ul className="right_photographyList">
              <li>
                  <div className="right_photoItem">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 256 256"
                      width="26px"
                      height="26px"
                      fillRule="nonzero"
                    >
                      <g
                        fill="#ed9604"
                        fillRule="nonzero"
                        stroke="none"
                        strokeWidth="1"
                        strokeLinecap="butt"
                        strokeLinejoin="miter"
                        strokeMiterlimit="10"
                        fontFamily="none"
                        fontWeight="none"
                        fontSize="none"
                        textAnchor="none"
                        style={{ mixBlendMode: 'normal' }}
                      >
                        <g transform="scale(10.66667,10.66667)">
                          <path d="M4,4c-1.09425,0 -2,0.90575 -2,2v12c0,1.09426 0.90575,2 2,2h16c1.09426,0 2,-0.90574 2,-2v-10c0,-1.09425 -0.90574,-2 -2,-2h-8l-2,-2zM4,6h5.17188l2,2h8.82813v10h-16z"></path>
                        </g>
                      </g>
                    </svg>
                    <label htmlFor="fileupload">Carica file</label>
                    <input type="file" id="fileupload" style={{ display: "none" }} onChange={handleChange} />
                  </div>
                </li>

                <li onClick={() => {
  
                  if (currentShape.length > 2) {
                    setShapes([...shapes, { points: [...currentShape, currentShape[0]], withLines: false }])
                    setCurrentShape([]);
                  } else {
                    setCurrentShape([]);
                  }
                }
                }>
                  <div className="right_photoItem">
                    <svg width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ECAD42" className="bi bi-octagon">
                      <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z" />
                    </svg>
                    Poligono</div>
                </li>
                <li
                  onClick={() => {
                    if (currentShape.length > 2) {
                      const newShape = {
                        points: [...currentShape, currentShape[0]], // Close the shape
                        withLines: true, // Fill with yellow color
                      };
  
                      setShapes((prevShapes) => [...prevShapes, newShape]); // Update state properly
                      setCurrentShape([]); // Clear current shape after adding
                    } else {
                      setCurrentShape([]);
                    }
                  }}
                >
                  <div className="right_photoItem">
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g opacity="0.2">
                        <path d="M17.2716 1.75H8.72842C8.60531 1.75 8.4834 1.77425 8.36966 1.82136C8.25591 1.86848 8.15256 1.93753 8.06551 2.02459L2.02459 8.06551C1.93753 8.15256 1.86848 8.25591 1.82136 8.36966C1.77425 8.4834 1.75 8.60531 1.75 8.72842V17.2716C1.75 17.3947 1.77425 17.5166 1.82136 17.6303C1.86848 17.7441 1.93753 17.8474 2.02459 17.9345L8.06551 23.9754C8.15256 24.0625 8.25591 24.1315 8.36966 24.1786C8.4834 24.2258 8.60531 24.25 8.72842 24.25H17.2716C17.3947 24.25 17.5166 24.2258 17.6303 24.1786C17.7441 24.1315 17.8474 24.0625 17.9345 23.9754L23.9754 17.9345C24.0625 17.8474 24.1315 17.7441 24.1786 17.6303C24.2258 17.5166 24.25 17.3947 24.25 17.2716V8.72842C24.25 8.60531 24.2258 8.4834 24.1786 8.36966C24.1315 8.25591 24.0625 8.15256 23.9754 8.06551L17.9345 2.02459C17.8474 1.93753 17.7441 1.86848 17.6303 1.82136C17.5166 1.77425 17.3947 1.75 17.2716 1.75Z" fill="#ECAD42" />
                      </g>
                      <path d="M17.2716 25.1875H8.72844C8.4821 25.1882 8.23807 25.14 8.01048 25.0457C7.78289 24.9514 7.57626 24.813 7.40256 24.6383L1.36171 18.5974C1.18704 18.4237 1.04856 18.2171 0.954289 17.9895C0.860018 17.7619 0.811827 17.5179 0.812507 17.2716V8.72844C0.811831 8.4821 0.860026 8.23807 0.954302 8.01048C1.04858 7.78289 1.18706 7.57626 1.36174 7.40256L7.40262 1.36171C7.57631 1.18704 7.78293 1.04856 8.01051 0.954289C8.23809 0.860018 8.48211 0.811827 8.72844 0.812507H17.2716C17.5179 0.811831 17.7619 0.860026 17.9895 0.954302C18.2171 1.04858 18.4237 1.18706 18.5975 1.36174L24.6383 7.40262C24.813 7.57631 24.9515 7.78293 25.0457 8.01051C25.14 8.23809 25.1882 8.48211 25.1875 8.72844V17.2716C25.1882 17.5179 25.14 17.7619 25.0457 17.9895C24.9514 18.2171 24.813 18.4237 24.6383 18.5975L18.5974 24.6383C18.4237 24.813 18.2171 24.9515 17.9895 25.0457C17.7619 25.14 17.5179 25.1882 17.2716 25.1875ZM8.72844 2.68751L2.68754 8.72841L2.68751 17.2716L8.72841 23.3125L17.2716 23.3125L23.3125 17.2716L23.3125 8.72844L17.2716 2.68751H8.72844Z" fill="#ECAD42" />
                    </svg>
                    Poligono Pieno</div>
                </li>
  
                <li onClick={() => setIsWriteMode((prev) => !prev)}>
              <div className="right_photoItem" style={{ color: isWriteMode ? "green" : "inherit" }}>
                ✍️ Modalità testo {isWriteMode ? "(On)" : ""}
              </div>
            </li>
              </ul>
              <div className="mt-auto">
  
  
                <button
                  type="button"
                  className="save_photoBtn"
                  onClick={() => {
                    const canvas = canvasRef.current;
                    if (!canvas) return;
  
                    canvas.toBlob((blob) => {
                      if (blob) {
                        const file = new File([blob], "canvas_snapshot.png", { type: "image/png" });
  
                        setCapturedFile1(file);
  
                        // Call handleEdit inside the callback after file is created
                        handleEdit(shapes, file, imagefile, newTextData, texts);
                      } 
                    });
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12.353 0.146L13.853 1.646L14 2V13.5L13.5 14H0.5L0 13.5V0.5L0.5 0H12L12.353 0.146ZM1 1V13H13V2.208L11.793 1H10V5H3V1H1ZM7 1V4H9V1H7Z" fill="white" />
                  </svg>
                  Salva
                </button>
              </div>
            </div>
          </div>
        </div>
  
      </>
    );
  };

  export default EditSection2;