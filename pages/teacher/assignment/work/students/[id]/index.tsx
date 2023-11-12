import { useGetAllCoursesQuery, useGetAllStudentWithWorkQuery } from '@/redux/features/student/studentApi';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect, Fragment } from 'react';
import sortBy from 'lodash/sortBy';
import { useGetAllClassQuery } from '@/redux/features/class-subject/classSubjectApi';
import RouteProtected from '@/components/route-protected/RouteProtected';
import { studentWorkApi, useGetAllStudentWorkForTeacherQuery, useGetAllStudentWorkQuery } from '@/redux/features/student-work/studentWorkApi';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useGetAllAssignmentByTeacherQuery, useGetAllAssignmentQuery } from '@/redux/features/assignment/assignmentApi';

//get id on server side
export async function getServerSideProps(context: any) {
  const { id } = context.query;

  return {
    props: {
      id,
    },
  };
}

const WorkStudent = ({ id }: any) => {
  //SHOW
  const { data: dataStudentWork, isLoading } = useGetAllStudentWorkForTeacherQuery({}, { refetchOnMountOrArgChange: true });

  const dataStudentWorkById = dataStudentWork?.find((work: any) => work?.ass_id === id);

  //--get student with work
  const { data: dataStudentWithWork } = useGetAllStudentWithWorkQuery({}, { refetchOnMountOrArgChange: true });

  //--get assigmnet for show name and subjent
  const { data: dataAssignment } = useGetAllAssignmentQuery({}, { refetchOnMountOrArgChange: true });

  const dataAssignmentById = dataAssignment?.find((i: any) => i?.uid === id);
  console.log(dataAssignmentById);

  //--get assignmet for get class

  // const studentsWithWork = dataStudentWithWork && dataStudentWithWork.filter((i: any) => i.class_id === dataStudentWorkById?.class_id);
  const studentsWithWork = dataStudentWithWork && dataStudentWithWork.filter((i: any) => i.class_id === dataAssignmentById?.class_id);

  //--save to item
  const [items, setItems] = useState([]);
  // console.log(dataStudentWithWork);
  // console.log(dataStudentWorkById);//undifined
  // console.log(dataStudentWork); //undifined

  useEffect(() => {
    if (studentsWithWork) {
      setItems(studentsWithWork);
    }
  }, [studentsWithWork]);

  //SHOW

  //SEARCH
  const rowData = items;
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'nis'));
  const [recordsData, setRecordsData] = useState(initialRecords);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'nis',
    direction: 'asc',
  });
  useEffect(() => {
    setInitialRecords(sortBy(rowData, 'nis'));
  }, [items]);
  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData([...initialRecords.slice(from, to)]);
  }, [page, pageSize, initialRecords]);
  useEffect(() => {
    setInitialRecords(() => {
      return rowData?.filter((item: any) => {
        return item.nis?.toString().includes(search.toLowerCase()) || item.name.toLowerCase().includes(search.toLowerCase()) || item.email.toLowerCase().includes(search.toLowerCase());
      });
    });
  }, [search]);
  useEffect(() => {
    const data = sortBy(initialRecords, sortStatus.columnAccessor);
    setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    setPage(1);
  }, [sortStatus]);
  ///SEARCH

  const router = useRouter();
  const reload = () => {
    setTimeout(() => {
      router.reload();
    }, 1000);
  };

  const goBack = async () => {
    router.back();
    setTimeout(() => {
      router.reload();
    }, 1000);
  };

  //get assignment for get due date
  // const { isLoading, dataAssignment, refetch } = useGetAllAssignmentByTeacherQuery({}, { refetchOnMountOrArgChange: true });

  return (
    <>
      <RouteProtected userType={2} />
      <div className="border-white-light px-0 dark:border-[#1b2e4b]">
        {/* {!recordsData || recordsData.length === 0 ? ( */}
        {isLoading ? (
          <div className="flex items-center justify-center">
            <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
          </div>
        ) : (
          <div>
            <div className="invoice-table">
              <div className="mb-4.5 flex flex-col gap-5 md:flex-row md:items-center">
                <h2 className="pl-2 text-xl">{dataAssignmentById?.name}</h2>
                <ol className="flex font-semibold text-primary dark:text-white-dark">
                  <li className="bg-[#ebedf2] dark:bg-[#1b2e4b]">
                    <p className="relative flex h-full items-center bg-primary p-1.5 text-white-light before:absolute  before:inset-y-0 before:z-[1] before:m-auto before:h-0 before:w-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-b-transparent before:border-l-primary before:border-t-transparent ltr:pl-6 ltr:pr-2 ltr:before:-right-[15px] rtl:pl-2 rtl:pr-6 rtl:before:-left-[15px] rtl:before:rotate-180">
                      {dataAssignmentById?.subject_name}
                    </p>
                  </li>
                  <li className="bg-[#dbdde2] dark:bg-[#1b2e4b]">
                    <p className="relative flex h-full items-center p-1.5  px-3 before:absolute before:inset-y-0 before:z-[1] before:m-auto before:h-0 before:w-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-b-transparent before:border-l-[#dbdde2] before:border-t-transparent hover:text-primary/70 ltr:pl-6 ltr:before:-right-[15px] rtl:pr-6 rtl:before:-left-[15px] rtl:before:rotate-180 dark:before:border-l-[#1b2e4b] dark:hover:text-white-dark/70">
                      {dataAssignmentById?.class_name}
                    </p>
                  </li>
                </ol>
                <div className="ltr:ml-auto rtl:mr-auto">
                  <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="panel">
              <div className="datatables pagination-padding ">
                <DataTable
                  // className={`${isDark} table-hover whitespace-nowrap`}
                  records={recordsData}
                  columns={[
                    {
                      accessor: 'nis',
                      sortable: true,
                    },
                    {
                      accessor: 'name',
                      sortable: true,
                      render: ({ name, profile_pic }) => (
                        <div className="flex items-center font-semibold">
                          <div className="w-max rounded-full bg-white-dark/30 p-0.5 ltr:mr-2 rtl:ml-2">
                            {/* <img className="h-8 w-8 rounded-full object-cover" src={`${process.env.NEXT_PUBLIC_URL}${profile_pic}`} alt="" /> */}
                            <img className="h-8 w-8 rounded-full object-cover" src={profile_pic ? `${process.env.NEXT_PUBLIC_URL}${profile_pic}` : '/assets/images/profile-default.jpg'} alt="" />
                          </div>
                          <div>{name}</div>
                        </div>
                      ),
                    },
                    {
                      accessor: 'email',
                      sortable: true,
                    },
                    // {
                    //   accessor: 'class',
                    //   sortable: true,
                    // },

                    {
                      accessor: 'student_work', // Access the student_work array
                      title: 'Status',
                      textAlignment: 'center',
                      sortable: true, // This column is not sortable
                      render: ({ student_work }) => {
                        const matchingWork = student_work.find((work: any) => work?.ass_id === id);

                        if (matchingWork) {
                          const createdTimes = matchingWork.created_at; // Convert the created_at timestamp to a Date object

                          if (createdTimes < dataAssignmentById?.due_date) {
                            return (
                              <div className="flex justify-center">
                                <span className="badge mr-3 mt-[-2px] bg-success text-center">Finish</span>
                              </div>
                            );
                          } else {
                            return (
                              <div className="flex justify-center">
                                <span className="badge mr-2 mt-[-2px] bg-success">Finish</span>
                                <span className="badge badge-outline-danger mt-[-2px]">Late</span>
                              </div>
                            );
                          }
                        } else {
                          return (
                            <div className="flex justify-center">
                              <span className="badge mr-2 mt-[-2px] bg-dark">Not Finished</span>
                            </div>
                          );
                        }
                      },
                    },
                    {
                      accessor: 'score',
                      title: 'Score',
                      textAlignment: 'center',
                      sortable: true,
                      render: ({ student_work }) => {
                        const targetUid = id; // Replace with your target UID
                        const matchingWork = student_work.find((work: any) => work?.ass_id === targetUid);
                        if (matchingWork) {
                          if (matchingWork?.score !== null) {
                            return (
                              <div className="flex justify-center">
                                <span className="badge mr-3 rounded-full bg-warning py-1">{matchingWork?.score}</span>
                              </div>
                            );
                          } else {
                            return (
                              <div className="flex justify-center">
                                <span className="text-[14px] text-white-dark">Has not scored</span>
                              </div>
                            );
                          }
                        } else {
                          return (
                            <div className="flex justify-center">
                              <span className="mr-2 text-[14px] text-white-dark">No work</span>
                            </div>
                          );
                        }
                      },
                    },
                    {
                      accessor: 'action',
                      title: 'Actions',
                      sortable: false,
                      textAlignment: 'center',
                      render: ({ student_work }) => {
                        const targetUid = id; // Replace with your target UID
                        const matchingWork = student_work.find((work: any) => work?.ass_id === targetUid);
                        if (matchingWork) {
                          return (
                            <div className="mx-auto flex w-max items-center gap-4">
                              {/* <Link href={`/teacher/assignment/student-work/${matchingWork?.uid}`} className="flex hover:text-primary">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  opacity="0.5"
                                  d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                />
                                <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="1.5" />
                              </svg>
                            </Link> */}
                              <Link href={`/teacher/assignment/work/student-work/${matchingWork?.uid}`} className="btn btn-outline-info btn-sm flex" onClick={reload}>
                                <svg width="20" height="20" className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    opacity="0.5"
                                    d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                                <span className="ml-2">Show</span>
                              </Link>
                            </div>
                          );
                        }
                      },
                    },
                  ]}
                  highlightOnHover
                  totalRecords={initialRecords.length}
                  recordsPerPage={pageSize}
                  page={page}
                  onPageChange={(p) => setPage(p)}
                  recordsPerPageOptions={PAGE_SIZES}
                  onRecordsPerPageChange={setPageSize}
                  sortStatus={sortStatus}
                  onSortStatusChange={setSortStatus}
                  minHeight={200}
                  paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                />
              </div>
            </div>
            <button onClick={goBack} className="btn btn-danger ml-auto mt-6 w-[200px]  gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M14.5 7L19.5 12L14.5 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M19.5 12L9.5 12C7.83333 12 4.5 13 4.5 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
              Back
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default WorkStudent;
