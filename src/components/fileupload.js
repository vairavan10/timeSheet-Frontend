import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

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
        const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

        const formattedData = rawData.map((entry) => ({
          name: entry.name || "",
          email: entry.email || "",
          date: entry.date
            ? new Date(entry.date).toISOString().split("T")[0]
            : "",
          hours: parseFloat(entry.hours || 0),
          project: entry.projectId && entry.projectId.trim() !== "" ? entry.projectId.trim() : null,
          workDone: entry.workDone || "",
          typeOfWork: entry.typeOfWork || "",
          extraActivity: entry.extraActivity && entry.extraActivity.trim() !== "" ? entry.extraActivity.trim() : "None",
          leaveType: entry.leaveType || "",
        }));

        resolve(formattedData);
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

      const response = await axios.post("/api/timesheet/upload-timesheet", {
        timesheetData: data,
      });

      if (response.status === 200) {
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
    <div
      style={{
        maxWidth: 700,
        margin: "50px auto",
        padding: 30,
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        borderRadius: 10,
        backgroundColor: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#2c3e50", marginBottom: 20 }}>
        Upload Timesheet Excel File
      </h1>

      <label
        htmlFor="file-upload"
        style={{
          display: "inline-block",
          padding: "12px 25px",
          backgroundColor: "#2980b9",
          color: "#fff",
          borderRadius: 6,
          cursor: uploading ? "not-allowed" : "pointer",
          fontWeight: "600",
          marginBottom: 15,
          userSelect: "none",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) => {
          if (!uploading) e.currentTarget.style.backgroundColor = "#1f6391";
        }}
        onMouseLeave={(e) => {
          if (!uploading) e.currentTarget.style.backgroundColor = "#2980b9";
        }}
      >
        {file ? "Change File" : "Choose Excel File"}
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".xls,.xlsx"
        onChange={handleFileChange}
        disabled={uploading}
        style={{ display: "none" }}
      />
      {file && (
        <p
          style={{
            fontSize: 14,
            marginBottom: 10,
            color: "#34495e",
            fontWeight: "600",
          }}
        >
          Selected file: <span style={{ fontWeight: "normal" }}>{file.name}</span>
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          width: "100%",
          padding: "14px 0",
          backgroundColor: uploading ? "#95a5a6" : "#27ae60",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontWeight: "700",
          fontSize: 16,
          cursor: uploading ? "not-allowed" : "pointer",
          boxShadow: "0 4px 10px rgba(39, 174, 96, 0.4)",
          transition: "background-color 0.3s ease",
          marginTop: 10,
        }}
        onMouseEnter={(e) => {
          if (!uploading) e.currentTarget.style.backgroundColor = "#219150";
        }}
        onMouseLeave={(e) => {
          if (!uploading) e.currentTarget.style.backgroundColor = "#27ae60";
        }}
      >
        {uploading ? "Uploading..." : "Parse & Upload"}
      </button>

      {parsedData && (
        <div
          style={{
            marginTop: 40,
            maxHeight: 300,
            overflowY: "auto",
            border: "1px solid #ddd",
            borderRadius: 6,
            padding: 15,
            backgroundColor: "#fafafa",
            boxShadow: "inset 0 0 5px #ccc",
          }}
        >
          <h3 style={{ marginBottom: 15, color: "#34495e" }}>
            Parsed Data Preview (first 5 rows)
          </h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 14,
              color: "#2c3e50",
            }}
          >
            <thead>
              <tr>
                <th style={{ borderBottom: "2px solid #2980b9", padding: "8px" }}>Date</th>
                <th style={{ borderBottom: "2px solid #2980b9", padding: "8px" }}>Name</th>
                <th style={{ borderBottom: "2px solid #2980b9", padding: "8px" }}>Email</th>
                <th style={{ borderBottom: "2px solid #2980b9", padding: "8px" }}>Hours</th>
                <th style={{ borderBottom: "2px solid #2980b9", padding: "8px" }}>Project ID</th>
                <th style={{ borderBottom: "2px solid #2980b9", padding: "8px" }}>Work Done</th>
                <th style={{ borderBottom: "2px solid #2980b9", padding: "8px" }}>Type Of Work</th>
                <th style={{ borderBottom: "2px solid #2980b9", padding: "8px" }}>Extra Activity</th>
                <th style={{ borderBottom: "2px solid #2980b9", padding: "8px" }}>Leave Type</th>
              </tr>
            </thead>
            <tbody>
              {parsedData.slice(0, 5).map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "#eaf2f8" : "white",
                  }}
                >
                  <td style={{ padding: "6px 8px" }}>{row.date}</td>
                  <td style={{ padding: "6px 8px" }}>{row.name}</td>
                  <td style={{ padding: "6px 8px" }}>{row.email}</td>
                  <td style={{ padding: "6px 8px", textAlign: "right" }}>{row.hours}</td>
                  <td style={{ padding: "6px 8px" }}>{row.project}</td>
                  <td style={{ padding: "6px 8px" }}>{row.workDone}</td>
                  <td style={{ padding: "6px 8px" }}>{row.typeOfWork}</td>
                  <td style={{ padding: "6px 8px" }}>{row.extraActivity}</td>
                  <td style={{ padding: "6px 8px" }}>{row.leaveType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TimesheetFileUpload;
