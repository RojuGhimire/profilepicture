import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import Spinner from "./spinner";

type UploadProps<T> = {
  imgTitle: string;
  fieldName: keyof T;
  existingImg?: string[];
  setForm?: React.Dispatch<React.SetStateAction<T>>;
  showImage?: boolean;
  noBaseUrl?: boolean;
  form?: any;
};

const Upload = <T,>({
  imgTitle,
  setForm,
  fieldName,
  existingImg,
  showImage = true,
  noBaseUrl,
  form,
}: UploadProps<T>) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoading(true);
    const { files } = event.target;
    if (files && files.length > 0) {
      const newFiles: File[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (isImageFile(file)) {
          if (file.size <= 2 * 1024 * 1024) {
            newFiles.push(file);
          } else {
            console.error("File size is too big");
            setLoading(false);
            return;
          }
        } else {
          console.error("Please select only image files");
          setLoading(false);
          return;
        }
      }

      if (setForm) {
        setForm((prevForm) => ({
          ...prevForm,
          [fieldName]: newFiles,
        }));
      }

      setFiles(newFiles);
      setLoading(false);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const isImageFile = (file: File): boolean => {
    return file.type.startsWith("image/");
  };

  return (
    <>
      <main className="flex h-full gap-5 flex-wrap">
        <div
          className="border border-dashed border-[#1475cf] min-h-[120px] min-w-[120px] max-h-[120px] max-w-[120px] cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <input
            type="file"
            name="file"
            id="file"
            accept="image/*"
            className="input-field"
            hidden
            ref={inputRef}
            onChange={handleFileChange}
            required
            multiple
          />
          <div className="flex flex-col justify-center items-center w-full h-full">
            {loading ? (
              <Spinner />
            ) : (
              
              <>
                <MdCloudUpload color="#1475cf" size={30} />
                <p className="text-[12px] text-center">(Max 2MB)</p>
              </>
            )}
          </div>
        </div>
        <AnimatePresence>
          {showImage && files.length > 0
            ? files.map((file, index) => (
                <motion.div
                  key={`${file.name}..${index}`}
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative flex items-center justify-center border-gray-200 border min-h-[120px] min-w-[120px] max-h-[120px] max-w-[120px] cursor-pointer"
                >
                  {file.type.startsWith("image/") && (
                    <img
                      src={URL.createObjectURL(file)}
                      className="object-cover w-full h-full p-1"
                      alt={file.name}
                    />
                  )}
                  {hoveredIndex === index && (
                    <MdDelete
                      className="absolute cursor-pointer text-gray-800 hover:text-red-600 transition duration-300"
                      size={20}
                      onClick={() => removeFile(index)}
                    />
                  )}
                </motion.div>
              ))
            : existingImg?.map((img, index) => (
                <img
                  key={index}
                  src={noBaseUrl ? `${img}` : `${baseImgUrl}/${img}`}
                  alt={imgTitle as string}
                  className="w-[120px] h-[120px] object-cover"
                />
              ))}
        </AnimatePresence>
      </main>
    </>
  );
};

export default Upload;
