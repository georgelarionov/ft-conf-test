import { UIIcon } from 'components/UI/UIIcon/UIIcon';

import s from './styles.module.css';
import { useEffect } from "react";

export const DownloadLink = ({ className = '', url, format, children }) => {

  console.log(`createObjectURL video url ${format}`)
  const urlBlob = URL.createObjectURL(url);

  useEffect(()=> {

      return ()=>{
          console.log("Cleanup/Revoke useEffect: video url");
          URL.revokeObjectURL(url);
      };
  });

  return (
    <a
      className={`${s.link} ${className}`}
      href={urlBlob}
      download={'video' + `.${format}`}
      onClick={()=>{
        console.log("Cleanup/Revoke: video url");
        URL.revokeObjectURL(url);
      }}
    >
      {children}
      <UIIcon icon="download" />
    </a>
  );
};
