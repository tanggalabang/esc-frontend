'use client';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import dynamic from 'next/dynamic';
import { useGetAllClassQuery, useGetAllSubjectQuery } from '@/redux/features/class-subject/classSubjectApi';
import { useCreateAssignmentMutation } from '@/redux/features/assignment/assignmentApi';

import React from 'react';
import Image from 'next/image';
import cn from '@/utils/class-names';
import { PiArrowLineDownBold, PiFile, PiFileCsv, PiFileDoc, PiFilePdf, PiFileXls, PiFileZip, PiTrashBold, PiXBold, PiFileAudio, PiFileVideo, PiFileXlsFill } from 'react-icons/pi';
import { Text } from '@/components/ui/text';
import Upload from '@/components/ui/upload';
import { useModal } from '@/components/shared/modal-views/use-modal';
import SimpleBar from '@/components/ui/simplebar';
import { toast } from 'react-hot-toast';
import { useCreateFilesMutation } from '@/redux/features/assignment/assignmentApi';

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
const DynamicJoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
});

const useReff = (initialValue: any) => {
  return useRef(initialValue);
};
const Add = () => {
  //--main variable
  const [itemsAssignment, setItemsAssignment] = useState({
    uid: generateRandomString(20),
    name: '',
    class: '',
    subject: '',
    dueDate: '',
    content: null,
  });

  //--function random
  function generateRandomString(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  const editor = useRef(null);
  const contentReff = useReff('');

  useEffect(() => {
    console.log(itemsAssignment);
  }, [itemsAssignment]);

  //--get data subject and class
  const { data: dataSubjects } = useGetAllSubjectQuery({});
  const { data: dataClasses } = useGetAllClassQuery({});

  //--handel create
  const [createAssignment, { isSuccess: successAs, error: errorAs }] = useCreateAssignmentMutation();

  const [content, setContent] = useState(contentReff.current);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Mengambil nilai terbaru dari contentReff.current
    const updatedContent = contentReff.current;

    // Menetapkan nilai baru ke dalam state content
    setContent(updatedContent);

    // Membuat objek assignment dengan nilai terbaru content
    const updatedAssignment = {
      ...itemsAssignment,
      content: updatedContent,
    };

    // Menunggu pembaruan state content selesai
    await setContent(updatedContent);

    // Kemudian, memanggil createAssignment dengan objek assignment yang diperbarui
    await createAssignment(updatedAssignment);

    addItem(e);
  };

  //=============
  const { closeModal } = useModal();
  const [files, setFiles] = useState<Array<File>>([]);
  const imageRef = useRef<HTMLInputElement>(null);

  function handleFileDrop(event: React.ChangeEvent<HTMLInputElement>) {
    const uploadedFiles = (event.target as HTMLInputElement).files;
    const newFiles = Object.entries(uploadedFiles as object)
      .map((file) => {
        if (file[1]) return file[1];
      })
      .filter((file) => file !== undefined);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }

  function handleImageDelete(index: number) {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    (imageRef.current as HTMLInputElement).value = '';
  }

  function handleFileUpload() {
    if (files.length) {
      console.log('uploaded files:', files);
      toast.success(<Text as="b">File successfully added</Text>);

      setTimeout(() => {
        closeModal();
      }, 200);
    } else {
      toast.error(<Text as="b">Please drop your file</Text>);
    }
  }

  const [createFiles, { isSuccess, error }] = useCreateFilesMutation({});
  console.log(files);

  //handle add

  const addItem = async (e: any) => {
    const formData = new FormData();

    files.forEach((file) => {
      // Append each image with a unique field name
      console.log('jumlah files');
      formData.append('files[]', file);
    });
    e.preventDefault();

    console.log(formData);

    await createFiles({ data: formData, ass_uid: itemsAssignment.uid });
  };

  return (
    <div className="flex flex-col gap-2.5 xl:flex-row">
      <div className="panel flex-1  py-6 ltr:xl:mr-6 rtl:xl:ml-6">
        <div>
          <label htmlFor="currency">Content</label>
          <DynamicJoditEditor ref={editor} value={contentReff.current} onChange={(newContent) => (contentReff.current = newContent)} />
        </div>
        <div className="mt-6">
          <label htmlFor="currency">Multiple File Upload</label>
          {/* <FileInput /> */}
          <div>
            {/* upload drop zone */}
            <Upload
              ref={imageRef}
              accept={'all'}
              multiple={true}
              onChange={(event) => handleFileDrop(event)}
              className="mb-6 min-h-[280px] justify-center border-dashed bg-gray-50 dark:bg-transparent"
            />
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
                      <button type="button" className="ms-auto flex hover:text-danger" onClick={() => handleImageDelete(index)}>
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
        </div>
      </div>
      <div className=" mt-6 w-full xl:mt-0 xl:w-96">
        <div className="panel mb-5">
          <div>
            <div>
              <label htmlFor="shipping-charge">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                className="form-input"
                defaultValue={itemsAssignment.name}
                onChange={(e: any) => setItemsAssignment({ ...itemsAssignment, name: e.target.value })}
                placeholder="Enter Name"
              />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="currency">Class</label>
            <select required className="form-select" onChange={(e: any) => setItemsAssignment({ ...itemsAssignment, subject: e.target.value })}>
              <option value="">Select Subject</option>
              {dataSubjects?.map((item: any) => (
                <option value={item.name} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <label htmlFor="currency">Subject</label>
            <select required className="form-select" onChange={(e: any) => setItemsAssignment({ ...itemsAssignment, class: e.target.value })}>
              <option value="">Select Class</option>
              {dataClasses?.map((item: any) => (
                <option value={item.name} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <label htmlFor="tax">Due Date</label>
            <input id="tax" type="datetime-local" name="tax" className="form-input" onChange={(e: any) => setItemsAssignment({ ...itemsAssignment, dueDate: e.target.value })} />
          </div>
        </div>
        <div className="panel">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-1">
            <button type="button" onClick={handleSubmit} className="btn btn-primary w-full gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                <path
                  d="M3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 11.6585 22 11.4878 21.9848 11.3142C21.9142 10.5049 21.586 9.71257 21.0637 9.09034C20.9516 8.95687 20.828 8.83317 20.5806 8.58578L15.4142 3.41944C15.1668 3.17206 15.0431 3.04835 14.9097 2.93631C14.2874 2.414 13.4951 2.08581 12.6858 2.01515C12.5122 2 12.3415 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M17 22V21C17 19.1144 17 18.1716 16.4142 17.5858C15.8284 17 14.8856 17 13 17H11C9.11438 17 8.17157 17 7.58579 17.5858C7 18.1716 7 19.1144 7 21V22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path opacity="0.5" d="M7 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Save
            </button>

            {/* <button  className="btn btn-primary w-full gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ltr:mr-2 rtl:ml-2">
                <path
                  opacity="0.5"
                  d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Preview
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
