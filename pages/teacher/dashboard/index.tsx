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
import { useGetAllAssignmentByTeacherQuery } from '@/redux/features/assignment/assignmentApi';
import { useGetAllMaterialByTeacherQuery } from '@/redux/features/material/materialApi';
import { useGetAllTimeTableQuery } from '@/redux/features/times-table/timeTableApi';

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

  const filteredStudents = dataStudent?.filter((student) => showDataClasses.includes(student.class));

  return filteredStudents;
};

const Dashboard: React.FC = () => {
  const { isLoading, data, refetch } = useGetAllClassByTeacherQuery({}, { refetchOnMountOrArgChange: true });
  const { data: dataTeacherAssignment } = useGetAllAssignmentByTeacherQuery({}, { refetchOnMountOrArgChange: true });
  const { data: dataTeacherMaterial } = useGetAllMaterialByTeacherQuery({}, { refetchOnMountOrArgChange: true });

  const [countAss, setCountAss] = useState();
  const [countMat, setCountMat] = useState();
  // const [countTeacher, setCountTeacher] = useState();
  // const [countStudent, setCountStudent] = useState();

  useEffect(() => {
    if (dataTeacherAssignment && dataTeacherMaterial) {
      setCountAss(Object.keys(dataTeacherAssignment).length);
      setCountMat(Object.keys(dataTeacherMaterial).length);
    }
  }, [dataTeacherAssignment, dataTeacherMaterial]);

  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

  const { user } = useAuth();

  //GET TEACHER
  const { data: dataTeacher } = useGetAllTeachersQuery({}, { refetchOnMountOrArgChange: true });

  const showData = dataTeacher && dataTeacher.find((i: any) => i.id === user.id);

  //get student only have class same
  const { data: dataStudent } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });

  const filteredStudents = filterStudentsWithSameClasses(showData, dataStudent);

  //use state
  const [countSub, setCountSub] = useState();
  const [countCla, setCountCla] = useState();
  const [countStu, setCountStu] = useState();

  useEffect(() => {
    if (showData && filteredStudents) {
      setCountCla(Object.keys(showData?.classes).length);
      setCountSub(Object.keys(showData?.subject).length);
      setCountStu(Object.keys(filteredStudents).length);
    }
  }, [showData, filteredStudents]);
  //GET TEACHER
  // console.log(JSON.stringify(dataStudent));
  // console.log(showData);

  return (
    // <div className="grid grid-cols-5 gap-6 p-4">
    <div className="mb-6 grid grid-cols-4 gap-6">
      <div className="col-span-3 grid grid-cols-3 gap-6">
        <div className="panel col-span-3 grid grid-cols-3 gap-5 bg-gradient-to-r from-blue-500 to-blue-400 pb-6 text-white">
          <h5 className="col-span-3  mt-2 text-lg font-bold">Total Data</h5>
          {/* student */}
          <div className="col-span-1 flex h-[85px] rounded-md  bg-white/30  p-4">
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
          {/* classes */}
          <div className="col-span-1 flex  h-[85px] rounded-md  bg-white/30  p-4">
            <div className="mr-4 w-auto rounded-full bg-[#deeffd] p-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22 22L2 22" stroke="#2196f3" stroke-width="1.5" stroke-linecap="round" />
                <path
                  d="M3 22.0001V11.3472C3 10.4903 3.36644 9.67432 4.00691 9.10502L10.0069 3.77169C11.1436 2.76133 12.8564 2.76133 13.9931 3.77169L19.9931 9.10502C20.6336 9.67432 21 10.4903 21 11.3472V22.0001"
                  stroke="#2196f3"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path d="M10 9H14" stroke="#2196f3" stroke-width="1.5" stroke-linecap="round" />
                <path opacity="0.5" d="M9 15.5H15" stroke="#2196f3" stroke-width="1.5" stroke-linecap="round" />
                <path opacity="0.5" d="M9 18.5H15" stroke="#2196f3" stroke-width="1.5" stroke-linecap="round" />
                <path
                  opacity="0.5"
                  d="M18 22V16C18 14.1144 18 13.1716 17.4142 12.5858C16.8284 12 15.8856 12 14 12H10C8.11438 12 7.17157 12 6.58579 12.5858C6 13.1716 6 14.1144 6 16V22"
                  stroke="#2196f3"
                  stroke-width="1.5"
                />
              </svg>
            </div>
            <div className="inline-block">
              <div className="col-span-3 text-xl font-semibold">{countCla}</div>
              <div className="col-span-3 text-sm text-white">classes</div>
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
        </div>
        <div className="col-span-3">
          <TimesTableDash2 data={data} />
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
                    <Link href="/teacher/material">View Material</Link>
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
                    <Link href="/teacher/assignment">View Assignmet</Link>
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
