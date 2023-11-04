'use client';
import HTMLReactParser from 'html-react-parser';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useGetAllClassByTeacherQuery, useGetAllClassQuery, useGetAllSubjectByTeacherQuery, useGetAllSubjectQuery } from '@/redux/features/class-subject/classSubjectApi';
import { useCreateAssignmentMutation, useGetAllAssignmentQuery, useGetAllFilesQuery } from '@/redux/features/assignment/assignmentApi';

import React from 'react';
import { useCreateFilesMutation } from '@/redux/features/assignment/assignmentApi';
import UploadFiles from '@/components/upload-files/UploadFiles';
import toast from 'react-hot-toast';

import { useRouter } from 'next/router';
import RouteProtected from '@/components/route-protected/RouteProtected';
import { useAuth } from '@/pages/hooks/auth';
import { useAddScoreStudentWorkMutation, useCreateStudentWorkMutation, useGetAllStudentWorkQuery } from '@/redux/features/student-work/studentWorkApi';
import Link from 'next/link';
import FileShow from '@/components/files/FileShow';
import { useGetAllStudentWithWorkQuery } from '@/redux/features/student/studentApi';

const DynamicJoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
});

const useReff = (initialValue: any) => {
  return useRef(initialValue);
};

const Add = () => {
  //--get id from url
  const router = useRouter();
  const { id } = router.query;

  //SHOW
  //--get file assignment by id url
  const { isLoading: loadingFile, data: dataFile, refetch: refetchFile } = useGetAllFilesQuery({}, { refetchOnMountOrArgChange: true });

  //--get student work
  const { data: dataStudentWork, isLoading: loadingWork } = useGetAllStudentWorkQuery({}, { refetchOnMountOrArgChange: true });
  //--find by id
  const dataStudentWorkById = dataStudentWork?.find((work: any) => work?.uid === id);

  //--show file
  const showDataFile = dataFile?.filter((item: any) => item.ass_uid === dataStudentWorkById?.uid);

  //--get all assingment by id on student work
  const { isLoading, data, refetch } = useGetAllAssignmentQuery({}, { refetchOnMountOrArgChange: true });

  const showData = data && data.find((i: any) => i.uid === dataStudentWorkById?.ass_id);

  //--get student with work
  const { data: dataStudentWithWork } = useGetAllStudentWithWorkQuery({}, { refetchOnMountOrArgChange: true });

  const studentsWithWork = dataStudentWithWork && dataStudentWithWork.find((i: any) => i.id === dataStudentWorkById?.student_id);

  //late or not
  const [lateOrNot, setLateOrNot] = useState('');

  // if (dataStudentWorkById && showData) {
  //   if (dataStudentWorkById?.created_at <= showData?.created_at) {
  //     setLateOrNot('On Time');
  //   } else {
  //     setLateOrNot('Late');
  //   }
  // }
  useEffect(() => {
    // Pastikan dataStudentWorkById dan showData ada sebelum membandingkan
    if (dataStudentWorkById?.created_at && showData?.created_at) {
      const dataStudentCreatedAt = dataStudentWorkById.created_at;
      const showDataCreatedAt = showData.created_at;

      // Lakukan perbandingan
      if (dataStudentCreatedAt <= showDataCreatedAt) {
        setLateOrNot('On time');
      } else {
        setLateOrNot('Late');
      }
    }
  }, [dataStudentWorkById, showData]);

  //SHOW

  const goBack = () => {
    router.back();
  };

  //--set data
  useEffect(() => {
    setItemsResult({
      score: dataStudentWorkById?.score,
      comment: dataStudentWorkById?.comment,
    });
  }, [dataStudentWorkById]);

  const [itemsResult, setItemsResult] = useState({
    score: null,
    comment: null,
  });

  const [addScoreStudentWork, { isSuccess, error }] = useAddScoreStudentWorkMutation();

  const handleSubmit = () => {
    console.log(itemsResult);
    addScoreStudentWork({ data: itemsResult, id });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Score Added');
    }
    if (error) {
      if ('data' in error) {
        const errorMessage = error as any;
        toast.error('Score can not be empty');
      }
    }
  }, [isSuccess, error]);

  return (
    <>
      <RouteProtected userType={2} />

      {loadingWork ? (
        <div className="flex items-center justify-center">
          <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 xl:flex-row">
          <div className="panel flex-1 !px-10 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
            <>
              {/* content */}
              <div className="mb-6">
                <h5 className="mb-6 text-lg font-semibold dark:text-white-light">Content</h5>
                {dataStudentWorkById?.content && <div>{HTMLReactParser(dataStudentWorkById?.content)}</div>}
              </div>

              <hr />
              {/* file upload */}
              <div className="mb-6 mt-10">
                <FileShow showDataFile={showDataFile} />
              </div>
            </>
          </div>

          <div className=" mt-6 w-full xl:mt-0 xl:w-96">
            <div className="panel mb-5 ">
              <h5 className="mb-6 text-lg font-semibold dark:text-white-light">Your Work</h5>

              <div className="!table-responsive">
                <table className="table-hover text-left">
                  <tr>
                    <th className="py-1 text-white-dark">Status</th>
                    <td>: {lateOrNot}</td>
                  </tr>
                  <tr>
                    <th className="py-1 text-white-dark">Assigment</th>
                    <td>: {showData?.name}</td>
                  </tr>
                  <tr>
                    <th className="py-1 text-white-dark">Name</th>
                    <td>: {studentsWithWork?.name}</td>
                  </tr>
                  <tr>
                    <th className="py-1 text-white-dark">Class</th>
                    <td>: {showData?.class_name}</td>
                  </tr>
                  <tr>
                    <th className="py-1 text-white-dark">Subject</th>
                    <td>: {showData?.subject_name}</td>
                  </tr>
                </table>
              </div>
            </div>

            <div className="panel mt-5">
              <div className="mx-auto flex h-[70px] w-[70px] flex-col justify-center rounded-full border border-white-light shadow-[1px_2px_12px_0_rgba(31,45,61,0.10)] dark:border-[#1b2e4b] sm:h-[100px] sm:w-[100px]">
                <input
                  value={itemsResult?.score}
                  onChange={(
                    e: any //mengupdate perubahan secra realtime
                  ) => setItemsResult({ ...itemsResult, score: e.target.value })}
                  type="text"
                  placeholder="95/A+"
                  className="w-full border-b border-none bg-transparent text-center text-[30px] text-success outline-none"
                />
              </div>
              <div className="mb-2 mt-2 text-center text-white-dark">*Click the circle input and enter the score</div>
              <div className="mt-5 rounded-md border border-white-light bg-white px-6 py-3.5 text-center dark:border-dark dark:bg-[#1b2e4b] md:flex-row ltr:md:text-left rtl:md:text-right">
                <div className="mx-auto text-center font-bold">Comentar for Student</div>
                <hr className="mb-3 mt-2" />
                <textarea
                  value={itemsResult?.comment}
                  onChange={(
                    e: any //mengupdate perubahan secra realtime
                  ) => setItemsResult({ ...itemsResult, comment: e.target.value })}
                  id="ctnTextarea"
                  rows={6}
                  className="form-textarea"
                  placeholder="Enter Address"
                  required
                ></textarea>
              </div>
            </div>
            <div className="panel mt-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-1">
                <button type="button" className="btn btn-primary w-full gap-2" onClick={handleSubmit}>
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
                <button onClick={goBack} className="btn btn-outline-danger w-full gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M14.5 7L19.5 12L14.5 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M19.5 12L9.5 12C7.83333 12 4.5 13 4.5 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Add;
