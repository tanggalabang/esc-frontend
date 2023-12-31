'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useGetAllClassByTeacherQuery, useGetAllClassQuery, useGetAllSubjectByTeacherQuery, useGetAllSubjectQuery } from '@/redux/features/class-subject/classSubjectApi';
import { useCreateAssignmentMutation } from '@/redux/features/assignment/assignmentApi';

import React from 'react';
import { useCreateFilesMutation } from '@/redux/features/assignment/assignmentApi';
import UploadFiles from '@/components/upload-files/UploadFiles';
import toast from 'react-hot-toast';

import { useRouter } from 'next/router';
import RouteProtected from '@/components/route-protected/RouteProtected';

const DynamicJoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
});

const useReff = (initialValue: any) => {
  return useRef(initialValue);
};

const Add = () => {
  //EDITOR CONTENT
  //--main variable
  const [itemsAssignment, setItemsAssignment] = useState({
    uid: generateRandomString(20),
    name: '',
    class: '',
    subject: '',
    dueDate: '',
    content: null,
  });
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

  //HANDLE SUBMIT
  //--handel create content
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

  //handle create file
  const [createFiles, { isSuccess, error }] = useCreateFilesMutation({});

  const addItem = async (e: any) => {
    const formData = new FormData();

    files.forEach((file) => {
      // Append each image with a unique field name
      console.log('jumlah files');
      formData.append('files[]', file);
    });
    e.preventDefault();

    await createFiles({ data: formData, ass_uid: itemsAssignment.uid });
  };
  ///HANDLE SUBMIT
  const router = useRouter();
  useEffect(() => {
    if (successAs && isSuccess) {
      toast.success('Student add with excel successfully');
      router.push('/teacher/assignment');
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
      <RouteProtected userType={3} />
      <div className="flex flex-col gap-2.5 xl:flex-row">
        <div className="panel flex-1  py-6 ltr:xl:mr-6 rtl:xl:ml-6">
          <div>
            <label htmlFor="currency">Content</label>
            <DynamicJoditEditor value={contentReff.current} onChange={(newContent) => (contentReff.current = newContent)} />
          </div>

          <div className="mt-6">
            <label htmlFor="currency">Multiple File Upload</label>
            {/* <FileInput /> */}
            <UploadFiles fileRef={fileRef} handleFileDrop={handleFileDrop} files={files} handleFileDelete={handleFileDelete} setFiles={setFiles} />
          </div>
        </div>
        <div className=" mt-6 w-full xl:mt-0 xl:w-96">
          <div className="panel mb-5">
            <h5 className="mb-6 text-lg font-semibold dark:text-white-light">Your Work</h5>

            <div className="!table-responsive">
              <table className="table-hover text-left">
                <tr>
                  <th className="py-2">Name</th>
                  {/* <td>: {itemsAssignment?.name}</td> */}
                  <td>: Palestina Merdeka</td>
                </tr>
                <tr>
                  <th className="py-2">Autor</th>
                  {/* <td>: {itemsAssignment?.name}</td> */}
                  <td>: Tesar R M</td>
                </tr>
                <tr>
                  <th className="py-2">Class</th>
                  {/* <td>: {itemsAssignment?.class}</td> */}
                  <td>: Palestina Merdeka</td>
                </tr>
                <tr>
                  <th className="py-2">Subject</th>
                  {/* <td>: {itemsAssignment?.subject}</td> */}
                  <td>: Palestina Merdeka</td>
                </tr>
                <tr>
                  <th className="py-2">Due Date</th>
                  {/* <td>: {itemsAssignment?.dueDate}</td> */}
                  <td>: Palestina Merdeka</td>
                </tr>
              </table>
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
                Send
              </button>
            </div>
          </div>
          <div className="panel mt-5">
            <div className="mx-auto flex h-[70px] w-[70px] flex-col justify-center rounded-full border border-white-light shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] dark:border-[#1b2e4b] sm:h-[100px] sm:w-[100px]">
              <span className="text-center text-[30px] text-success">100</span>
            </div>
            <div className="mt-5 rounded-md border border-white-light bg-white px-6 py-3.5 text-center dark:border-dark dark:bg-[#1b2e4b] md:flex-row ltr:md:text-left rtl:md:text-right">
              <div className="mx-auto text-center font-bold">Comentar from Teacher</div>
              <hr className="mb-3 mt-2" />
              <p className="text-justify">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, beatae. Fuga perferendis aliquam a distinctio eligendi consequatur consequuntur recusandae quibusdam eius placeat eum
                ratione omnis, repudiandae dolores labore! Culpa, nesciunt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Add;
