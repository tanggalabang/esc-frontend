import React from 'react';
import Link from 'next/link';
import Dropdown from '@/components/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setPageTitle } from '@/store/themeConfigSlice';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/pages/hooks/auth';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

import { useGetAllClassByTeacherQuery, useGetAllClassQuery, useGetAllSubjectQuery } from '@/redux/features/class-subject/classSubjectApi';
import TimesTableDash from '@/components/times-table/TimesTableDash';
import TeacherDash from '@/components/teacher-dash/TeacherDash';
import StudentDash from '@/components/student-dash/StudentDash';
import ProfileDash from '@/components/profile-dash/ProfileDash';
import ClassDash from '@/components/class-dash/ClassDash';
import SubjectDash from '@/components/subject-dash/SubjectDash';
import { useGetAllTeachersQuery } from '@/redux/features/teacher/teacherApi';
import { useGetAllCoursesQuery } from '@/redux/features/student/studentApi';
import TimesTableDash2 from '@/components/times-table/TimesTableDash2';
import ProfileDash2 from '@/components/profile-dash/ProfileDash2';
import { useGetAllAssignmentByStudentQuery, useGetAllAssignmentByTeacherQuery } from '@/redux/features/assignment/assignmentApi';
import { useGetAllMaterialByStudentQuery, useGetAllMaterialByTeacherQuery } from '@/redux/features/material/materialApi';
import TimesTableDash3 from '@/components/times-table/TimesTableDash3';
import { useGetAllTimeTableQuery } from '@/redux/features/times-table/timeTableApi';
import { useGetAllStudentWorkQuery } from '@/redux/features/student-work/studentWorkApi';

// types.ts
export type ShowData = {
  id: number;
  user_type: number;
  // Tambahkan properti lain sesuai dengan struktur showData
  classes: { id: number; name: string; is_delete: number; created_at: string; updated_at: string }[];
};

export type StudentData = {
  id: number;
  user_type: number;
  // Tambahkan properti lain sesuai dengan struktur dataStudent
  class: string;
};

const filterStudentsWithSameClasses = (showData: ShowData, dataStudent: StudentData[]): StudentData[] => {
  const showDataClasses = showData?.classes.map((cls) => cls.name);

  const filteredStudents = dataStudent?.filter((student) => showDataClasses?.includes(student.class));

  return filteredStudents;
};

