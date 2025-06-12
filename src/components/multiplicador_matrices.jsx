///import React from "react";
import React, { useState, useRef, useEffect } from "react";


export default function MultiplicadorMatrices() {
  const [rowsA, setRowsA] = useState(2);
  const [colsA, setColsA] = useState(2);
  const [rowsB, setRowsB] = useState(2);
  const [colsB, setColsB] = useState(2);
  const [matrixA, setMatrixA] = useState(createMatrix(2, 2));
  const [matrixB, setMatrixB] = useState(createMatrix(2, 2));
  const [result, setResult] = useState(null);

  function createMatrix(rows, cols) {
    return Array.from({ length: rows }, () => Array(cols).fill(0));
  }

  const handleSizeChange = (e, setter, isA = true) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setter(value);
      const rows = isA ? (e.target.name === "rowsA" ? value : rowsA) : (e.target.name === "rowsB" ? value : rowsB);
      const cols = isA ? (e.target.name === "colsA" ? value : colsA) : (e.target.name === "colsB" ? value : colsB);
      const newMatrix = createMatrix(rows, cols);
      isA ? setMatrixA(newMatrix) : setMatrixB(newMatrix);
    }
  };

  const multiplicar = (A, B) => {
    if (A[0].length !== B.length) {
      alert("No se pueden multiplicar: columnas de A deben ser igual a filas de B");
      return null;
    }

    const res = Array(A.length)
      .fill(0)
      .map(() => Array(B[0].length).fill(0));

    for (let i = 0; i < A.length; i++) {
      for (let j = 0; j < B[0].length; j++) {
        for (let k = 0; k < A[0].length; k++) {
          res[i][j] += A[i][k] * B[k][j];
        }
      }
    }
    return res;
  };

  const handleChange = (e, matrix, setMatrix, row, col) => {
    const val = parseFloat(e.target.value);
    const newMatrix = matrix.map((r) => [...r]);
    newMatrix[row][col] = isNaN(val) ? 0 : val;
    setMatrix(newMatrix);
  };

  const onMultiply = () => {
    setResult(multiplicar(matrixA, matrixB));
  };

  const limpiarA = () => {
    setMatrixA(createMatrix(rowsA, colsA));
  };

  const limpiarB = () => {
    setMatrixB(createMatrix(rowsB, colsB));
  };

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [darkMode]);


  return (
    <div
      style={{
        fontFamily: "sans-serif",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      <h1 style={{ marginBottom: "2rem" }}>Multiplicador de Matrices</h1>
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "var(--button-bg)",
          color: "var(--text-color)",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        {darkMode ? "Modo Claro" : "Modo Oscuro"}
      </button>
      <div style={{ display: "flex", gap: "4rem", marginBottom: "2rem" }}>
        <MatrixEditor
          title="Matriz A"
          rows={rowsA}
          cols={colsA}
          matrix={matrixA}
          setMatrix={setMatrixA}
          setRows={(e) => handleSizeChange(e, setRowsA, true)}
          setCols={(e) => handleSizeChange(e, setColsA, true)}
          matrixKey="A"
          onClear={limpiarA}
        />
      
        <MatrixEditor
          title="Matriz B"
          rows={rowsB}
          cols={colsB}
          matrix={matrixB}
          setMatrix={setMatrixB}
          setRows={(e) => handleSizeChange(e, setRowsB, false)}
          setCols={(e) => handleSizeChange(e, setColsB, false)}
          matrixKey="B"
          onClear={limpiarB}
        />
      </div>

      <button
        onClick={onMultiply}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          backgroundColor: "var(--button-bg)",
          color: "var(--text-color)",

          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "2rem",
        }}
      >
        Multiplicar
      </button>

      {result && (
        <div>
          <h2>Resultado</h2>
          {result.map((row, i) => (
            <div key={`res-row-${i}`} style={{ textAlign: "center" }}>
              {row.map((val, j) => (
                <span
                  key={`res-${i}-${j}`}
                  style={{
                    display: "inline-block",
                    width: "50px",
                    margin: "4px",
                    backgroundColor: "#CC6E93",
                    padding: "6px",
                    borderRadius: "4px",
                  }}
                >
                  {val}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MatrixEditor({ title, rows, cols, matrix, setMatrix, setRows, setCols, matrixKey, onClear }) {
  const inputRefs = useRef([]);

  if (inputRefs.current.length !== rows * cols) {
    inputRefs.current = Array(rows * cols)
      .fill(null)
      .map(() => React.createRef());
  }

  return (
    <div>
      <h2>{title}</h2>
      <label>Filas: </label>
      <input name={`rows${matrixKey}`} type="number" value={rows} onChange={setRows} min="1" />
      <label> Columnas: </label>
      <input name={`cols${matrixKey}`} type="number" value={cols} onChange={setCols} min="1" />
      

      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginTop: "1rem" }}>
      <div>
        {matrix.map((row, i) => (
          <div key={`row-${matrixKey}-${i}`}>
            {row.map((val, j) => (
              <input
                ref={inputRefs.current[i * cols + j]}
                key={`${matrixKey}-${i}-${j}`}
                type="text"
                value={val}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!/^-?\d*\.?\d*$/.test(value)) return; // Permite solo números, negativos y decimales
                  const newMatrix = matrix.map((r) => [...r]);
                  newMatrix[i][j] = parseFloat(value) || 0;
                  setMatrix(newMatrix);
                }}
                onFocus={(e) => {
                  if (e.target.value === "0") e.target.value = "";
                }}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    const newMatrix = matrix.map((r) => [...r]);
                    newMatrix[i][j] = 0;
                    setMatrix(newMatrix);
                  }
                }}
                onKeyDown={(e) => {
                  const idx = i * cols + j;
                  if (e.key === "ArrowRight" && j < cols - 1) {
                    inputRefs.current[idx + 1]?.current?.focus();
                  } else if (e.key === "ArrowLeft" && j > 0) {
                    inputRefs.current[idx - 1]?.current?.focus();
                  } else if (e.key === "ArrowDown" && i < rows - 1) {
                    inputRefs.current[idx + cols]?.current?.focus();
                  } else if (e.key === "ArrowUp" && i > 0) {
                    inputRefs.current[idx - cols]?.current?.focus();
                  }
                }}
                style={{
                  width: "50px",
                  margin: "2px",
                  backgroundColor: "var(--input-bg)",
                  color: "var(--text-color)",
                  border: "1px solid #555",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <button
        onClick={onClear}
        style={{
          height: "fit-content",
          padding: "0.5rem 1rem",
          backgroundColor: "var(--input-bg)",
          color: "var(--text-color)",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          alignSelf: "center",
        }}
      >
        Limpiar
      </button>
    </div>

    </div>
  );
}
