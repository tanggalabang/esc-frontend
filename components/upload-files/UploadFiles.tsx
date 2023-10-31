import React, { FC, Fragment, useState } from 'react';
import Upload from '@/components/ui/upload';
import { Text } from '@/components/ui/text';
import SimpleBar from '@/components/ui/simplebar';
import Image from 'next/image';
import { PiFile, PiFileCsv, PiFileDoc, PiFilePdf, PiFileXls, PiFileZip, PiTrashBold, PiXBold, PiFileAudio, PiFileVideo, PiFileXlsFill } from 'react-icons/pi';
import cn from '@/utils/class-names';

type Props = {
  fileRef: any;
  handleFileDrop: any;
  handleFileDelete: any;
  files: any;
  setFiles: any;
};

// const UploadFiles = (props: Props) => {
const UploadFiles: FC<Props> = ({ fileRef, handleFileDrop, files, handleFileDelete, setFiles }) => {
  const fileType = {
    'text/csv': <PiFileCsv className="h-5 w-5" />,
    'text/plain': <PiFile className="h-5 w-5" />,
    'application/pdf': <PiFilePdf className="h-5 w-5" />,
    'application/xml': <PiFileXls className="h-5 w-5" />,
    'application/zip': <PiFileZip className="h-5 w-5" />,
    'application/gzip': <PiFileZip className="h-5 w-5" />,
    'application/msword': <PiFileDoc className="h-5 w-5" />,
    'audio/mpeg': <PiFileAudio className="h-5 w-5" />, // Icon jfor mp3 files
    'video/mp4': <PiFileVideo className="h-5 w-5" />, // Icon for mp4 files
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': <PiFileXls className="h-5 w-5" />, // Icon for XLSX (Excel) files
    // 'application/vnd.ms-excel': <PiFileXls className="h-5 w-5" />, // Icon for Excel files
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': <PiFileDoc className="h-5 w-5" />, // Icon for Word files
  } as { [key: string]: React.ReactElement };
  return (
    <div>
      {/* upload drop zone */}
      <Upload ref={fileRef} accept={'all'} multiple={true} onChange={(event) => handleFileDrop(event)} className="mb-6 min-h-[280px] justify-center border-dashed bg-gray-50 dark:bg-transparent" />
      {/* !upload drop zone */}

      {/* show files */}
      {files.length > 1 ? <Text className="mb-2 text-gray-500">{files.length} files</Text> : null}

      {files.length > 0 && (
        <SimpleBar className="max-h-[280px]">
          <div className="grid grid-cols-1 gap-4">
            {files?.map((file: File, index: number) => (
              <div className="flex min-h-[58px] w-full items-center rounded-xl border border-gray-200 px-3 dark:border-gray-300" key={file.name}>
                <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50 object-cover px-2 py-1.5 dark:bg-transparent">
                  {file.type.includes('image') ? (
                    <Image src={URL.createObjectURL(file)} fill className=" object-contain" priority alt={file.name} sizes="(max-width: 768px) 100vw" />
                  ) : (
                    // <>{fileType[file.type]}</>
                    <>{fileType[file.type] || <PiFile className="h-5 w-5" />}</> // Menggunakan objek fileTypeIcons atau ikon default PiFile
                  )}
                </div>
                <div className="truncate px-2.5">{file.name}</div>
                <button type="button" className="ms-auto flex hover:text-danger" onClick={() => handleFileDelete(index)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                    <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                    <path
                      d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    ></path>
                    <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                    <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                    <path
                      opacity="0.5"
                      d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    ></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </SimpleBar>
      )}
      {/* !show files */}

      {/* button bottom */}
      <div className="mt-4 flex justify-end gap-3">
        <button className={cn(!files.length && 'hidden', 'btn btn-outline-danger w-full')} onClick={() => setFiles([])}>
          Reset
        </button>
        {/* <button className="btn btn-primary w-full" onClick={addItem}>
                <PiArrowLineDownBold className="me-1.5 h-[17px] w-[17px]" />
                Upload File
              </button> */}
      </div>
      {/* !button bottom */}
    </div>
  );
};

export default UploadFiles;
