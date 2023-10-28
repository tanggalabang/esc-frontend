import { Dialog, Transition, Tab } from '@headlessui/react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import {
  useCreateClassMutation,
  useCreateSubjectMutation,
  useDeleteClassMutation,
  useDeleteSubjectMutation,
  useEditClassMutation,
  useEditSubjectMutation,
  useGetAllClassQuery,
  useGetAllSubjectQuery,
} from '@/redux/features/class-subject/classSubjectApi';
import React, { useEffect, useState, Fragment } from 'react';
import sortBy from 'lodash/sortBy';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { useAuth } from '@/pages/hooks/auth';

type Props = {};

const index = (props: Props) => {
  // only for admin
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user && user.user_type !== 1) {
      router.push('/404');
    }
  }, [user]);
  //REDUX
  const { isLoading, data, refetch } = useGetAllClassQuery({}, { refetchOnMountOrArgChange: true });
  const [createClass, { isSuccess: successAdd, error: errorAdd }] = useCreateClassMutation();
  const [editClass, { isSuccess }] = useEditClassMutation();
  const [deleteClass, { isSuccess: successDelete }] = useDeleteClassMutation({});
  ///REDUX

  //REDUX SUBJECT
  const { isLoading: loadingSubject, data: dataSubject, refetch: refetchSubject } = useGetAllSubjectQuery({}, { refetchOnMountOrArgChange: true });
  const [createSubject, { isSuccess: successAddSubject, error: errorAddSubject }] = useCreateSubjectMutation();
  const [editSubject, { isSuccess: successSubject }] = useEditSubjectMutation();
  const [deleteSubject, { isSuccess: successDeleteSubject }] = useDeleteSubjectMutation({});
  ///REDUX SUBJECT

  //SHOW ON TABLE
  const [showLoading, setShowLoading] = useState(true);
  useEffect(() => {
    // Set isLoading to true initially
    setShowLoading(true);

    // After 1 second, set isLoading to false
    const timeout = setTimeout(() => {
      setShowLoading(false);
    }, 700);

    return () => clearTimeout(timeout); // Clean up the timeout if the component unmounts
  }, [data]);
  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);
  const [items, setItems] = useState([]);
  ///SHOW ON TABLE

  //SHOW ON TABLE SUBJECT
  const [showLoadingSubject, setShowLoadingSubject] = useState(true);
  useEffect(() => {
    // Set isLoading to true initially
    setShowLoadingSubject(true);

    // After 1 second, set isLoading to false
    const timeoutSubject = setTimeout(() => {
      setShowLoadingSubject(false);
    }, 700);

    return () => clearTimeout(timeoutSubject); // Clean up the timeout if the component unmounts
  }, [dataSubject]);

  useEffect(() => {
    if (dataSubject) {
      setItemsSubject(dataSubject);
    }
  }, [dataSubject]);
  const [itemsSubject, setItemsSubject] = useState([]);
  ///SHOW ON TABLE SUBJECT

  //ADD
  useEffect(() => {
    refetch();
    if (successAdd) {
      toast.success('Teacher add successfully');
      setItemsAdd([{ name: '' }]);
    }
  }, [successAdd]);
  const [modalAdd, setModalAdd] = useState(false);

  const [itemsAdd, setItemsAdd] = useState([{ name: '' }]);

  const addItem = async (e: any) => {
    e.preventDefault();
    const data = itemsAdd;
    await createClass(data);
    setModalAdd(false);
  };
  // const addItem = async (e: any) => {
  //   e.preventDefault();
  //   const data = itemsAdd;
  //   try {
  //     await attachCsrfToken(); // Sertakan token CSRF sebelum permintaan
  //     await createClass(data); // Gunakan .mutate untuk panggilan mutasi
  //     setModalAdd(false);
  //   } catch (error) {
  //     console.error('Gagal menambahkan item:', error);
  //     // Handle kesalahan sesuai kebutuhan
  //   }
  // };
  const handleAddLink = () => {
    setItemsAdd([...itemsAdd, { name: '' }]);
  };
  const handleRemoveLink = (index: number) => {
    // Create a copy of the itemsAdd array
    const updatedItems = [...itemsAdd];

    // Use splice to remove the item at the specified index
    updatedItems.splice(index, 1);

    // Set the state with the updated array
    setItemsAdd(updatedItems);
  };
  const handleBenefitChange = (index: number, value: any) => {
    const updatedItemsAdd = [...itemsAdd];
    updatedItemsAdd[index].name = value;
    setItemsAdd(updatedItemsAdd);
  };

  ///ADD

  //ADD SUBJECT
  useEffect(() => {
    refetchSubject();
    if (successAddSubject) {
      toast.success('Subject add successfully');
      setItemsAddSubject([{ name: '' }]);
    }
  }, [successAddSubject]);

  const [modalAddSubject, setModalAddSubject] = useState(false);

  const [itemsAddSubject, setItemsAddSubject] = useState([{ name: '' }]);

  const handleSubjectChange = (index: number, value: any) => {
    const updatedItemsAddSubject = [...itemsAddSubject];
    updatedItemsAddSubject[index].name = value;
    setItemsAddSubject(updatedItemsAddSubject);
  };

  const handleAddRowSubject = () => {
    setItemsAddSubject([...itemsAddSubject, { name: '' }]);
  };
  const handleRemoveRowSubject = (index: number) => {
    // Create a copy of the itemsAdd array
    const updatedItemsSubject = [...itemsAddSubject];
    // Use splice to remove the item at the specified index
    updatedItemsSubject.splice(index, 1);
    // Set the state with the updated array
    setItemsAddSubject(updatedItemsSubject);
  };

  const addItemSubject = async (e: any) => {
    e.preventDefault();
    const dataSubject = itemsAddSubject;
    await createSubject(dataSubject);
    setModalAddSubject(false);
  };
  ///ADD SUBJECT

  //EDIT
  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success('Student updated successfully');
    }
  }, [isSuccess]);
  const [courseId, setCourseId] = useState('');
  const editCourseData = data && data.find((i: any) => i.id === courseId);

  useEffect(() => {
    if (editCourseData) {
      setItemsEdit({
        name: editCourseData.name,
      });
    }
  }, [editCourseData]);

  const [itemsEdit, setItemsEdit] = useState({
    name: '',
  });

  const [modal1, setModal1] = useState(false);

  const modalEdit = (id: any) => {
    setCourseId(id);
    setModal1(true);
  };

  const editItem = async (e: any) => {
    e.preventDefault();
    const data = itemsEdit;
    // await editClass({ id: edibackend / app / Models / ClassModel.phptCourseData?.id, data });
    await editClass({ id: editCourseData?.id, data });
    setModal1(false);
  };
  ///EDIT

  //EDIT SUBJECT
  useEffect(() => {
    if (successSubject) {
      refetchSubject();
      toast.success('Subject updated successfully');
    }
  }, [successSubject]);
  const [subjectId, setSubjectId] = useState('');
  const editCourseDataSubject = dataSubject && dataSubject.find((i: any) => i.id === subjectId);

  useEffect(() => {
    if (editCourseDataSubject) {
      setItemsEditSubject({
        name: editCourseDataSubject.name,
      });
    }
  }, [editCourseDataSubject]);

  const [itemsEditSubject, setItemsEditSubject] = useState({
    name: '',
  });

  const [modalEditSubjectt, setModalEditSubjectt] = useState(false);

  const modalEditSubject = (id: any) => {
    setSubjectId(id);
    setModalEditSubjectt(true);
  };

  const editItemSubject = async (e: any) => {
    e.preventDefault();
    const data = itemsEditSubject;
    // await editClass({ id: edibackend / app / Models / ClassModel.phptCourseData?.id, data });
    await editSubject({ id: editCourseDataSubject?.id, data });
    setModalEditSubjectt(false);
  };
  ///EDIT SUBJECT

  //DELETE
  useEffect(() => {
    if (successDelete) {
      refetch();
    }
  }, [successDelete]);
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
        }).then((result) => {
          if (result.value) {
            Swal.fire({ title: 'Deleted!', text: 'Your data has been deleted.', icon: 'success', customClass: 'sweet-alerts' });
            deleteClass(id);
          }
        });
      }
    };
    showAlert(10);
  };
  ///DELETE

  //DELETE SUBJECT
  useEffect(() => {
    if (successDeleteSubject) {
      refetchSubject();
    }
  }, [successDeleteSubject]);
  const deleteRowSubject = async (id: any) => {
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
        }).then((result) => {
          if (result.value) {
            Swal.fire({ title: 'Deleted!', text: 'Your data has been deleted.', icon: 'success', customClass: 'sweet-alerts' });
            deleteSubject(id);
          }
        });
      }
    };
    showAlert(10);
  };
  ///DELETE SUBJECT

  //SEARCH
  const rowData = items;
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'name'));
  const [recordsData, setRecordsData] = useState(initialRecords);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'name',
    direction: 'asc',
  });
  useEffect(() => {
    setInitialRecords(sortBy(rowData, 'name'));
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
        return item.name.toString().includes(search.toLowerCase());
        // item.class.toLowerCase().includes(search.toLowerCase()) ||
        // item.subject.toLowerCase().includes(search.toLowerCase())
      });
    });
  }, [search]);
  useEffect(() => {
    const data = sortBy(initialRecords, sortStatus.columnAccessor);
    setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    setPage(1);
  }, [sortStatus]);
  ///SEARCH
  //SEARCH SUBJECT
  const rowDataSubject = itemsSubject; //ada
  const [pageSubject, setPageSubject] = useState(1);
  const PAGE_SIZES_SUBJECT = [10, 20, 30, 50, 100];
  const [searchSubject, setSearchSubject] = useState('');
  const [pageSizeSubject, setPageSizeSubject] = useState(PAGE_SIZES_SUBJECT[0]);
  const [initialRecordsSubject, setInitialRecordsSubject] = useState(sortBy(rowDataSubject, 'name')); //gaada
  const [recordsDataSubject, setRecordsDataSubject] = useState(initialRecordsSubject);
  const [sortStatusSubject, setSortStatusSubject] = useState<DataTableSortStatus>({
    columnAccessor: 'name',
    direction: 'asc',
  });
  useEffect(() => {
    setInitialRecordsSubject(sortBy(rowDataSubject, 'name')); //disini masalahnya : setInti...
  }, [itemsSubject]);
  useEffect(() => {
    setPageSubject(1);
  }, [pageSizeSubject]);

  useEffect(() => {
    const fromSubject = (pageSubject - 1) * pageSizeSubject;
    const toSubject = fromSubject + pageSizeSubject;
    setRecordsDataSubject([...initialRecordsSubject.slice(fromSubject, toSubject)]);
  }, [pageSubject, pageSizeSubject, initialRecordsSubject]);
  //--penting
  useEffect(() => {
    setInitialRecordsSubject(() => {
      return rowDataSubject?.filter((itemSubject: any) => {
        return itemSubject.name.toString().includes(searchSubject.toLowerCase());
        // item.class.toLowerCase().includes(search.toLowerCase()) ||
        // item.subject.toLowerCase().includes(search.toLowerCase())
      });
    });
  }, [searchSubject]);
  useEffect(() => {
    const dataSubject = sortBy(initialRecordsSubject, sortStatusSubject.columnAccessor);
    setInitialRecordsSubject(sortStatusSubject.direction === 'desc' ? dataSubject.reverse() : dataSubject);
    setPageSubject(1);
  }, [sortStatusSubject]);
  ///SEARCH SUBJECT
  return (
    <>
      {/* only for admin */}
      {!user ||
        (user?.user_type !== 1 && (
          <div className="screen_loader animate__animated fixed inset-0 z-[60] grid place-content-center bg-[#fafafa] dark:bg-[#060818]">
            <svg width="64" height="64" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#4361ee">
              <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="-360 67 67" dur="2.5s" repeatCount="indefinite" />
              </path>
              <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="360 67 67" dur="8s" repeatCount="indefinite" />
              </path>
            </svg>
          </div>
        ))}
      {/* !only for admin */}
    <div className="flex">
      <div className="panel mr-3 flex-1 border-white-light px-0 dark:border-[#1b2e4b]">
        {showLoading ? (
          <div className="flex items-center justify-center">
            <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
          </div>
        ) : (
          <div>
            <div className="invoice-table">
              <h5 className="mb-5 px-5 text-lg font-semibold">Class</h5>
              <div className="mb-4.5 flex flex-col gap-5 px-5 md:flex-row md:items-center">
                <div className="flex items-center gap-2">
                  <button onClick={() => setModalAdd(true)} className="btn btn-primary gap-2">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add New
                  </button>
                </div>
                <div className="ltr:ml-auto rtl:mr-auto">
                  <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="datatables pagination-padding px-5">
              <DataTable
                // className={`${isDark} table-hover whitespace-nowrap`}
                records={recordsData}
                columns={[
                  {
                    accessor: 'name',
                    sortable: true,
                  },
                  {
                    accessor: 'action',
                    title: 'Actions',
                    sortable: false,
                    textAlignment: 'center',
                    render: ({ id }) => (
                      <div className="mx-auto flex w-max items-center gap-4">
                        <button type="button" className="flex hover:text-info" onClick={() => modalEdit(id)}>
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
                        </button>
                        <button type="button" className="flex hover:text-danger" onClick={(e) => deleteRow(id)}>
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

            {/* modal add*/}
            <div className="mb-5">
              <Transition appear show={modalAdd} as={Fragment}>
                <Dialog as="div" open={modalAdd} onClose={() => setModalAdd(false)}>
                  <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0" />
                  </Transition.Child>
                  <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                    <div className="flex min-h-screen items-start justify-center px-4">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                          <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                            <div className="text-lg font-bold">Add Teacher</div>
                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalAdd(false)}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                          <div className="p-5">
                            <form onSubmit={addItem} action="">
                              <input type="hidden" name="_token" value="{{ csrf_token() }}" />
                              <div>
                                {/* <input
                                    id="name"
                                    type="text"
                                    name=""
                                    required
                                    value={itemsAdd.name} //courseInfo adalah useState object / array
                                    onChange={(
                                      e: any //mengupdate perubahan secra realtime
                                    ) => setItemsAdd({ ...itemsAdd, name: e.target.value })}
                                    placeholder="Enter Name"
                                    className="form-input"
                                  /> */}
                                <label htmlFor="shipping-charge">Nama</label>
                                {itemsAdd.map((itemsAdd: any, index: number) => (
                                  <div key={index} className="mt-2 flex">
                                    <input type="text" name="" required value={itemsAdd.name} onChange={(e) => handleBenefitChange(index, e.target.value)} className="form-input" />
                                    <button type="button" className="ml-2 mt-2 flex hover:text-danger" onClick={() => handleRemoveLink(index)}>
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
                              <button type="button" className="mt-4 flex hover:text-info" onClick={handleAddLink}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
                                  <circle opacity="0.5" cx="12" cy="12" r="10" strokeWidth="1.5" stroke="currentColor" />
                                  <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" strokeWidth="1.5" strokeLinecap="round" stroke="currentColor" />
                                </svg>
                                <span className="ml-1 mt-[-2px] text-[14px]">Add Row</span>
                              </button>
                              <div className="mt-8 flex items-center justify-end">
                                <button type="button" className="btn btn-outline-danger" onClick={() => setModalAdd(false)}>
                                  Discard
                                </button>
                                <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                  Save
                                </button>
                              </div>
                            </form>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition>
            </div>

            {/* modal edit*/}
            <div className="mb-5">
              <Transition appear show={modal1} as={Fragment}>
                <Dialog as="div" open={modal1} onClose={() => setModal1(false)}>
                  <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0" />
                  </Transition.Child>
                  <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                    <div className="flex min-h-screen items-start justify-center px-4">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                          <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                            <div className="text-lg font-bold">Edit Student</div>
                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal1(false)}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                          <br />
                          <div className="p-5">
                            <form onSubmit={editItem} action="">
                              <div className="mt-4">
                                <div>
                                  <label htmlFor="shipping-charge">Nama</label>
                                  <input
                                    id="name"
                                    type="text"
                                    name=""
                                    required
                                    value={itemsEdit.name} //courseInfo adalah useState object / array
                                    onChange={(
                                      e: any //mengupdate perubahan secra realtime
                                    ) => setItemsEdit({ ...itemsEdit, name: e.target.value })}
                                    placeholder="Enter Name"
                                    className="form-input"
                                  />
                                </div>
                              </div>
                              <div className="mt-8 flex items-center justify-end">
                                <button type="button" className="btn btn-outline-danger" onClick={() => setModal1(false)}>
                                  Discard
                                </button>
                                <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                  Save
                                </button>
                              </div>
                            </form>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition>
            </div>
          </div>
        )}
      </div>
      <div className="panel ml-3 flex-1 border-white-light px-0 dark:border-[#1b2e4b]">
        {showLoadingSubject ? (
          <div className="flex items-center justify-center">
            <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
          </div>
        ) : (
          <div>
            <div className="invoice-table">
              <h5 className="mb-5 px-5 text-lg font-semibold">Subject</h5>
              <div className="mb-4.5 flex flex-col gap-5 px-5 md:flex-row md:items-center">
                <div className="flex items-center gap-2">
                  <button onClick={() => setModalAddSubject(true)} className="btn btn-primary gap-2">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add New
                  </button>
                </div>
                <div className="ltr:ml-auto rtl:mr-auto">
                  <input type="text" className="form-input w-auto" placeholder="Search..." value={searchSubject} onChange={(e) => setSearchSubject(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="datatables pagination-padding px-5">
              <DataTable
                // className={`${isDark} table-hover whitespace-nowrap`}
                records={recordsDataSubject}
                columns={[
                  {
                    accessor: 'name',
                    sortable: true,
                  },
                  {
                    accessor: 'action',
                    title: 'Actions',
                    sortable: false,
                    textAlignment: 'center',
                    render: ({ id }) => (
                      <div className="mx-auto flex w-max items-center gap-4">
                        <button type="button" className="flex hover:text-info" onClick={() => modalEditSubject(id)}>
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
                        </button>
                        <button type="button" className="flex hover:text-danger" onClick={(e) => deleteRowSubject(id)}>
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
                    ),
                  },
                ]}
                highlightOnHover
                totalRecords={initialRecordsSubject.length}
                recordsPerPage={pageSizeSubject}
                page={pageSubject}
                onPageChange={(p) => setPageSubject(p)}
                recordsPerPageOptions={PAGE_SIZES_SUBJECT}
                onRecordsPerPageChange={setPageSizeSubject}
                sortStatus={sortStatusSubject}
                onSortStatusChange={setSortStatusSubject}
                minHeight={200}
                paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
              />
            </div>

            {/* modal add*/}
            <div className="mb-5">
              <Transition appear show={modalAddSubject} as={Fragment}>
                <Dialog as="div" open={modalAddSubject} onClose={() => setModalAddSubject(false)}>
                  <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0" />
                  </Transition.Child>
                  <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                    <div className="flex min-h-screen items-start justify-center px-4">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                          <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                            <div className="text-lg font-bold">Add Teacher</div>
                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalAddSubject(false)}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                          <div className="p-5">
                            <form onSubmit={addItemSubject} action="">
                              <input type="hidden" name="_token" value="{{ csrf_token() }}" />
                              <div>
                                <label htmlFor="shipping-charge">Nama</label>
                                {itemsAddSubject.map((itemsAddSubject: any, index: number) => (
                                  <div key={index} className="mt-2 flex">
                                    <input type="text" name="" required value={itemsAddSubject.name} onChange={(e) => handleSubjectChange(index, e.target.value)} className="form-input" />
                                    <button type="button" className="ml-2 mt-2 flex hover:text-danger" onClick={() => handleRemoveRowSubject(index)}>
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
                              <button type="button" className="mt-4 flex hover:text-info" onClick={handleAddRowSubject}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
                                  <circle opacity="0.5" cx="12" cy="12" r="10" strokeWidth="1.5" stroke="currentColor" />
                                  <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" strokeWidth="1.5" strokeLinecap="round" stroke="currentColor" />
                                </svg>
                                <span className="ml-1 mt-[-2px] text-[14px]">Add Row</span>
                              </button>
                              <div className="mt-8 flex items-center justify-end">
                                <button type="button" className="btn btn-outline-danger" onClick={() => setModalAddSubject(false)}>
                                  Discard
                                </button>
                                <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                  Save
                                </button>
                              </div>
                            </form>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition>
            </div>

            {/* modal edit*/}
            <div className="mb-5">
              <Transition appear show={modalEditSubjectt} as={Fragment}>
                <Dialog as="div" open={modalEditSubjectt} onClose={() => setModalEditSubjectt(false)}>
                  <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0" />
                  </Transition.Child>
                  <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                    <div className="flex min-h-screen items-start justify-center px-4">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                          <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                            <div className="text-lg font-bold">Edit Student</div>
                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalEditSubjectt(false)}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                          <br />
                          <div className="p-5">
                            <form onSubmit={editItemSubject} action="">
                              <div className="mt-4">
                                <div>
                                  <label htmlFor="shipping-charge">Nama</label>
                                  <input
                                    id="name"
                                    type="text"
                                    name=""
                                    required
                                    value={itemsEditSubject.name} //courseInfo adalah useState object / array
                                    onChange={(
                                      e: any //mengupdate perubahan secra realtime
                                    ) => setItemsEditSubject({ ...itemsEditSubject, name: e.target.value })}
                                    placeholder="Enter Name"
                                    className="form-input"
                                  />
                                </div>
                              </div>
                              <div className="mt-8 flex items-center justify-end">
                                <button type="button" className="btn btn-outline-danger" onClick={() => setModalEditSubjectt(false)}>
                                  Discard
                                </button>
                                <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                  Save
                                </button>
                              </div>
                            </form>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default index;