const Dashboard: React.FC = () => {
  const { data: dataStudentAssignment } = useGetAllAssignmentByStudentQuery({}, { refetchOnMountOrArgChange: true });
  const { data: dataStudentMaterial } = useGetAllMaterialByStudentQuery({}, { refetchOnMountOrArgChange: true });

  const [countAss, setCountAss] = useState();
  const [countMat, setCountMat] = useState();
  // const [countTeacher, setCountTeacher] = useState();
  // const [countStudent, setCountStudent] = useState();

  useEffect(() => {
    if (dataStudentAssignment && dataStudentMaterial) {
      setCountAss(Object.keys(dataStudentAssignment).length);
      setCountMat(Object.keys(dataStudentMaterial).length);
    }
  }, [dataStudentAssignment, dataStudentMaterial]);

  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

  const { user } = useAuth();

  //GET TEACHER
  // const { data: dataTeacher } = useGetAllTeachersQuery({}, { refetchOnMountOrArgChange: true });

  // const showData = dataTeacher && dataTeacher.find((i: any) => i.id === user.id);

  //get student only have class same
  const { data: dataStudent } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });

  // const showData = dataStudent && dataStudent.find((i: any) => i.class_id === user.id);
  const showData = dataStudent?.filter((item: any) => item.class_id === user.class_id);
  // const filteredStudents = filterStudentsWithSameClasses(showData, dataStudent);

  const { data: dataClass } = useGetAllClassQuery({}, { refetchOnMountOrArgChange: true });

  const showClass = dataClass && dataClass.find((i: any) => i.id === user.class_id);
  //use state
  const [countSub, setCountSub] = useState();
  // const [countCla, setCountCla] = useState();
  const [countStu, setCountStu] = useState();

  //GET TEACHER
  // console.log(JSON.stringify(dataStudent));
  // console.log(showData);
  const { data: dataTimesTable } = useGetAllTimeTableQuery(user?.class_id, { refetchOnMountOrArgChange: true });
  // console.log(dataTimesTable);
  // console.log(JSON.stringify(dataTimesTable));
  const getUniqueSubjects = (data: any) => {
    const subjectSet = new Set<string>();
    data?.periods.forEach((period: any) => {
      subjectSet.add(period.subject);
    });
    return Array.from(subjectSet);
  };

  // Gunakan fungsi untuk mendapatkan subjek yang unik
  const uniqueSubjects = getUniqueSubjects(dataTimesTable);

  useEffect(() => {
    if (showData && dataTimesTable) {
      // setCountCla(Object.keys(showData?.classes).length);
      setCountSub(Object.keys(uniqueSubjects).length);
      setCountStu(Object.keys(showData).length);
    }
  }, [showData, dataTimesTable]);

  //================
  const { data: dataStudentWork } = useGetAllStudentWorkQuery({}, { refetchOnMountOrArgChange: true });

  const showStudentWork = dataStudentWork?.filter((item: any) => item?.student_id === user?.id);

  // console.log(showStudentWork);
  // console.log(JSON.stringify(dataStudentAssignment));

  // console.log(dataStudentAssignment);
  // 1. Mencari berapa data pada showStudentWork yang ass_id sama dengan uid di dataStudentAssignment
  const matchingDataCount = showStudentWork?.filter((work: any) => {
    return dataStudentAssignment?.some((assignment: any) => assignment.uid === work.ass_id);
  }).length;

  console.log(`Jumlah data pada showStudentWork yang memiliki ass_id yang sama dengan uid di dataStudentAssignment: ${matchingDataCount}`);

  // 2. Mencari berapa data pada dataStudentAssignment yang uid-nya tidak ada di showStudentWork
  const missingDataCount = dataStudentAssignment?.filter((assignment: any) => {
    return !showStudentWork?.some((work: any) => work.ass_id === assignment.uid);
  }).length;

  console.log(`Jumlah data pada dataStudentAssignment yang uid-nya tidak ada di showStudentWork: ${missingDataCount}`);

  return (
    // <div className="grid grid-cols-5 gap-6 p-4">
    <div className="mb-6 grid grid-cols-4 gap-6">
      <div className="col-span-3 grid grid-cols-3 gap-6">
        <div className="panel col-span-3 grid grid-cols-3 gap-5  bg-gradient-to-r from-blue-500 to-blue-400 text-white">
          <h5 className="col-span-3  mt-2 text-lg font-bold">{showClass?.name}</h5>
          {/* student */}
          <div className="col-span-1 flex h-[85px] rounded-md bg-white/30 p-4">
            <div className="mr-4 w-auto rounded-full bg-[#d9f2e6] p-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="6" r="4" stroke="#00ab55" stroke-width="1.5" />
                <path
                  opacity="0.5"
                  d="M12.5 4.3411C13.0375 3.53275 13.9565 3 15 3C16.6569 3 18 4.34315 18 6C18 7.65685 16.6569 9 15 9C13.9565 9 13.0375 8.46725 12.5 7.6589"
                  stroke="#00ab55"
                  stroke-width="1.5"
                />
                <ellipse cx="9" cy="17" rx="7" ry="4" stroke="#00ab55" stroke-width="1.5" />
                <path opacity="0.5" d="M18 14C19.7542 14.3847 21 15.3589 21 16.5C21 17.5293 19.9863 18.4229 18.5 18.8704" stroke="#00ab55" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </div>
            <div className="inline-block">
              <div className="col-span-3 text-xl font-semibold">{countStu}</div>
              <div className="col-span-3 text-sm text-white">students</div>
            </div>
          </div>
          {/* subject */}
          <div className="col-span-1 flex  h-[85px] rounded-md  bg-white/30 p-4">
            <div className="mr-4 w-auto rounded-full bg-[#e3e7fc] p-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
                  stroke="#4361ee"
                  stroke-width="1.5"
                />
                <path
                  opacity="0.5"
                  d="M17 2V11.8076C17 12.7825 17 13.27 16.8709 13.5607C16.5766 14.2233 15.8506 14.5805 15.1461 14.4095C14.8369 14.3344 14.4507 14.037 13.6782 13.4422C13.2421 13.1064 13.024 12.9385 12.797 12.8398C12.2886 12.619 11.7114 12.619 11.203 12.8398C10.976 12.9385 10.7579 13.1064 10.3218 13.4422C9.5493 14.037 9.16307 14.3344 8.85391 14.4095C8.14942 14.5805 7.42342 14.2233 7.12914 13.5607C7 13.27 7 12.7825 7 11.8076V2"
                  stroke="#4361ee"
                  stroke-width="1.5"
                />
                <path opacity="0.5" d="M17 18H7" stroke="#4361ee" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </div>
            <div className="inline-block">
              <div className="col-span-3 text-xl font-semibold">{countSub}</div>
              <div className="col-span-3 text-sm text-white">subjects</div>
            </div>
          </div>
          {/* classes */}
          <div className="col-span-1 flex  h-[85px] rounded-md bg-white/30 p-4">
            <div className="mr-4 w-auto rounded-full bg-[#fbe5e6] p-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  opacity="0.5"
                  d="M7 17.9983C4.82497 17.9862 3.64706 17.8897 2.87868 17.1213C2 16.2426 2 14.8284 2 12L2 8C2 5.17157 2 3.75736 2.87868 2.87868C3.75736 2 5.17157 2 8 2L16 2C18.8284 2 20.2426 2 21.1213 2.87868C22 3.75736 22 5.17157 22 8V12C22 14.8284 22 16.2426 21.1213 17.1213C20.3915 17.8512 19.2921 17.9748 17.3197 17.9957L16.5 17.9983"
                  stroke="#e7515a"
                  stroke-width="1.5"
                />
                <path opacity="0.5" d="M9 6L15 6" stroke="#e7515a" stroke-width="1.5" stroke-linecap="round" />
                <path opacity="0.5" d="M7 9.5H17" stroke="#e7515a" stroke-width="1.5" stroke-linecap="round" />
                <path
                  d="M10.8907 13.9454C11.53 13.4007 12.4702 13.4007 13.1094 13.9454C13.3833 14.1789 13.7239 14.32 14.0827 14.3486C14.9199 14.4154 15.5847 15.0802 15.6515 15.9174C15.6802 16.2762 15.8212 16.6168 16.0547 16.8907C16.5994 17.53 16.5994 18.4702 16.0547 19.1094C15.8212 19.3833 15.6802 19.7239 15.6515 20.0827C15.5847 20.9199 14.9199 21.5847 14.0827 21.6515C13.7239 21.6802 13.3833 21.8212 13.1094 22.0547C12.4702 22.5994 11.53 22.5994 10.8907 22.0547C10.6168 21.8212 10.2762 21.6802 9.91743 21.6515C9.08021 21.5847 8.41539 20.9199 8.34858 20.0827C8.31995 19.7239 8.17888 19.3833 7.94543 19.1094C7.40068 18.4702 7.40068 17.53 7.94543 16.8907C8.17888 16.6168 8.31995 16.2762 8.34858 15.9174C8.4154 15.0802 9.08021 14.4154 9.91743 14.3486C10.2762 14.32 10.6168 14.1789 10.8907 13.9454Z"
                  stroke="#e7515a"
                  stroke-width="1.5"
                />
                <path d="M10.5 18.2L11.3571 19L13.5 17" stroke="#e7515a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            {missingDataCount !== 0 ? (
              <div className="inline-block">
                <div className="col-span-3 text-xl font-semibold text-danger">{missingDataCount}</div>
                <div className="col-span-3 text-sm text-danger">assignment have not finished</div>
              </div>
            ) : (
              <div className="inline-block">
                <div className="col-span-3 text-xl font-semibold">{missingDataCount}</div>
                <div className="col-span-3 text-sm text-white">assignment have not finished</div>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-3">
          <TimesTableDash3 />
        </div>
      </div>

      <div className="col-span-1 grid grid-cols-1 gap-4">
        {/* User Visit */}
        <div className="panel col-span-1 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white">
          <div className="flex justify-between">
            <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Total of Material</div>
            <div className="dropdown">
              <Dropdown
                offset={[0, 5]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="hover:text-primary"
                button={
                  <svg className="h-5 w-5 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                    <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                }
              >
                <ul className="text-black dark:text-white-dark">
                  <li>
                    <Link href="/student/material">View Material</Link>
                  </li>
                </ul>
              </Dropdown>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-center">
            {/* <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3"> {countTeacher} </div> */}
            <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3"> {countMat} </div>
          </div>
          <div className="badge mt-5 bg-white/30 text-center text-sm font-semibold">materials </div>
        </div>
        {/* Sessions */}
        <div className="panel col-span-1 bg-gradient-to-r from-violet-500 to-violet-400 text-white">
          <div className="flex justify-between">
            <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Total of Assignment</div>
            <div className="dropdown">
              <Dropdown
                offset={[0, 5]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="hover:text-primary"
                button={
                  <svg className="h-5 w-5 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                    <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                }
              >
                <ul className="text-black dark:text-white-dark">
                  <li>
                    <Link href="/student/assignment">View Assignmet</Link>
                  </li>
                </ul>
              </Dropdown>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-center">
            {/* <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3"> {countStudent} </div> */}
            <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3"> {countAss} </div>
          </div>
          <div className="badge mt-5 bg-white/30 text-center text-sm font-semibold">assignments </div>
        </div>
        <div className="panel col-span-1 bg-gradient-to-r  !px-0 text-black">
          <ProfileDash2 showData={showData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
