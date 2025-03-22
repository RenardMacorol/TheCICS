import { useEffect, useState } from "react";
import { supabase } from '../../api/supabase';

interface Authors{
  authorID: number,
  firstName: string,
  lastName: string,
}

const ThesisUpload = () => {
//Nakaw ko lang tong code nato from ayato
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  //Form Field
  const [title, setTitle] = useState("")
  const [abstract, setAbstract] = useState("")
  const [publicationYear, setPublicationYear] = useState("")
  const [keywords, setKeywords] = useState("")
  //For Author Field
  const [authors, setAuthors] = useState<Authors[]>([])
  const [selectedAuthor, setSelectedAuthor] = useState<string>("")
  const [newAuthor, setNewAuthor] = useState<{firstName:string;lastName:string} | null>(null)

  useEffect(() => {
    const fetchAuthors = async () => {
      const {data, error }  = await supabase.from("Author").select("*")
      if(error){
        console.error("Error Fetching" , error)
      }else{

      console.log(data);
      setAuthors(data);
      }
    }

    fetchAuthors();

  }, [])

  const handleAuthorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedAuthor(value)
    if (value === "new"){
      setNewAuthor({firstName:"",lastName:""})
    }else {
      setNewAuthor(null)
    }
  }

  // Handle file selection and drag-drop
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
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
      .single()

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

      const randomThesisID = Math.floor(100 + Math.random() * 900)

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
        setUploading(false)
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
    <div className="flex items-center justify-center w-screen min-h-screen bg-blue-100">
      {/* Modal/Card Container */}
      <div className="w-full max-w-2xl bg-gray-200 shadow-xl rounded-lg p-6 border border-gray-400">
        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">UPLOAD Thesis File</h2>

         {/* Author Selection */}
         <label className="block mb-2">Select Author:</label>
        <select onChange={handleAuthorChange} value={selectedAuthor} className="w-full p-2 border rounded">
          <option value="" disabled>Select an Author</option>
          {authors.map((author) => (
            <option key={author.authorID} value={`${author.firstName} ${author.lastName}`}>
              {author.firstName} {author.lastName}
            </option>
          ))}
          <option value="new">Add New Author</option>
        </select>

        {/* New Author Form */}
        {newAuthor && (
          <div className="mt-2">
            <input
              type="text"
              placeholder="First Name"
              value={newAuthor.firstName}
              onChange={(e) => setNewAuthor((prev) => ({ ...prev!, firstName: e.target.value }))}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={newAuthor.lastName}
              onChange={(e) => setNewAuthor((prev) => ({ ...prev!, lastName: e.target.value }))}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
        {/*Form Inputs*/}
        <div className="mb-4">
          <input type="text"
          placeholder="Thesis Title"
          className="w-full p-2 border rounded mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)} 
          required /> 
          <textarea           
          placeholder="Abstract"
          className="w-full p-2 border rounded mb-2"
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          required /> 
          <input type="text"
          placeholder="Publication Year"
          className="w-full p-2 border rounded mb-2"
          value={publicationYear}
          onChange={(e) => setPublicationYear(e.target.value)} 
          required /> 
           <input
            type="text"
            placeholder="Keywords (comma-separated)"
            className="w-full p-2 border rounded mb-2"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            required 
            />
        </div>

        {/* Drag & Drop Area */}
        <label
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 bg-white p-6 rounded-lg cursor-pointer hover:bg-gray-300"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
            <h1>Upload</h1>
          <p className="text-gray-600">
            Drag & drop files or <span className="text-blue-600 font-semibold">Browse</span>
          </p>
          <input type="file" accept="application/pdf" multiple onChange={handleFileChange} className="hidden" />
        </label>

        {/* Upload Progress */}
        {uploading && progress !== null && (
          <div className="mt-4">
            <p className="text-sm text-gray-700">Uploading... {Math.round(progress)}%</p>
            <div className="w-full bg-gray-300 h-2 rounded">
              <div className="bg-blue-600 h-2 rounded" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {/* Uploaded Files List */}
        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="text-gray-700 font-medium mb-2">Uploaded</h3>
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-2 border rounded mb-2">
                <span className="text-gray-700 truncate">{file.name}</span>
                <button onClick={() => removeFile(index)} className="text-red-600 hover:text-red-800">
                    <h1>Basura</h1>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Message Display */}
        {message && (
          <p
            className={`mt-4 text-center font-medium p-2 rounded ${
              message.includes("❌") ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all disabled:bg-gray-400"
          disabled={uploading || files.length === 0}
        >
          {uploading ? "Uploading..." : "UPLOAD FILES"}
        </button>
      </div>
    </div>
  );
};

export default ThesisUpload;