'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useGetAllClassByTeacherQuery, useGetAllSubjectByTeacherQuery } from '@/redux/features/class-subject/classSubjectApi';
import { useEditFilesMutation, useGetAllFilesQuery } from '@/redux/features/assignment/assignmentApi';

import React from 'react';
import UploadFiles from '@/components/upload-files/UploadFiles';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useEditMaterialMutation, useGetAllMaterialQuery } from '@/redux/features/material/materialApi';
import SingleImageUpload from '@/components/single-image-upload/SingleImageUpload';

import RouteProtected from '@/components/route-protected/RouteProtected';

const DynamicJoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
});

const useReff = (initialValue: any) => {
  return useRef(initialValue);
};

const Edit = () => {
  //--get id from url
  const router = useRouter();
  const { id } = router.query;

  //SHOW
  //--get assignment by id url
  const { isLoading, data, refetch } = useGetAllMaterialQuery({}, { refetchOnMountOrArgChange: true });

  const showData = data && data.find((i: any) => i.uid === id);

  //--get file assignment by id url
  const { isLoading: loadingFile, data: dataFile, refetch: refetchFile } = useGetAllFilesQuery({}, { refetchOnMountOrArgChange: true });

  const assUidToFilter = id;
  const showDataFile = dataFile?.filter((item: any) => item.ass_uid === assUidToFilter);

  //--use data to itemsAssignment
  useEffect(() => {
    if (showData) {
      setItemsAssignment({
        uid: showData.uid,
        name: showData.name,
        class: showData.class_name,
        subject: showData.subject_name,
        content: showData.content,
        image: null,
      });
    }
  }, [showData]);
  ///SHOW

  //EDITOR CONTENT
  //--main variable
  const [itemsAssignment, setItemsAssignment] = useState({
    uid: generateRandomString(20),
    name: '',
    class: '',
    subject: '',
    content: '',
    image: null as File | null,
  });
  // varible for thumbnail
  const [images, setImages] = useState<any>([]);

  //----for content
  const contentReff = useReff('');

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

  //--get data subject and class
  const { data: dataSubjects } = useGetAllSubjectByTeacherQuery({});
  const { data: dataClasses } = useGetAllClassByTeacherQuery({});
  ///EDITOR CONTENT

  //FILES
  //--files variable
  const [files, setFiles] = useState<Array<File>>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  //--function file drop
  function handleFileDrop(event: React.ChangeEvent<HTMLInputElement>) {
    const uploadedFiles = (event.target as HTMLInputElement).files;
    const newFiles = Object.entries(uploadedFiles as object)
      .map((file) => {
        if (file[1]) return file[1];
      })
      .filter((file) => file !== undefined);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }

  //-- handle image drop
  function handleFileDelete(index: number) {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    (fileRef.current as HTMLInputElement).value = '';
  }
  //FILES
  console.log(files);

  //HANDLE SUBMIT
  //--handel create content
  const [editMaterial, { isSuccess: successAs, error: errorAs }] = useEditMaterialMutation();

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
      image: images[0].file,
    };

    const formData = new FormData();
    formData.append('uid', updatedAssignment.uid);
    formData.append('name', updatedAssignment.name);
    formData.append('class', updatedAssignment.class);
    formData.append('subject', updatedAssignment.subject);
    formData.append('content', updatedAssignment.content);

    if (updatedAssignment.image) {
      console.log('bambang');
      formData.append('image', updatedAssignment.image);
    }

    // Menunggu pembaruan state content selesai
    await setContent(updatedContent);
    // Kemudian, memanggil createAssignment dengan objek assignment yang diperbarui
    await editMaterial(formData);

    addItem(e);
  };

  //handle create file
  const [editFiles, { isSuccess, error }] = useEditFilesMutation({});

  const addItem = async (e: any) => {
    const formData = new FormData();

    files.forEach((file) => {
      // Append each image with a unique field name
      console.log('jumlah files');
      formData.append('files[]', file);
    });
    e.preventDefault();

    await editFiles({ data: formData, ass_uid: itemsAssignment.uid });
  };
  ///HANDLE SUBMIT
  useEffect(() => {
    if (successAs && isSuccess) {
      toast.success('Student add with excel successfully');
      router.push('/teacher/material');
    }
  }, [successAs, isSuccess]);
  useEffect(() => {
    if (errorAs) {
      toast.error('name, class, subject, or content can not be empty!');
    }
  }, [errorAs]);
  useEffect(() => {
    if (error) {
      if ('data' in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.error);
      }
    }
  }, [error]);

  return (
    <>
      <RouteProtected userType={2} />
      <div className="flex flex-col gap-2.5 xl:flex-row">
        <div className="panel flex-1  py-6 ltr:xl:mr-6 rtl:xl:ml-6">
          <div>
            <label htmlFor="currency">Content</label>
            <DynamicJoditEditor value={itemsAssignment.content} onChange={(newContent) => (contentReff.current = newContent)} />
          </div>

          <div className="mt-6">
            <label htmlFor="currency">Multiple File Upload</label>
            <UploadFiles fileRef={fileRef} handleFileDrop={handleFileDrop} files={files} handleFileDelete={handleFileDelete} setFiles={setFiles} />
          </div>
        </div>
        {/* right */}
        <div className=" mt-6 w-full xl:mt-0 xl:w-96">
          <div className="panel mb-5">
            <h5 className="mb-6 text-lg font-semibold dark:text-white-light">Material Edit</h5>
            <SingleImageUpload images={images} setImages={setImages} />
            <div>
              <div>
                <label htmlFor="shipping-charge">Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="form-input"
                  value={itemsAssignment.name}
                  onChange={(e: any) => setItemsAssignment({ ...itemsAssignment, name: e.target.value })}
                  placeholder="Enter Name"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="currency">Class</label>
              <select required className="form-select" value={itemsAssignment.class} onChange={(e: any) => setItemsAssignment({ ...itemsAssignment, class: e.target.value })}>
                <option value="">Select Class</option>
                {dataClasses?.map((item: any) => (
                  <option value={item.name} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label htmlFor="currency">Subject</label>
              <select required className="form-select" value={itemsAssignment.subject} onChange={(e: any) => setItemsAssignment({ ...itemsAssignment, subject: e.target.value })}>
                <option value="">Select Subject</option>
                {dataSubjects?.map((item: any) => (
                  <option value={item.name} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;
