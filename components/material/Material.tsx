import HTMLReactParser from 'html-react-parser';
import Link from 'next/link';
import React, { FC, useEffect, useState, Fragment } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import Swal from 'sweetalert2';
import { useAuth } from '@/pages/hooks/auth';
import { useDeleteMaterialMutation } from '@/redux/features/material/materialApi';

type Props = {
  data: any;
  isLoading: any;
  refetch?: any;
};

// const Material = (props: Props) => {
const Material: FC<Props> = ({ data, isLoading, refetch }) => {
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
  //--set image
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    if (user?.profile_pic != null) {
      const fullImageUrl = `${process.env.NEXT_PUBLIC_URL}${user?.profile_pic}`;
      setProfileImage(fullImageUrl);
    } else {
      const fullImageUrl = '/assets/images/thumbnail-default.jpg';
      setProfileImage(fullImageUrl);
    }
  }, [data]);

  //--for show grid mode
  const [value, setValue] = useState<any>('list');
  ///SHOW

  //DELETE
  //--redux
  const [deleteMaterial, { isSuccess: successDelete }] = useDeleteMaterialMutation({});
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
            await deleteMaterial(id);
          }
        });
      }
    };
    showAlert(10);
  };
  ///DELETE

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
    setInitialRecords(sortBy(rowData, 'created_at'));
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

  return (
    <>
      <div className="order-white-light px-0 dark:border-[#1b2e4b]">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
          </div>
        ) : (
          <>
            <div>
              <div className="invoice-table">
                <div className="mb-4.5 flex flex-col gap-3 md:flex-row md:items-center">
                  <div className="flex items-center gap-2">
                    {user?.user_type === 2 && (
                      <Link href="/teacher/material/add" className="btn btn-primary gap-2">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add New
                      </Link>
                    )}
                    {user?.user_type === 3 && <h2 className="text-xl">Material</h2>}
                  </div>
                  <div className="ltr:ml-auto rtl:mr-auto">
                    <button type="button" className={`btn btn-outline-primary p-2 ${value === 'list' && 'bg-primary text-white'}`} onClick={() => setValue('list')}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                        <path d="M2 5.5L3.21429 7L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path opacity="0.5" d="M2 12.5L3.21429 14L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 19.5L3.21429 21L7.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M22 19L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path opacity="0.5" d="M22 12L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M22 5L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                  <div>
                    <button type="button" className={`btn btn-outline-primary p-2 ${value === 'grid' && 'bg-primary text-white'}`} onClick={() => setValue('grid')}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                        <path
                          opacity="0.5"
                          d="M2.5 6.5C2.5 4.61438 2.5 3.67157 3.08579 3.08579C3.67157 2.5 4.61438 2.5 6.5 2.5C8.38562 2.5 9.32843 2.5 9.91421 3.08579C10.5 3.67157 10.5 4.61438 10.5 6.5C10.5 8.38562 10.5 9.32843 9.91421 9.91421C9.32843 10.5 8.38562 10.5 6.5 10.5C4.61438 10.5 3.67157 10.5 3.08579 9.91421C2.5 9.32843 2.5 8.38562 2.5 6.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          opacity="0.5"
                          d="M13.5 17.5C13.5 15.6144 13.5 14.6716 14.0858 14.0858C14.6716 13.5 15.6144 13.5 17.5 13.5C19.3856 13.5 20.3284 13.5 20.9142 14.0858C21.5 14.6716 21.5 15.6144 21.5 17.5C21.5 19.3856 21.5 20.3284 20.9142 20.9142C20.3284 21.5 19.3856 21.5 17.5 21.5C15.6144 21.5 14.6716 21.5 14.0858 20.9142C13.5 20.3284 13.5 19.3856 13.5 17.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M2.5 17.5C2.5 15.6144 2.5 14.6716 3.08579 14.0858C3.67157 13.5 4.61438 13.5 6.5 13.5C8.38562 13.5 9.32843 13.5 9.91421 14.0858C10.5 14.6716 10.5 15.6144 10.5 17.5C10.5 19.3856 10.5 20.3284 9.91421 20.9142C9.32843 21.5 8.38562 21.5 6.5 21.5C4.61438 21.5 3.67157 21.5 3.08579 20.9142C2.5 20.3284 2.5 19.3856 2.5 17.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M13.5 6.5C13.5 4.61438 13.5 3.67157 14.0858 3.08579C14.6716 2.5 15.6144 2.5 17.5 2.5C19.3856 2.5 20.3284 2.5 20.9142 3.08579C21.5 3.67157 21.5 4.61438 21.5 6.5C21.5 8.38562 21.5 9.32843 20.9142 9.91421C20.3284 10.5 19.3856 10.5 17.5 10.5C15.6144 10.5 14.6716 10.5 14.0858 9.91421C13.5 9.32843 13.5 8.38562 13.5 6.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </button>
                  </div>
                  <div>
                    <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="datatables pagination-padding ">
                {value === 'list' && (
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
                        },
                        {
                          accessor: 'subject_name',
                          title: 'Subject',
                          sortable: true,
                        },
                        {
                          accessor: 'action',
                          title: 'Actions',
                          sortable: false,
                          textAlignment: 'center',
                          render: ({ uid }) => (
                            <div className="mx-auto flex w-max items-center gap-4">
                              {user?.user_type === 2 && (
                                <>
                                  <Link href={`/teacher/material/edit/${uid}`} type="button" className="flex hover:text-info">
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
                                  <Link href={`/teacher/material/show/${uid}`} className="flex hover:text-primary">
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
                                </>
                              )}
                              {user?.user_type === 3 && (
                                <Link href={`/student/material/show/${uid}`} className="btn btn-outline-info btn-sm flex">
                                  <svg width="20" height="20" className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                                  <span className="ml-2">Show</span>
                                </Link>
                              )}
                            </div>
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
                )}
                {value === 'grid' && (
                  <div className="mt-5 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {recordsData.map((record: any) => {
                      return (
                        <div className="relative overflow-hidden rounded-md bg-white text-center shadow dark:bg-[#1c232f]" key={record.uid}>
                          <div className="relative overflow-hidden rounded-md bg-white text-center">
                            <div className="rounded-t-md bg-white/40 bg-cover bg-center">
                              <div className="h-[200px] w-full overflow-hidden">
                                <img
                                  className="h-full w-full object-cover object-center"
                                  src={record?.thumbnail ? `${process.env.NEXT_PUBLIC_URL}${record?.thumbnail}` : '/assets/images/thumbnail-default.jpg'}
                                  alt="contact_image"
                                />
                              </div>
                            </div>

                            {user?.user_type === 2 && (
                              <div className="relative -mt-10 px-6 pb-36">
                                <div className="rounded-md bg-white px-2 py-4 shadow-md dark:bg-gray-900">
                                  <div className="text-xl">{record?.name}</div>
                                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex-auto">
                                      <div className="mb-2 text-info">Class</div>
                                      <div>{record?.class_name}</div>
                                    </div>
                                    <div className="flex-auto">
                                      <div className="mb-2 text-info">Subject</div>
                                      <div>{record?.subject_name}</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-6 grid grid-cols-1 gap-4 ltr:text-left rtl:text-right">{record?.content && <TruncateText text={record.content} />}</div>
                              </div>
                            )}
                            {user?.user_type === 3 && (
                              <div className="relative -mt-10 px-6 pb-24">
                                <div className="rounded-md bg-white px-2 py-4 shadow-md dark:bg-gray-900">
                                  <div className="text-xl">{record?.name}</div>
                                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex-auto">
                                      <div className="mb-2 text-info">Class</div>
                                      <div>{record?.class_name}</div>
                                    </div>
                                    <div className="flex-auto">
                                      <div className="mb-2 text-info">Subject</div>
                                      <div>{record?.subject_name}</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-6 grid grid-cols-1 gap-4 ltr:text-left rtl:text-right">{record?.content && <TruncateText text={record.content} />}</div>
                              </div>
                            )}
                            {user?.user_type === 2 && (
                              <div className="absolute bottom-12 mt-6 flex w-full gap-4 p-6 ltr:left-0 rtl:right-0">
                                <Link href={`/teacher/material/edit/${record?.uid}`} type="button" className="btn btn-outline-primary w-1/2">
                                  Edit
                                </Link>
                                <button type="button" className="btn btn-outline-danger w-1/2" onClick={(e) => deleteRow(record?.uid)}>
                                  Delete
                                </button>
                              </div>
                            )}
                            <div className="absolute bottom-0 mt-6 flex w-full gap-4 p-6 ltr:left-0 rtl:right-0">
                              <Link href={`/teacher/material/show/${record?.uid}`} type="button" className="btn btn-outline-info w-full">
                                Show
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Material;

const MAX_WORDS = 20; // Ubah jumlah kata yang ingin ditampilkan di sini

const TruncateText = ({ text }: { text: string }) => {
  // Memotong teks menjadi array kata-kata
  const words = text.split(' ');

  // Ambil hanya sejumlah maksimum kata yang diinginkan
  const truncatedWords = words.slice(0, MAX_WORDS);

  // Gabungkan kembali kata-kata yang sudah dipotong
  const truncatedText = truncatedWords.join(' ');

  // Tambahkan karakter "......" jika teks lebih panjang dari yang ditampilkan
  const displayText = words.length > MAX_WORDS ? `${truncatedText} ......` : truncatedText;

  return <div>{HTMLReactParser(displayText)}</div>;
};
