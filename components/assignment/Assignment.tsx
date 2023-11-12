import { format } from 'date-fns';
import Link from 'next/link';
import React, { FC, useEffect, useState, Fragment } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import Swal from 'sweetalert2';
import { useAuth } from '@/pages/hooks/auth';
import { useDeleteAssignmentMutation, useDeleteFileMutation, useGetAllAssignmentQuery } from '@/redux/features/assignment/assignmentApi';
import { useGetAllStudentWorkQuery } from '@/redux/features/student-work/studentWorkApi';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

type Props = {
  data: any;
  isLoading: any;
  refetch?: any;
};

const Assignment: FC<Props> = ({ data, isLoading, refetch }) => {
  //SHOW
  //--get data user login
  const { user } = useAuth();
  //--save data on items
  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);
  const [items, setItems] = useState([]);
  ///SHOW

  //DELETE FOR TEACHER
  //--redux
  const [deleteAssignment, { isSuccess: successDelete }] = useDeleteAssignmentMutation({});
  const [deleteFiles, { isSuccess: successDeleteF }] = useDeleteFileMutation({});
  //--use effect when finish
  useEffect(() => {
    if (successDelete) {
      refetch();
    }
  }, [successDelete]);
  //--handle delete
  const deleteRow = async (id: any) => {
    const showAlert = async (type: number) => {
      if (type === 10) {
        Swal.fire({
          icon: 'warning',
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          showCancelButton: true,
          confirmButtonText: 'Delete',
          padding: '2em',
          customClass: 'sweet-alerts',
        }).then(async (result) => {
          if (result.value) {
            Swal.fire({ title: 'Deleted!', text: 'Your data has been deleted.', icon: 'success', customClass: 'sweet-alerts' });
            await deleteAssignment(id);
          }
        });
      }
    };
    showAlert(10);
  };
  ///DELETE FOR TEACHER

  //SEARCH
  const rowData = items;
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'created_at'));
  const [recordsData, setRecordsData] = useState(initialRecords);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'created_at',
    direction: 'asc',
  });
  useEffect(() => {
    const reversedData = sortBy(rowData, 'created_at');
    setInitialRecords(reversedData.reverse());
  }, [items]);
  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData([...initialRecords.slice(from, to)]);
  }, [page, pageSize, initialRecords]);
  //--penting
  useEffect(() => {
    setInitialRecords(() => {
      return rowData?.filter((item: any) => {
        return item.name.toLowerCase().includes(search.toLowerCase()) || item.class_name.toLowerCase().includes(search.toLowerCase()) || item.subject_name.toLowerCase().includes(search.toLowerCase());
      });
    });
  }, [search]);
  useEffect(() => {
    const data = sortBy(initialRecords, sortStatus.columnAccessor);
    setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    setPage(1);
  }, [sortStatus]);
  ///SEARCH

  //--finished or not
  const { data: dataStudentWork } = useGetAllStudentWorkQuery({}, { refetchOnMountOrArgChange: true });

  // //--late
  // const [itemss, setItemss] = useState([]);
  // useEffect(() => {
  //   if (dataStudentWork) {
  //     setItemss(dataStudentWork);
  //   }
  // }, [dataStudentWork]);

  // const [items2, setItems2] = useState([]);
  // const [createdTime, setCreatedTime] = useState();
  // // const [studentWorkUid, setStudentWorkUid] = useState();

  // useEffect(() => {
  //   const content = itemss[0]?.created_at;
  //   // const sWUid = itemss[0]?.uid;
  //   setCreatedTime(content);
  //   // setStudentWorkUid(sWUid);
  // }, [itemss]);
  // console.log(createdTime);

  return (
    <>
      <div className="border-white-light px-0 dark:border-[#1b2e4b]">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
          </div>
        ) : (
          <div>
            <div className="invoice-table">
              <div className="mb-4.5 flex gap-5 md:flex-row md:items-center">
                <div className="flex w-full items-center gap-2 sm:w-auto xl:w-auto">
                  {user?.user_type === 2 && (
                    <Link href="/teacher/assignment/add" className="btn btn-primary w-full gap-2 sm:w-auto xl:w-auto">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Add New
                    </Link>
                  )}
                  {user?.user_type === 3 && <h2 className="text-xl">Assignment</h2>}
                </div>
                <div className="sm:ltr:ml-auto sm:rtl:mr-auto xl:ltr:ml-auto xl:rtl:mr-auto">
                  <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="datatables pagination-padding">
              <div className="panel">
                <DataTable
                  records={recordsData}
                  columns={[
                    {
                      accessor: 'name',
                      sortable: true,
                    },
                    {
                      accessor: 'class_name',
                      title: 'Class',
                      sortable: true,
                      hidden: user?.user_type === 3,
                    },
                    {
                      accessor: 'subject_name',
                      title: 'Subject',
                      sortable: true,
                    },
                    {
                      accessor: 'created_at',
                      title: 'Created At',
                      sortable: true,
                      render: ({ created_at }) => {
                        const createdAtDate = new Date(created_at);

                        // Gunakan fungsi format dari date-fns untuk memformat tanggal
                        const formattedDate = format(createdAtDate, 'yyyy-MM-dd HH:mm:ss');

                        return (
                          <div>
                            <p>{formattedDate}</p>
                          </div>
                        );
                      },
                    },
                    {
                      accessor: 'due_date',
                      title: 'Due Date',
                      sortable: true,
                    },
                    {
                      accessor: 'status',
                      title: 'Status',
                      sortable: true,
                      textAlignment: 'center',
                      hidden: user?.user_type !== 3, // Hide the 'name' column if type_user is not equal to 3
                      render: ({ due_date, uid }) => {
                        const matchingWork = dataStudentWork?.find((work: any) => work?.ass_id === uid);
                        if (matchingWork) {
                          const createdTimes = matchingWork.created_at; // Convert the created_at timestamp to a Date object

                          if (createdTimes < due_date) {
                            return (
                              <div className="flex justify-center">
                                <span className="badge mr-3  bg-success text-center">Finish</span>
                              </div>
                            );
                          } else {
                            return (
                              <div className="flex justify-center">
                                <span className="badge mr-3 bg-success">Finish</span>
                                <span className="badge badge-outline-danger ">Late</span>
                              </div>
                            );
                          }
                        } else {
                          return (
                            <div className="flex justify-center">
                              <span className="badge mt-[-2px] bg-dark">Not Finished</span>
                            </div>
                          );
                        }
                      },
                    },
                    {
                      accessor: 'score',
                      title: 'Score',
                      sortable: true,
                      textAlignment: 'center',
                      hidden: user?.user_type !== 3, // Hide the 'name' column if type_user is not equal to 3
                      render: ({ uid }) => {
                        const matchingWork = dataStudentWork?.find((work: any) => work?.ass_id === uid);
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
                      render: ({ uid }) => (
                        <>
                          <div className="mx-auto flex w-max items-center gap-4">
                            {user?.user_type === 2 && (
                              <>
                                <Link href={`/teacher/assignment/edit/${uid}`} type="button" className="flex hover:text-info">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5">
                                    <path
                                      opacity="0.5"
                                      d="M22 10.5V12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2H13.5"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                    ></path>
                                    <path
                                      d="M17.3009 2.80624L16.652 3.45506L10.6872 9.41993C10.2832 9.82394 10.0812 10.0259 9.90743 10.2487C9.70249 10.5114 9.52679 10.7957 9.38344 11.0965C9.26191 11.3515 9.17157 11.6225 8.99089 12.1646L8.41242 13.9L8.03811 15.0229C7.9492 15.2897 8.01862 15.5837 8.21744 15.7826C8.41626 15.9814 8.71035 16.0508 8.97709 15.9619L10.1 15.5876L11.8354 15.0091C12.3775 14.8284 12.6485 14.7381 12.9035 14.6166C13.2043 14.4732 13.4886 14.2975 13.7513 14.0926C13.9741 13.9188 14.1761 13.7168 14.5801 13.3128L20.5449 7.34795L21.1938 6.69914C22.2687 5.62415 22.2687 3.88124 21.1938 2.80624C20.1188 1.73125 18.3759 1.73125 17.3009 2.80624Z"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                    ></path>
                                    <path
                                      opacity="0.5"
                                      d="M16.6522 3.45508C16.6522 3.45508 16.7333 4.83381 17.9499 6.05034C19.1664 7.26687 20.5451 7.34797 20.5451 7.34797M10.1002 15.5876L8.4126 13.9"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                    ></path>
                                  </svg>
                                </Link>
                                <Link href={`/teacher/assignment/show/${uid}`} className="flex hover:text-primary">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                      opacity="0.5"
                                      d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                    />
                                    <path
                                      d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                    />
                                  </svg>
                                </Link>
                                <button type="button" className="flex hover:text-danger" onClick={(e) => deleteRow(uid)}>
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
                                <Tippy content="Student work" placement="bottom">
                                  <Link href={`/teacher/assignment/work/students/${uid}`} className="flex hover:text-success">
                                    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                                      <path d="M4 6V19C4 20.6569 5.34315 22 7 22H17C18.6569 22 20 20.6569 20 19V9C20 7.34315 18.6569 6 17 6H4ZM4 6V5" stroke="currentColor" stroke-width="1.5" />
                                      <path
                                        d="M18 6.00002V6.75002H18.75V6.00002H18ZM15.7172 2.32614L15.6111 1.58368L15.7172 2.32614ZM4.91959 3.86865L4.81353 3.12619H4.81353L4.91959 3.86865ZM5.07107 6.75002H18V5.25002H5.07107V6.75002ZM18.75 6.00002V4.30604H17.25V6.00002H18.75ZM15.6111 1.58368L4.81353 3.12619L5.02566 4.61111L15.8232 3.0686L15.6111 1.58368ZM4.81353 3.12619C3.91638 3.25435 3.25 4.0227 3.25 4.92895H4.75C4.75 4.76917 4.86749 4.63371 5.02566 4.61111L4.81353 3.12619ZM18.75 4.30604C18.75 2.63253 17.2678 1.34701 15.6111 1.58368L15.8232 3.0686C16.5763 2.96103 17.25 3.54535 17.25 4.30604H18.75ZM5.07107 5.25002C4.89375 5.25002 4.75 5.10627 4.75 4.92895H3.25C3.25 5.9347 4.06532 6.75002 5.07107 6.75002V5.25002Z"
                                        fill="currentColor"
                                      />
                                      <path opacity="0.5" d="M8 12H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                      <path opacity="0.5" d="M8 15.5H13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                    </svg>
                                  </Link>
                                </Tippy>
                              </>
                            )}
                            {user?.user_type === 3 && (
                              <Link href={`/student/assignment/show/${uid}`} className="btn btn-outline-info btn-sm flex">
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
                            )}
                          </div>
                        </>
                      ),
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
          </div>
        )}
      </div>
    </>
  );
};

export default Assignment;
