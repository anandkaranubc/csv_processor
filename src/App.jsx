import React, { useState } from 'react';
import Papa from 'papaparse';

function App() {
  const [csvData, setCsvData] = useState(null);

  // Handle file upload and parse CSV
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      complete: (result) => {
        processCSVData(result.data);
      },
      header: true
    });
  };

  // Process the CSV data to map mentors and their mentees
  const processCSVData = (data) => {
    const mentorMap = {};

    data.forEach((row) => {
      for (let i = 1; i <= 5; i++) {
        const mentorID = row[`${i}_ID`];
        if (mentorID) {
          if (!mentorMap[mentorID]) mentorMap[mentorID] = [];
          mentorMap[mentorID].push({
            name: `${row.first} ${row.last}`,
            uroNumber: row.uro_number,
            description: row[`${i}_answer`]
          });
        }
      }
    });

    generateOutputCSV(mentorMap);
  };

  // Generate the output CSV structure
  const generateOutputCSV = (mentorMap) => {
    const outputData = [];

    Object.keys(mentorMap).forEach((mentorID) => {
      const applicants = mentorMap[mentorID];
      const mentorRow = {
        mentorID,
        // You can include mentor's details if available
        // mentorName: 'Mentor Name Here',
        // mentorEmail: 'Mentor Email Here',
      };

      applicants.forEach((applicant, index) => {
        mentorRow[`app_${index + 1}_name`] = applicant.name;
        mentorRow[`app_${index + 1}_uro`] = applicant.uroNumber;
        mentorRow[`app_${index + 1}_description`] = applicant.description;
      });

      outputData.push(mentorRow);
    });

    const csv = Papa.unparse(outputData);
    setCsvData(csv);
  };

  // Download the processed CSV file
  const downloadCSV = () => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'processed_output.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Mentor-Mentee CSV Processor</h1>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="mt-4 border rounded p-2 w-full"
        />
        {csvData && (
          <button
            onClick={downloadCSV}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Download Processed CSV
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
