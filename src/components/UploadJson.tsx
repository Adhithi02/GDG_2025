import React from 'react';

type Props = {
  onImport: (data: any[]) => void;
};

const UploadJson: React.FC<Props> = ({ onImport }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const json = JSON.parse(result);
        onImport(json); // Push it to dashboard state
      } catch (err) {
        alert("Invalid JSON file.");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" accept=".json" onChange={handleFileChange} />
    </div>
  );
};

export default UploadJson;
