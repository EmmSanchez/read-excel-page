import React, { createContext, useState } from 'react';

interface FileContextType {
  file: File | null;
  setFile: (file: File | null) => void;
}


export const FileContext = createContext<FileContextType | null>(null);

interface FileProviderProps {
  children: React.ReactNode;
}

export const FileProvider: React.FC<FileProviderProps> = ({ children}) => {
  const [file, setFile] = useState<File | null>(null);
  
  return (
    <FileContext.Provider value={{ file, setFile }}>
      {children}
    </FileContext.Provider>
  );
};
