import { useEffect, useState } from "react";
import { supabase } from '../../api/supabase';
import { Trash2, Upload, FileText, UserPlus } from 'lucide-react';

interface Authors {
  authorID: number,
  firstName: string,
  lastName: string,
}

const ThesisUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  // Form Field
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [keywords, setKeywords] = useState("");
  
  // For Author Field
  const [authors, setAuthors] = useState<Authors[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [newAuthor, setNewAuthor] = useState<{firstName:string;lastName:string} | null>(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      const {data, error} = await supabase.from("Author").select("*");
      if(error) {
        console.error("Error Fetching", error);
      } else {
        console.log(data);
        setAuthors(data);
      }
    }

    fetchAuthors();
  }, []);

  const handleAuthorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedAuthor(value);
    if (value === "new") {
      setNewAuthor({firstName:"", lastName:""});
    } else {
      setNewAuthor(null);
    }
  }

  // Handle file selection and drag-drop
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // Handle file upload
  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage("❌ Please select a file.");
      return;
    }

    setUploading(true);
    setProgress(0);
    setMessage("");

    let finalAuthorID: number | null;

    // Insert new author if needed
    if (newAuthor) {
      const { data, error } = await supabase
        .from("Author")
        .insert([{ firstName: newAuthor.firstName, lastName: newAuthor.lastName }])
        .select("authorID")
        .single();

      if (error) {
        setMessage(`❌ Error adding new author: ${error.message}`);
        setUploading(false);
        return;
      }
      finalAuthorID = data?.authorID;
    } else {
      finalAuthorID = parseInt(selectedAuthor);
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `thesis/${fileName}`;

      // Upload to Supabase Storage
      const { error } = await supabase.storage.from("thesis-storage").upload(filePath, file);
      if (error) {
        setMessage(`❌ Error uploading: ${error.message}`);
        setUploading(false);
        return;
      }

      // Get public URL
      const { data: fileData } = supabase.storage.from("thesis-storage").getPublicUrl(filePath);

      // Get logged-in user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage("❌ You must be logged in to upload.");
        setUploading(false);
        return;
      }

      const randomThesisID = Math.floor(100 + Math.random() * 900);

      // Save file info to database
      const { error: insertError } = await supabase.from("Thesis").insert([
        {
          thesisID: randomThesisID,
          authorID: finalAuthorID,
          title,
          abstract,
          publicationYear,
          keywords,
          pdfFileUrl: fileData.publicUrl,
          status: "Active"
        },
      ]);

      if (insertError) {
        setMessage(`❌ Database error: ${insertError.message}`);
        setUploading(false);
        return;
      }
      setProgress(((i + 1) / files.length) * 100);
    }

    setUploading(false);
    setFiles([]); // Clear file list
    setTitle("");
    setAbstract("");
    setPublicationYear("");
    setKeywords("");
    setMessage("✅ File uploaded successfully!");
  };

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="bg-black p-5 -m-6 mb-6 text-center">
        <h3 className="text-xl font-medium text-white">Upload New Thesis</h3>
        <p className="text-white text-sm mt-1">Complete all fields and upload your thesis document</p>
      </div>

      {/* Author Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Author
        </label>
        <select 
          onChange={handleAuthorChange} 
          value={selectedAuthor} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06B8BE]/30 focus:border-[#06B8BE]"
        >
          <option value="" disabled>Select an Author</option>
          {authors.map((author) => (
            <option key={author.authorID} value={author.authorID}>
              {author.firstName} {author.lastName}
            </option>
          ))}
          <option value="new">Add New Author</option>
        </select>
      </div>

      {/* New Author Form */}
      {newAuthor && (
        <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h4 className="flex items-center text-gray-800 font-medium mb-3">
            <UserPlus className="w-4 h-4 mr-2 text-[#06B8BE]" />
            New Author Details
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="First Name"
                value={newAuthor.firstName}
                onChange={(e) => setNewAuthor((prev) => ({ ...prev!, firstName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06B8BE]/30 focus:border-[#06B8BE]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Last Name"
                value={newAuthor.lastName}
                onChange={(e) => setNewAuthor((prev) => ({ ...prev!, lastName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06B8BE]/30 focus:border-[#06B8BE]"
              />
            </div>
          </div>
        </div>
      )}

     {/* Form Inputs */}
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Thesis Title
        </label>
        <input 
          type="text"
          placeholder="Enter the complete thesis title"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06B8BE]/30 focus:border-[#06B8BE]"
          value={title}
          onChange={(e) => setTitle(e.target.value)} 
          required 
        /> 
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Abstract
        </label>
        <textarea           
          placeholder="Brief summary of the thesis"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06B8BE]/30 focus:border-[#06B8BE] min-h-[150px] resize-none"
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          required 
        /> 
      </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publication Year
            </label>
            <input 
              type="text"
              placeholder="YYYY"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06B8BE]/30 focus:border-[#06B8BE]"
              value={publicationYear}
              onChange={(e) => setPublicationYear(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keywords
            </label>
            <input
              type="text"
              placeholder="Comma-separated keywords"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06B8BE]/30 focus:border-[#06B8BE]"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              required 
            />
          </div>
        </div>

        {/* Drag & Drop Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thesis Document (PDF)
          </label>
          <div
            className="border-2 border-dashed border-gray-300 bg-gray-50 p-6 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors text-center"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('thesis-file')?.click()}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 mb-2 bg-[#06B8BE]/10 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#06B8BE]" />
              </div>
              <p className="text-gray-800 font-medium">
                Drag & drop PDF file here
              </p>
              <p className="text-gray-500 text-sm mt-1">
                or <span className="text-[#06B8BE] underline">browse files</span>
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Supports PDF files up to 10MB
              </p>
            </div>
            <input 
              id="thesis-file" 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </div>
        </div>

        {/* Upload Progress */}
        {uploading && progress !== null && (
          <div className="my-4">
            <div className="flex justify-between text-sm text-gray-700 mb-1">
              <span>Uploading...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#06B8BE] h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Uploaded Files List */}
        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files</h3>
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 border border-gray-200 rounded-lg mb-2">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-[#06B8BE] mr-2" />
                  <span className="text-gray-800 truncate max-w-[300px]">
                    {file.name}
                  </span>
                  <span className="text-gray-500 text-xs ml-2">
                    ({(file.size / 1024).toFixed(0)} KB)
                  </span>
                </div>
                <button 
                  onClick={() => removeFile(index)} 
                  className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                  aria-label="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-center font-medium ${
              message.includes("❌") 
                ? "bg-red-50 text-red-600 border border-red-200" 
                : "bg-green-50 text-green-600 border border-green-200"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Footer buttons */}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={handleUpload}
          className="bg-[#06B8BE] hover:bg-[#05a3a8] text-white px-6 py-2 rounded-md flex items-center space-x-2 transition-colors" 
          disabled={uploading || files.length === 0}
        >
          {uploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Upload Thesis</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ThesisUpload;