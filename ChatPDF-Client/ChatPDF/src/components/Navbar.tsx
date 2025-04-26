import logo from "../assets/logo.png";
import pdfupload from "../assets/pdf-upload.svg";
import z from "zod";
import React, { useState } from "react";
import Loader from "./Loader";
import FilenameIcon from "../assets/filename-icon.svg";

interface NavbarProps {
  getDocId: (docId: string) => void;
}

const Navbar = ({ getDocId }: NavbarProps) => {
  const [loading, setLoading] = useState(false);
  const [filename, setFileName] = useState("");

  const pdfSchema = z.object({
    pdfFile: z
      .instanceof(File)
      .refine((file) => file.type === "application/pdf", "Only PDF is allowed")
      .refine((file) => file.size <= 5 * 1024 * 1024, "Max 5MB size"),
  });

  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("pdfFile", file);

      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const doc_id = data.document_id;

      setFileName(data.filename);
      getDocId(doc_id);

      if (!response) {
        alert("Upload Failed");
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      pdfSchema.parse({ pdfFile: file });
      handleFileUpload(file);
    } catch (e) {
      if (e instanceof z.ZodError) {
        alert(e.errors[0].message);
      }
    }
  };

  return (
    <>
      <nav className="flex justify-between items-center h-[77px] w-full px-12 py-2 shadow-lg">
        <div>
          <img src={logo} alt="logo" />
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="flex gap-6 items-center">
            {filename !== "" ? (
              <div className="flex items-center gap-2 text-green-500">
                <img
                  className="h[32px] w-[32px]"
                  src={FilenameIcon}
                  alt="filename-icon"
                />
                <p>{filename}</p>
              </div>
            ) : (
              ""
            )}

            <input
              type="file"
              onChange={handleChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center gap-2 font-semibold px-4 py-2 border-2 rounded-md cursor-pointer"
            >
              <img
                src={pdfupload}
                alt="pdf-upload"
                className="w-[24px] h-[24px]"
              />
              <span>Upload PDF</span>
            </label>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
