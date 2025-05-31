import React, { useState } from "react";
import * as XLSX from "xlsx";

const TimesheetFileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setParsedData(null);
  };

  const parseExcel = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });
        resolve(jsonData);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an Excel file to upload.");
      return;
    }

    try {
      setUploading(true);
      const data = await parseExcel(file);
      setParsedData(data);

      // Now send the JSON data to backend
      const response = await fetch("/api/upload-timesheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ timesheetData: data }),
      });

      if (response.ok) {
        alert("Timesheet data uploaded successfully!");
        setFile(null);
        setParsedData(null);
      } else {
        alert("Upload failed. Please try again.");
      }
    } catch (error) {
      alert("Error processing file.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", textAlign: "center" }}>
      <h2>Upload Timesheet Excel File</h2>
      <input
        type="file"
        accept=".xls,.xlsx"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {file && <p>Selected file: {file.name}</p>}

      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          cursor: uploading ? "not-allowed" : "pointer",
        }}
      >
        {uploading ? "Uploading..." : "Parse & Upload"}
      </button>

      {/* Optional: Show parsed JSON preview */}
      {parsedData && (
        <div
          style={{
            marginTop: 30,
            textAlign: "left",
            maxHeight: 200,
            overflowY: "scroll",
            border: "1px solid #ccc",
            padding: 10,
          }}
        >
          <h4>Parsed Data Preview (first 5 rows):</h4>
          <pre>{JSON.stringify(parsedData.slice(0, 5), null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TimesheetFileUpload;
