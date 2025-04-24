import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import SignPad from "./SignPad";
const EditSection = ({ data, handleEdit, handleImage, index = null }) => {
  const canvasRef = useRef(null);
  const testJSON = (text) => {
    if (typeof text !== "string") {
      return text;
    }
    try {
      return JSON.parse(text);
    } catch {
      return false;
    }
  };
  const [capturedFile1, setCapturedFile1] = useState(null);
  const [shapes, setShapes] = useState(() => {
    const parsed = testJSON(data?.inspection_shape_data);
    return Array.isArray(parsed) ? parsed : [];
  });

  const [currentShape, setCurrentShape] = useState([]);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [image, setImage] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audio_file_url, setAudio_file_url] = useState(null);
  const [textUrl, setTextUrl] = useState(data?.text_note_full_url);
  const [newTextData, setNewTextData] = useState("");
  const [isWriteMode, setIsWriteMode] = useState(false);

  const [texts, setTexts] = useState([]);
  const CLOSE_DISTANCE = 10;

  // capture original file
  const [original_image, setOriginal_image] = useState({});
  const [original_image_url, setOriginal_image_url] = useState({});
  const fileInputRef = useRef(null);
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src =
      original_image_url[index] ??
      (data?.originalImage_full_url
        ? data?.originalImage_full_url
        : "img/camera2.png") ??
      "img/camera2.png";

    img.onload = () => {
      setImage(img);
    };

    img.onerror = (error) => {
      console.error(error);
    };
  }, [index, data?.originalImage_full_url, original_image_url]);

  useEffect(() => {
    if (data?.polygon_text) {
      let res = data?.polygon_text;
      let parsedRes = typeof res === "string" ? JSON.parse(res) : res;
      let new_text = parsedRes.map(({ text, x, y }) => ({ text, x, y }));

      setTexts(new_text);
    }
  }, [data?.polygon_text]);

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (image) ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    shapes.forEach((shape, index) => {
      const isSelected = index === selectedShapeIndex;
      shape.points.forEach((point) =>
        drawPoint(ctx, point.x, point.y, shape.withLines ? "black" : "red")
      );
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

  useEffect(
    () => redraw(),
    [shapes, currentShape, image, selectedShapeIndex, texts]
  );
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

  const fillWithDiagonalLines = async (ctx, points, isSelected) => {
    if (points.length < 3) return;

    const patternCanvas = document.createElement("canvas");
    const patternCtx = patternCanvas.getContext("2d");
    patternCanvas.width = 10;
    patternCanvas.height = 10;
    patternCtx.fillStyle = isSelected
      ? "rgba(0, 128, 0, 0.5)"
      : "rgba(255, 255, 0, 0.5)";
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
    const hasImage =
      !!original_image_url[index] || !!data?.originalImage_full_url;
    if (!hasImage) {
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

    // ✍️ Handle Text Editing / Adding
    if (isWriteMode) {
      const clickedTextIndex = texts.findIndex((t) => {
        const textWidth = 100;
        const textHeight = 20;
        return (
          x >= t.x && x <= t.x + textWidth && y <= t.y && y >= t.y - textHeight
        );
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

      // Not clicking on existing text = Add new text
      const { value: newText } = await Swal.fire({
        title: "Inserisci il testo",
        input: "text",
        inputPlaceholder: "Write something...",
        showCancelButton: true,
        cancelButtonText: "Cancellare",
      });

      if (newText) {
        setTexts((prev) => [...prev, { text: newText, x, y }]);
      }
      return;
    }

    // Handle Shape Click/Draw
    const clickedShapeIndex = shapes.findIndex((shape) =>
      isPointInShape({ x, y }, shape.points)
    );

    if (clickedShapeIndex >= 0) {
      setSelectedShapeIndex(clickedShapeIndex); // triggers delete logic if active
    } else {
      setCurrentShape((prev) => [...prev, { x, y }]);
    }
  };

  const isPointInShape = (point, shapePoints) => {
    let inside = false;
    for (
      let i = 0, j = shapePoints.length - 1;
      i < shapePoints.length;
      j = i++
    ) {
      const xi = shapePoints[i].x,
        yi = shapePoints[i].y;
      const xj = shapePoints[j].x,
        yj = shapePoints[j].y;
      if (
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi
      ) {
        inside = !inside;
      }
    }
    return inside;
  };

  const deleteSelectedShape = async () => {
    if (selectedShapeIndex !== null) {
      const result = await Swal.fire({
        title: "Sei sicuro?",
        text: "Vuoi eliminare la forma selezionata?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sì, cancellalo!",
        cancelButtonText: "Cancellare",
      });

      if (result.isConfirmed) {
        setShapes((prev) =>
          prev.filter((_, index) => index !== selectedShapeIndex)
        );
        setSelectedShapeIndex(null);
        captureSnapshot();
        return;
      }
      setSelectedShapeIndex(null);
    }
  };

  const captureSnapshot = async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          // Extract MIME type from the canvas's current image format
          const mimeType = blob.type || "image/png"; // Default to PNG if not available
          const fileExtension = mimeType.split("/")[1]; // Extract the file extension

          const file = new File([blob], `canvas_snapshot.${fileExtension}`, {
            type: mimeType,
          });
          setCapturedFile1(file);
        } else {
          console.error("Snapshot capture failed!");
        }
      });
    }
  };

  useEffect(() => {
    captureSnapshot(); // Trigger snapshot after shape update
  }, [shapes]); // Listen for shapes state changes

  useEffect(() => {
    if (selectedShapeIndex !== null) {
      deleteSelectedShape();
    }
  }, [selectedShapeIndex]);

  // handle image file here
  const handleChange = (e, idx) => {
    const file = e.target.files[0];

    if (file instanceof File) {
      setOriginal_image((prev) => ({
        ...prev,
        [idx]: file,
      }));

      setOriginal_image_url((prev) => ({
        ...prev,
        [idx]: URL.createObjectURL(file),
      }));
    }
  };

  // handle autio file
  const handleChangeAudio = (e, index) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
      setAudio_file_url(URL.createObjectURL(file));
    }
  };

  const handleDeleteFiles = (FileType) => {
    handleImage(data?.id_not_conformity_detail, FileType);
  };

  const handleAudio = () => {
    if (audio_file_url) {
      URL.revokeObjectURL(audio_file_url); // Revoke the URL to release memory
    }
    setAudioFile(null);
    setAudio_file_url(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };

  return (
    <>
      <div className="col-lg-12  mb-4">
        {(data?.audio_notes_full_url_mp3 !== null || audio_file_url) && (
          <div className="col-md-12 w-100">
            <label className="status_label_box">File audio</label>

            <div className="form-floating">
              <div className="d-flex align-items-center gap-md-4 gap-2">
                <audio
                  controls
                  src={
                    data?.audio_notes_full_url === null
                      ? audio_file_url
                      : data?.audio_notes_full_url_mp3
                  }
                />
                <svg
                  onClick={() =>
                    data?.audio_notes_full_url === null
                      ? handleAudio()
                      : handleImage(data?.id_not_conformity_detail, "audio")
                  }
                  className="table_actionBtn"
                  width="26"
                  height="25"
                  viewBox="0 0 26 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="button"
                  aria-label="Delete audio file"
                >
                  <path
                    d="M1.5 5.5138H24.859M10.844 11.3538V17.1938M15.516 11.3538V17.1938M3.836 5.5138H22.523L20.677 22.1218C20.6137 22.6934 20.3418 23.2215 19.9134 23.6052C19.485 23.9888 18.9301 24.2008 18.355 24.2008H8C7.42544 24.2001 6.87129 23.9877 6.44348 23.6042C6.01567 23.2206 5.74421 22.6929 5.681 22.1218L3.836 5.5138ZM7.743 2.1818C7.93182 1.78122 8.23061 1.44256 8.60455 1.20531C8.97848 0.968063 9.41215 0.841992 9.855 0.841797H16.5C16.9432 0.841612 17.3773 0.967505 17.7516 1.20478C18.1259 1.44205 18.425 1.78091 18.614 2.1818L20.184 5.5138H6.172L7.743 2.1818Z"
                    stroke="currentcolor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        <input
          type="file"
          accept="audio/*"
          onChange={(e) => handleChangeAudio(e, index)}
          ref={fileInputRef}
          placeholder="upload audio"
          id={`audioUpload-${index}`}
          style={{ display: "none" }}
        />
        <label
        style={{cursor: "pointer"}}
          for={`audioUpload-${index}`}
          className="btn-primary btn-default text-center w-auto"
        >
          <span className="me-2" >
            <svg
              width="18"
              height="19"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.438 10.7791V0.327148H10.452V10.7791H0V13.7651H10.452V24.2171H13.438V13.7651H23.89V10.7791H13.438Z"
                fill="currentcolor"
              ></path>
            </svg>
          </span>{" "}
          Carica Audio
        </label>

        <div className="mt-5 mb-4">
          <SignPad
            existingSignature={textUrl}
            setNewTextData={setNewTextData}
          />
        </div>
        <div className="records_photography_box space-0">
          <div className="records_photography_box records_photography_row space-0 ">
            <canvas
              ref={canvasRef}
              width="999"
              height="600"
              onClick={handleCanvasClick}
            />
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
                        style={{ mixBlendMode: "normal" }}
                      >
                        <g transform="scale(10.66667,10.66667)">
                          <path d="M4,4c-1.09425,0 -2,0.90575 -2,2v12c0,1.09426 0.90575,2 2,2h16c1.09426,0 2,-0.90574 2,-2v-10c0,-1.09425 -0.90574,-2 -2,-2h-8l-2,-2zM4,6h5.17188l2,2h8.82813v10h-16z"></path>
                        </g>
                      </g>
                    </svg>

                    <label htmlFor={`fileupload-${index}`}>Upload File</label>
                    <input
                      type="file"
                      id={`fileupload-${index}`}
                      placeholder="upload file"
                      style={{ display: "none" }}
                      onChange={(e) => handleChange(e, index)}
                    />
                  </div>
                </li>

                <li
                  onClick={() => {
                    if (currentShape.length > 2) {
                      setShapes([
                        ...shapes,
                        {
                          points: [...currentShape, currentShape[0]],
                          withLines: false,
                        },
                      ]);
                      setCurrentShape([]);
                    } else {
                      setCurrentShape([]);
                    }
                  }}
                >
                  <div className="right_photoItem">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#ECAD42"
                      className="bi bi-octagon"
                    >
                      <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z" />
                    </svg>
                    Poligono
                  </div>
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
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 26 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.2">
                        <path
                          d="M17.2716 1.75H8.72842C8.60531 1.75 8.4834 1.77425 8.36966 1.82136C8.25591 1.86848 8.15256 1.93753 8.06551 2.02459L2.02459 8.06551C1.93753 8.15256 1.86848 8.25591 1.82136 8.36966C1.77425 8.4834 1.75 8.60531 1.75 8.72842V17.2716C1.75 17.3947 1.77425 17.5166 1.82136 17.6303C1.86848 17.7441 1.93753 17.8474 2.02459 17.9345L8.06551 23.9754C8.15256 24.0625 8.25591 24.1315 8.36966 24.1786C8.4834 24.2258 8.60531 24.25 8.72842 24.25H17.2716C17.3947 24.25 17.5166 24.2258 17.6303 24.1786C17.7441 24.1315 17.8474 24.0625 17.9345 23.9754L23.9754 17.9345C24.0625 17.8474 24.1315 17.7441 24.1786 17.6303C24.2258 17.5166 24.25 17.3947 24.25 17.2716V8.72842C24.25 8.60531 24.2258 8.4834 24.1786 8.36966C24.1315 8.25591 24.0625 8.15256 23.9754 8.06551L17.9345 2.02459C17.8474 1.93753 17.7441 1.86848 17.6303 1.82136C17.5166 1.77425 17.3947 1.75 17.2716 1.75Z"
                          fill="#ECAD42"
                        />
                      </g>
                      <path
                        d="M17.2716 25.1875H8.72844C8.4821 25.1882 8.23807 25.14 8.01048 25.0457C7.78289 24.9514 7.57626 24.813 7.40256 24.6383L1.36171 18.5974C1.18704 18.4237 1.04856 18.2171 0.954289 17.9895C0.860018 17.7619 0.811827 17.5179 0.812507 17.2716V8.72844C0.811831 8.4821 0.860026 8.23807 0.954302 8.01048C1.04858 7.78289 1.18706 7.57626 1.36174 7.40256L7.40262 1.36171C7.57631 1.18704 7.78293 1.04856 8.01051 0.954289C8.23809 0.860018 8.48211 0.811827 8.72844 0.812507H17.2716C17.5179 0.811831 17.7619 0.860026 17.9895 0.954302C18.2171 1.04858 18.4237 1.18706 18.5975 1.36174L24.6383 7.40262C24.813 7.57631 24.9515 7.78293 25.0457 8.01051C25.14 8.23809 25.1882 8.48211 25.1875 8.72844V17.2716C25.1882 17.5179 25.14 17.7619 25.0457 17.9895C24.9514 18.2171 24.813 18.4237 24.6383 18.5975L18.5974 24.6383C18.4237 24.813 18.2171 24.9515 17.9895 25.0457C17.7619 25.14 17.5179 25.1882 17.2716 25.1875ZM8.72844 2.68751L2.68754 8.72841L2.68751 17.2716L8.72841 23.3125L17.2716 23.3125L23.3125 17.2716L23.3125 8.72844L17.2716 2.68751H8.72844Z"
                        fill="#ECAD42"
                      />
                    </svg>
                    Poligono Pieno
                  </div>
                </li>
                <li onClick={() => setIsWriteMode((prev) => !prev)}>
                  <div
                    className="right_photoItem"
                    style={{ color: isWriteMode ? "orange" : "" }}
                  >
                    ✍️ Modalità testo {isWriteMode ? "(On)" : ""}
                  </div>
                </li>
              </ul>
              <div className="mt-auto salvaDeletaBTn">
                <button
                  type="button"
                  onClick={() => {
                    const canvas = canvasRef.current;
                    if (!canvas) return;

                    canvas.toBlob((blob) => {
                      if (blob) {
                        const file = new File([blob], "canvas_snapshot.png", {
                          type: "image/png",
                        });

                        const blobUrl = URL.createObjectURL(blob);
                        setCapturedFile1(file);
                        handleEdit(
                          index,
                          data?.inspectionnotes,
                          data?.id_not_conformity_detail,
                          data?.original_image,
                          shapes,
                          file,
                          original_image[index],
                          audioFile,
                          newTextData,
                          texts
                        );
                      }
                    });
                  }}
                  className="save_photoBtn"
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.353 0.146L13.853 1.646L14 2V13.5L13.5 14H0.5L0 13.5V0.5L0.5 0H12L12.353 0.146ZM1 1V13H13V2.208L11.793 1H10V5H3V1H1ZM7 1V4H9V1H7Z"
                      fill="white"
                    />
                  </svg>
                  Salva
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteFiles("image")}
                  className="save_photoBtn"
                >
                  <svg
                    width="26"
                    height="25"
                    viewBox="0 0 26 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.5 5.5138H24.859M10.844 11.3538V17.1938M15.516 11.3538V17.1938M3.836 5.5138H22.523L20.677 22.1218C20.6137 22.6934 20.3418 23.2215 19.9134 23.6052C19.485 23.9888 18.9301 24.2008 18.355 24.2008H8C7.42544 24.2001 6.87129 23.9877 6.44348 23.6042C6.01567 23.2206 5.74421 22.6929 5.681 22.1218L3.836 5.5138ZM7.743 2.1818C7.93182 1.78122 8.23061 1.44256 8.60455 1.20531C8.97848 0.968063 9.41215 0.841992 9.855 0.841797H16.5C16.9432 0.841612 17.3773 0.967505 17.7516 1.20478C18.1259 1.44205 18.425 1.78091 18.614 2.1818L20.184 5.5138H6.172L7.743 2.1818Z"
                      stroke="currentcolor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Deleta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditSection;
