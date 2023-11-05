import React from 'react';
import Link from 'next/link';
import Dropdown from '@/components/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setPageTitle } from '@/store/themeConfigSlice';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

import { useGetAllClassQuery, useGetAllSubjectQuery } from '@/redux/features/class-subject/classSubjectApi';
import TimesTableDash from '@/components/times-table/TimesTableDash';
import TeacherDash from '@/components/teacher-dash/TeacherDash';
import StudentDash from '@/components/student-dash/StudentDash';
import ProfileDash from '@/components/profile-dash/ProfileDash';
import ClassDash from '@/components/class-dash/ClassDash';
import SubjectDash from '@/components/subject-dash/SubjectDash';
import { useGetAllTeachersQuery } from '@/redux/features/teacher/teacherApi';
import { useGetAllCoursesQuery } from '@/redux/features/student/studentApi';

const Dashboard: React.FC = () => {
  const { isLoading, data, refetch } = useGetAllClassQuery({}, { refetchOnMountOrArgChange: true });
  const { data: dataTeacher } = useGetAllTeachersQuery({}, { refetchOnMountOrArgChange: true });
  const { data: dataStudent } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });
  const { data: dataSubject } = useGetAllSubjectQuery({}, { refetchOnMountOrArgChange: true });

  const [countClass, setCountClass] = useState();
  const [countSubject, setCountSubject] = useState();
  const [countTeacher, setCountTeacher] = useState();
  const [countStudent, setCountStudent] = useState();

  useEffect(() => {
    if (data && dataStudent && dataSubject && dataTeacher) {
      setCountClass(Object.keys(data).length);
      setCountSubject(Object.keys(dataSubject).length);
      setCountTeacher(Object.keys(dataTeacher).length);
      setCountStudent(Object.keys(dataStudent).length);
    }
  }, [data, dataTeacher, dataStudent, dataSubject]);

  //bitcoinoption
  const bitcoin: any = {
    series: [
      {
        data: [21, 9, 36, 12, 44, 25, 59, 41, 25, 66],
      },
    ],
    options: {
      chart: {
        height: 45,
        type: 'line',
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        width: 2,
      },
      markers: {
        size: 0,
      },
      colors: ['#00ab55'],
      grid: {
        padding: {
          top: 0,
          bottom: 0,
          left: 0,
        },
      },
      tooltip: {
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: () => {
              return '';
            },
          },
        },
      },
      responsive: [
        {
          breakPoint: 576,
          options: {
            chart: {
              height: 95,
            },
            grid: {
              padding: {
                top: 45,
                bottom: 0,
                left: 0,
              },
            },
          },
        },
      ],
    },
  };

  //ethereumoption
  const ethereum: any = {
    series: [
      {
        data: [44, 25, 59, 41, 66, 25, 21, 9, 36, 12],
      },
    ],
    options: {
      chart: {
        height: 45,
        type: 'line',
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        width: 2,
      },
      markers: {
        size: 0,
      },
      colors: ['#e7515a'],
      grid: {
        padding: {
          top: 0,
          bottom: 0,
          left: 0,
        },
      },
      tooltip: {
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: () => {
              return '';
            },
          },
        },
      },
      responsive: [
        {
          breakPoint: 576,
          options: {
            chart: {
              height: 95,
            },
            grid: {
              padding: {
                top: 45,
                bottom: 0,
                left: 0,
              },
            },
          },
        },
      ],
    },
  };

  //litecoinoption
  const litecoin: any = {
    series: [
      {
        data: [9, 21, 36, 12, 66, 25, 44, 25, 41, 59],
      },
    ],
    options: {
      chart: {
        height: 45,
        type: 'line',
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        width: 2,
      },
      markers: {
        size: 0,
      },
      colors: ['#00ab55'],
      grid: {
        padding: {
          top: 0,
          bottom: 0,
          left: 0,
        },
      },
      tooltip: {
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: () => {
              return '';
            },
          },
        },
      },
      responsive: [
        {
          breakPoint: 576,
          options: {
            chart: {
              height: 95,
            },
            grid: {
              padding: {
                top: 45,
                bottom: 0,
                left: 0,
              },
            },
          },
        },
      ],
    },
  };

  //binanceoption
  const binance: any = {
    series: [
      {
        data: [25, 44, 25, 59, 41, 21, 36, 12, 19, 9],
      },
    ],
    options: {
      chart: {
        height: 45,
        type: 'line',
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        width: 2,
      },
      markers: {
        size: 0,
      },
      colors: ['#e7515a'],
      grid: {
        padding: {
          top: 0,
          bottom: 0,
          left: 0,
        },
      },
      tooltip: {
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: () => {
              return '';
            },
          },
        },
      },
      responsive: [
        {
          breakPoint: 576,
          options: {
            chart: {
              height: 95,
            },
            grid: {
              padding: {
                top: 45,
                bottom: 0,
                left: 0,
              },
            },
          },
        },
      ],
    },
  };

  //tetheroption
  const tether: any = {
    series: [
      {
        data: [21, 59, 41, 44, 25, 66, 9, 36, 25, 12],
      },
    ],
    options: {
      chart: {
        height: 45,
        type: 'line',
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        width: 2,
      },
      markers: {
        size: 0,
      },
      colors: ['#00ab55'],
      grid: {
        padding: {
          top: 0,
          bottom: 0,
          left: 0,
        },
      },
      tooltip: {
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: () => {
              return '';
            },
          },
        },
      },
      responsive: [
        {
          breakPoint: 576,
          options: {
            chart: {
              height: 95,
            },
            grid: {
              padding: {
                top: 45,
                bottom: 0,
                left: 0,
              },
            },
          },
        },
      ],
    },
  };

  //solanaoption
  const solana: any = {
    series: [
      {
        data: [21, -9, 36, -12, 44, 25, 59, -41, 66, -25],
      },
    ],
    options: {
      chart: {
        height: 45,
        type: 'line',
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        width: 2,
      },
      markers: {
        size: 0,
      },
      colors: ['#e7515a'],
      grid: {
        padding: {
          top: 0,
          bottom: 0,
          left: 0,
        },
      },
      tooltip: {
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: () => {
              return '';
            },
          },
        },
      },
      responsive: [
        {
          breakPoint: 576,
          options: {
            chart: {
              height: 95,
            },
            grid: {
              padding: {
                top: 45,
                bottom: 0,
                left: 0,
              },
            },
          },
        },
      ],
    },
  };

  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

  return (
    // <div className="grid grid-cols-5 gap-6 p-4">
    <div className="mb-6 grid grid-cols-5 gap-6">
      <div className="col-span-4 grid grid-cols-4 gap-6">
        {/* User Visit */}
        <div className="col-span-4 grid grid-cols-4 gap-6 text-white">
          <div className="panel col-span-1 bg-gradient-to-r from-cyan-500 to-cyan-400">
            <div className="flex justify-between">
              <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Total of Teacher</div>
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
                      <Link href="/admin/teacher">View Teacher</Link>
                    </li>
                  </ul>
                </Dropdown>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-center">
              <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3"> {countTeacher} </div>
            </div>
            <div className="badge mt-5 bg-white/30 text-center text-sm font-semibold">teachers </div>
          </div>
          {/* Sessions */}
          <div className="panel col-span-1 bg-gradient-to-r from-violet-500 to-violet-400">
            <div className="flex justify-between">
              <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Total of Students</div>
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
                      <Link href="/admin/student">View Student</Link>
                    </li>
                  </ul>
                </Dropdown>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-center">
              <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3"> {countStudent} </div>
            </div>
            <div className="badge mt-5 bg-white/30 text-center text-sm font-semibold">students </div>
          </div>
          {/*  Time On-Site */}
          <div className="panel col-span-1 bg-gradient-to-r from-blue-500 to-blue-400">
            <div className="flex justify-between">
              <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Total of Class</div>
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
                      <Link href="/admin/class-subject">View Class</Link>
                    </li>
                  </ul>
                </Dropdown>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-center">
              <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3"> {countClass} </div>
            </div>
            <div className="badge mt-5 bg-white/30 text-center text-sm font-semibold">classes </div>
          </div>
          {/* Bounce Rate */}
          <div className="panel col-span-1 bg-gradient-to-r from-fuchsia-500 to-fuchsia-400">
            <div className="flex justify-between">
              <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Total of Subject</div>
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
                      <Link href="/admin/class-subject">View Subject</Link>
                    </li>
                  </ul>
                </Dropdown>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-center">
              <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3"> {countSubject} </div>
            </div>
            <div className="badge mt-5 bg-white/30 text-center text-sm font-semibold">subjects </div>
          </div>
        </div>

        <div className="panel col-span-4">
          <TimesTableDash data={data} />
        </div>

        <div className="panel col-span-2 !px-0">
          <TeacherDash />
        </div>
        <div className="panel col-span-2 !px-0">
          <StudentDash />
        </div>
      </div>

      <div className="col-span-1 grid grid-cols-1 gap-4">
        <div className="panel col-span-1 bg-gradient-to-r from-[#4361ee] to-[#190ca5] !px-0 text-white">
          <ProfileDash />
        </div>
        <div className="panel col-span-1 !px-0">
          <ClassDash />
        </div>
        <div className="panel col-span-1 !px-0">
          <SubjectDash />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
