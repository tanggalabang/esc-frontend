import { Dialog, Transition, Tab } from '@headlessui/react';
import { useCreateCourseMutation, useCreateExcelCourseMutation, useDeleteCourseMutation, useEditCourseMutation, useGetAllCoursesQuery } from '@/redux/features/student/studentApi';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect, Fragment } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { downloadExcel } from 'react-export-table-to-excel';
import sortBy from 'lodash/sortBy';
import { useGetAllClassQuery } from '@/redux/features/class-subject/classSubjectApi';
import { useRouter } from 'next/router';
import { useAuth } from '@/pages/hooks/auth';

const List = () => {
  //REDUX
  const [courseId, setCourseId] = useState('');
  const { isLoading, data, refetch } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });
  const [editCourse, { isSuccess }] = useEditCourseMutation();
  const [deleteCourse, { isSuccess: successDelete }] = useDeleteCourseMutation({});
  const [createExcel, { isLoading: loadingExcel, isSuccess: successExcel, error }] = useCreateExcelCourseMutation();
  const [createCourse, { isSuccess: successAdd, error: errorAdd }] = useCreateCourseMutation();
  ///REDUX
  //SHOW
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  //--modal show
  const [modalShow, setModalShow] = useState(false);
  const [showId, setShowId] = useState();
  const [itemsShow, setItemsShow] = useState({});
  //--find data and show
  const showData = data && data.find((i: any) => i.id === showId);

  useEffect(() => {
    if (showData) {
      setItemsShow(showData);
    }
  }, [showData]);
  //--handle show
  const handleShow = (id: any) => {
    setShowId(id);
    setModalShow(true);
  };
  ///SHOW
  //CREATE
  //--basic
  useEffect(() => {
    refetch();
    if (successAdd) {
      toast.success('Student add successfully');
      setItemsAdd({
        nis: '',
        name: '',
        email: '',
        class: '',
      });
    }
  }, [successAdd]);
  //----modal create
  const [modalAdd, setModalAdd] = useState(false);

  const [itemsAdd, setItemsAdd] = useState({
    nis: '',
    name: '',
    email: '',
    class: '',
  });

  //----handle add
  const addItem = async (e: any) => {
    e.preventDefault();
    const data = itemsAdd;
    await createCourse(data);
    setModalAdd(false);
  };

  //--excel
  useEffect(() => {
    if (successExcel) {
      refetch();
      toast.success('Student add with excel successfully');
    }
    if (error) {
      refetch();
      if ('data' in error) {
        const errorMessage = error as any;
        if (errorMessage.data.error == 'Trying to access array offset on value of type null') {
          toast.error('Class does not found');
        } else {
          toast.error(errorMessage.data.error);
        }
      }
    }
  }, [successExcel, error]);
  //----import excel
  const handleDownload = () => {
    // Ganti URL ini sesuai dengan URL file Excel yang akan Anda unduh.
    const excelUrl = process.env.NEXT_PUBLIC_SERVER_URI + 'template-excel';

    // Inisiasi unduhan file Excel.
    const link = document.createElement('a');
    link.href = excelUrl;
    link.download = 'example-excel.xlsx'; // Nama file Excel yang akan diunduh.
    link.click();
  };
  const [modalExcel, setModalExcel] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file);
  };

  //----handle import excel
  const handleUpload = async (e: any) => {
    if (selectedFile) {
      e.preventDefault();
      const formData = new FormData();
      formData.append('file', selectedFile);

      await createExcel(formData);

      setModalExcel(false);
    }
  };

  ///CREATE
  //EDIT
  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success('Student updated successfully');
    }
  }, [isSuccess]);
  //--find and show data for edit
  const editCourseData = data && data.find((i: any) => i.id === courseId);

  useEffect(() => {
    if (editCourseData) {
      setItemsEdit({
        nis: editCourseData.nis,
        name: editCourseData.name,
        email: editCourseData.email,
        class: editCourseData.class,
      });
    }
  }, [editCourseData]);

  //--modal edit
  const [modal1, setModal1] = useState(false);

  const modalEdit = (id: any) => {
    setCourseId(id);
    setModal1(true);
  };

  const [itemsEdit, setItemsEdit] = useState({
    nis: '',
    name: '',
    email: '',
  });

  //--handle edit
  const editItem = async (e: any) => {
    e.preventDefault();
    const data = itemsEdit;
    await editCourse({ id: editCourseData?.id, data });
    setModal1(false);
  };
  ///EDIT
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
            deleteCourse(id);
          }
        });
      }
    };
    showAlert(10);
  };

  //EXPORT TO COUPLE FILE
  const col = ['nis', 'name', 'email'];

  const rowData = items;
  const header = ['Nis', 'Name', 'Email'];
  const capitalize = (text: any) => {
    return text
      .replace('_', ' ')
      .replace('-', ' ')
      .toLowerCase()
      .split(' ')
      .map((s: any) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');
  };

  const exportTable = (type: any) => {
    let columns: any = col;
    let records = rowData;
    let filename = 'table';

    let newVariable: any;
    newVariable = window.navigator;

    if (type === 'csv') {
      let coldelimiter = ';';
      let linedelimiter = '\n';
      let result = columns
        .map((d: any) => {
          return capitalize(d);
        })
        .join(coldelimiter);
      result += linedelimiter;
      records.map((item: any) => {
        columns.map((d: any, index: any) => {
          if (index > 0) {
            result += coldelimiter;
          }
          let val = item[d] ? item[d] : '';
          result += val;
        });
        result += linedelimiter;
      });

      if (result == null) return;
      if (!result.match(/^data:text\/csv/i) && !newVariable.msSaveOrOpenBlob) {
        var data = 'data:application/csv;charset=utf-8,' + encodeURIComponent(result);
        var link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename + '.csv');
        link.click();
      } else {
        var blob = new Blob([result]);
        if (newVariable.msSaveOrOpenBlob) {
          newVariable.msSaveBlob(blob, filename + '.csv');
        }
      }
    } else if (type === 'print') {
      var rowhtml = '<p>' + filename + '</p>';
      rowhtml +=
        '<table style="width: 100%; " cellpadding="0" cellcpacing="0"><thead><tr style="color: #515365; background: #eff5ff; -webkit-print-color-adjust: exact; print-color-adjust: exact; "> ';
      columns.map((d: any) => {
        rowhtml += '<th>' + capitalize(d) + '</th>';
      });
      rowhtml += '</tr></thead>';
      rowhtml += '<tbody>';
      records.map((item: any) => {
        rowhtml += '<tr>';
        columns.map((d: any) => {
          let val = item[d] ? item[d] : '';
          rowhtml += '<td>' + val + '</td>';
        });
        rowhtml += '</tr>';
      });
      rowhtml +=
        '<style>body {font-family:Arial; color:#495057;}p{text-align:center;font-size:18px;font-weight:bold;margin:15px;}table{ border-collapse: collapse; border-spacing: 0; }th,td{font-size:12px;text-align:left;padding: 4px;}th{padding:8px 4px;}tr:nth-child(2n-1){background:#f7f7f7; }</style>';
      rowhtml += '</tbody></table>';
      var winPrint: any = window.open('', '', 'left=0,top=0,width=1000,height=600,toolbar=0,scrollbars=0,status=0');
      winPrint.document.write('<title>Print</title>' + rowhtml);
      winPrint.document.close();
      winPrint.focus();
      winPrint.print();
    } else if (type === 'txt') {
      let coldelimiter = ',';
      let linedelimiter = '\n';
      let result = columns
        .map((d: any) => {
          return capitalize(d);
        })
        .join(coldelimiter);
      result += linedelimiter;
      records.map((item: any) => {
        columns.map((d: any, index: any) => {
          if (index > 0) {
            result += coldelimiter;
          }
          let val = item[d] ? item[d] : '';
          result += val;
        });
        result += linedelimiter;
      });

      if (result == null) return;
      if (!result.match(/^data:text\/txt/i) && !newVariable.msSaveOrOpenBlob) {
        var data1 = 'data:application/txt;charset=utf-8,' + encodeURIComponent(result);
        var link1 = document.createElement('a');
        link1.setAttribute('href', data1);
        link1.setAttribute('download', filename + '.txt');
        link1.click();
      } else {
        var blob1 = new Blob([result]);
        if (newVariable.msSaveOrOpenBlob) {
          newVariable.msSaveBlob(blob1, filename + '.txt');
        }
      }
    }
  };
  function handleDownloadExcel() {
    downloadExcel({
      fileName: 'table',
      sheet: 'react-export-table-to-excel',
      tablePayload: {
        header,
        body: rowData,
      },
    });
  }
  //EXPORT TO COUPLE FILE
  //SEARCH
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
        return (
          item.nis?.toString().includes(search.toLowerCase()) ||
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.email.toLowerCase().includes(search.toLowerCase()) ||
          item.class.toLowerCase().includes(search.toLowerCase())
        );
      });
    });
  }, [search]);
  useEffect(() => {
    const data = sortBy(initialRecords, sortStatus.columnAccessor);
    setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    setPage(1);
  }, [sortStatus]);
  ///SEARCH

  const { data: dataClass } = useGetAllClassQuery({});

  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    if (itemsShow?.profile_pic != null) {
      const fullImageUrl = `${process.env.NEXT_PUBLIC_URL}${itemsShow?.profile_pic}`;
      setProfileImage(fullImageUrl);
    } else {
      const fullImageUrl = '/assets/images/profile-default.jpg';
      setProfileImage(fullImageUrl);
    }
  }, [itemsShow]);

  // only for admin
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.user_type !== 1) {
      router.push('/404');
    }
  }, [user]); // Gunakan array dependensi kosong agar efek hanya dijalankan sekali
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
      <div className="panel border-white-light px-0 dark:border-[#1b2e4b]">
        {/* {!recordsData || recordsData.length === 0 ? ( */}
        {isLoading ? (
          <div className="flex items-center justify-center">
            <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
          </div>
        ) : (
          <div>
            <div className="invoice-table">
              <div className="mb-4.5 flex flex-col gap-5 px-5 md:flex-row md:items-center">
                <div className="grid grid-cols-2 items-center gap-2 sm:flex xl:flex">
                  <button onClick={() => setModalAdd(true)} className="btn btn-primary gap-2">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add New
                  </button>
                  <button type="button" className="btn btn-success gap-2" onClick={() => setModalExcel(true)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                      <path
                        opacity="0.5"
                        d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path d="M12 3V16M12 16L16 11.625M12 16L8 11.625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    Import Excel
                  </button>

                  <div className="hidden sm:flex xl:flex xl:flex-wrap xl:items-center">
                    <button type="button" onClick={() => exportTable('csv')} className="btn btn-outline-warning btn-sm m-1 ">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                        <path
                          d="M15.3929 4.05365L14.8912 4.61112L15.3929 4.05365ZM19.3517 7.61654L18.85 8.17402L19.3517 7.61654ZM21.654 10.1541L20.9689 10.4592V10.4592L21.654 10.1541ZM3.17157 20.8284L3.7019 20.2981H3.7019L3.17157 20.8284ZM20.8284 20.8284L20.2981 20.2981L20.2981 20.2981L20.8284 20.8284ZM14 21.25H10V22.75H14V21.25ZM2.75 14V10H1.25V14H2.75ZM21.25 13.5629V14H22.75V13.5629H21.25ZM14.8912 4.61112L18.85 8.17402L19.8534 7.05907L15.8947 3.49618L14.8912 4.61112ZM22.75 13.5629C22.75 11.8745 22.7651 10.8055 22.3391 9.84897L20.9689 10.4592C21.2349 11.0565 21.25 11.742 21.25 13.5629H22.75ZM18.85 8.17402C20.2034 9.3921 20.7029 9.86199 20.9689 10.4592L22.3391 9.84897C21.9131 8.89241 21.1084 8.18853 19.8534 7.05907L18.85 8.17402ZM10.0298 2.75C11.6116 2.75 12.2085 2.76158 12.7405 2.96573L13.2779 1.5653C12.4261 1.23842 11.498 1.25 10.0298 1.25V2.75ZM15.8947 3.49618C14.8087 2.51878 14.1297 1.89214 13.2779 1.5653L12.7405 2.96573C13.2727 3.16993 13.7215 3.55836 14.8912 4.61112L15.8947 3.49618ZM10 21.25C8.09318 21.25 6.73851 21.2484 5.71085 21.1102C4.70476 20.975 4.12511 20.7213 3.7019 20.2981L2.64124 21.3588C3.38961 22.1071 4.33855 22.4392 5.51098 22.5969C6.66182 22.7516 8.13558 22.75 10 22.75V21.25ZM1.25 14C1.25 15.8644 1.24841 17.3382 1.40313 18.489C1.56076 19.6614 1.89288 20.6104 2.64124 21.3588L3.7019 20.2981C3.27869 19.8749 3.02502 19.2952 2.88976 18.2892C2.75159 17.2615 2.75 15.9068 2.75 14H1.25ZM14 22.75C15.8644 22.75 17.3382 22.7516 18.489 22.5969C19.6614 22.4392 20.6104 22.1071 21.3588 21.3588L20.2981 20.2981C19.8749 20.7213 19.2952 20.975 18.2892 21.1102C17.2615 21.2484 15.9068 21.25 14 21.25V22.75ZM21.25 14C21.25 15.9068 21.2484 17.2615 21.1102 18.2892C20.975 19.2952 20.7213 19.8749 20.2981 20.2981L21.3588 21.3588C22.1071 20.6104 22.4392 19.6614 22.5969 18.489C22.7516 17.3382 22.75 15.8644 22.75 14H21.25ZM2.75 10C2.75 8.09318 2.75159 6.73851 2.88976 5.71085C3.02502 4.70476 3.27869 4.12511 3.7019 3.7019L2.64124 2.64124C1.89288 3.38961 1.56076 4.33855 1.40313 5.51098C1.24841 6.66182 1.25 8.13558 1.25 10H2.75ZM10.0298 1.25C8.15538 1.25 6.67442 1.24842 5.51887 1.40307C4.34232 1.56054 3.39019 1.8923 2.64124 2.64124L3.7019 3.7019C4.12453 3.27928 4.70596 3.02525 5.71785 2.88982C6.75075 2.75158 8.11311 2.75 10.0298 2.75V1.25Z"
                          fill="currentColor"
                        />
                        <path opacity="0.5" d="M13 2.5V5C13 7.35702 13 8.53553 13.7322 9.26777C14.4645 10 15.643 10 18 10H22" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      CSV
                    </button>
                    <button type="button" onClick={() => exportTable('txt')} className="btn btn-outline-warning btn-sm m-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                        <path
                          d="M15.3929 4.05365L14.8912 4.61112L15.3929 4.05365ZM19.3517 7.61654L18.85 8.17402L19.3517 7.61654ZM21.654 10.1541L20.9689 10.4592V10.4592L21.654 10.1541ZM3.17157 20.8284L3.7019 20.2981H3.7019L3.17157 20.8284ZM20.8284 20.8284L20.2981 20.2981L20.2981 20.2981L20.8284 20.8284ZM14 21.25H10V22.75H14V21.25ZM2.75 14V10H1.25V14H2.75ZM21.25 13.5629V14H22.75V13.5629H21.25ZM14.8912 4.61112L18.85 8.17402L19.8534 7.05907L15.8947 3.49618L14.8912 4.61112ZM22.75 13.5629C22.75 11.8745 22.7651 10.8055 22.3391 9.84897L20.9689 10.4592C21.2349 11.0565 21.25 11.742 21.25 13.5629H22.75ZM18.85 8.17402C20.2034 9.3921 20.7029 9.86199 20.9689 10.4592L22.3391 9.84897C21.9131 8.89241 21.1084 8.18853 19.8534 7.05907L18.85 8.17402ZM10.0298 2.75C11.6116 2.75 12.2085 2.76158 12.7405 2.96573L13.2779 1.5653C12.4261 1.23842 11.498 1.25 10.0298 1.25V2.75ZM15.8947 3.49618C14.8087 2.51878 14.1297 1.89214 13.2779 1.5653L12.7405 2.96573C13.2727 3.16993 13.7215 3.55836 14.8912 4.61112L15.8947 3.49618ZM10 21.25C8.09318 21.25 6.73851 21.2484 5.71085 21.1102C4.70476 20.975 4.12511 20.7213 3.7019 20.2981L2.64124 21.3588C3.38961 22.1071 4.33855 22.4392 5.51098 22.5969C6.66182 22.7516 8.13558 22.75 10 22.75V21.25ZM1.25 14C1.25 15.8644 1.24841 17.3382 1.40313 18.489C1.56076 19.6614 1.89288 20.6104 2.64124 21.3588L3.7019 20.2981C3.27869 19.8749 3.02502 19.2952 2.88976 18.2892C2.75159 17.2615 2.75 15.9068 2.75 14H1.25ZM14 22.75C15.8644 22.75 17.3382 22.7516 18.489 22.5969C19.6614 22.4392 20.6104 22.1071 21.3588 21.3588L20.2981 20.2981C19.8749 20.7213 19.2952 20.975 18.2892 21.1102C17.2615 21.2484 15.9068 21.25 14 21.25V22.75ZM21.25 14C21.25 15.9068 21.2484 17.2615 21.1102 18.2892C20.975 19.2952 20.7213 19.8749 20.2981 20.2981L21.3588 21.3588C22.1071 20.6104 22.4392 19.6614 22.5969 18.489C22.7516 17.3382 22.75 15.8644 22.75 14H21.25ZM2.75 10C2.75 8.09318 2.75159 6.73851 2.88976 5.71085C3.02502 4.70476 3.27869 4.12511 3.7019 3.7019L2.64124 2.64124C1.89288 3.38961 1.56076 4.33855 1.40313 5.51098C1.24841 6.66182 1.25 8.13558 1.25 10H2.75ZM10.0298 1.25C8.15538 1.25 6.67442 1.24842 5.51887 1.40307C4.34232 1.56054 3.39019 1.8923 2.64124 2.64124L3.7019 3.7019C4.12453 3.27928 4.70596 3.02525 5.71785 2.88982C6.75075 2.75158 8.11311 2.75 10.0298 2.75V1.25Z"
                          fill="currentColor"
                        />
                        <path opacity="0.5" d="M6 14.5H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path opacity="0.5" d="M6 18H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path opacity="0.5" d="M13 2.5V5C13 7.35702 13 8.53553 13.7322 9.26777C14.4645 10 15.643 10 18 10H22" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      TXT
                    </button>

                    <button type="button" className="btn btn-outline-warning btn-sm m-1" onClick={handleDownloadExcel}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                        <path
                          d="M15.3929 4.05365L14.8912 4.61112L15.3929 4.05365ZM19.3517 7.61654L18.85 8.17402L19.3517 7.61654ZM21.654 10.1541L20.9689 10.4592V10.4592L21.654 10.1541ZM3.17157 20.8284L3.7019 20.2981H3.7019L3.17157 20.8284ZM20.8284 20.8284L20.2981 20.2981L20.2981 20.2981L20.8284 20.8284ZM14 21.25H10V22.75H14V21.25ZM2.75 14V10H1.25V14H2.75ZM21.25 13.5629V14H22.75V13.5629H21.25ZM14.8912 4.61112L18.85 8.17402L19.8534 7.05907L15.8947 3.49618L14.8912 4.61112ZM22.75 13.5629C22.75 11.8745 22.7651 10.8055 22.3391 9.84897L20.9689 10.4592C21.2349 11.0565 21.25 11.742 21.25 13.5629H22.75ZM18.85 8.17402C20.2034 9.3921 20.7029 9.86199 20.9689 10.4592L22.3391 9.84897C21.9131 8.89241 21.1084 8.18853 19.8534 7.05907L18.85 8.17402ZM10.0298 2.75C11.6116 2.75 12.2085 2.76158 12.7405 2.96573L13.2779 1.5653C12.4261 1.23842 11.498 1.25 10.0298 1.25V2.75ZM15.8947 3.49618C14.8087 2.51878 14.1297 1.89214 13.2779 1.5653L12.7405 2.96573C13.2727 3.16993 13.7215 3.55836 14.8912 4.61112L15.8947 3.49618ZM10 21.25C8.09318 21.25 6.73851 21.2484 5.71085 21.1102C4.70476 20.975 4.12511 20.7213 3.7019 20.2981L2.64124 21.3588C3.38961 22.1071 4.33855 22.4392 5.51098 22.5969C6.66182 22.7516 8.13558 22.75 10 22.75V21.25ZM1.25 14C1.25 15.8644 1.24841 17.3382 1.40313 18.489C1.56076 19.6614 1.89288 20.6104 2.64124 21.3588L3.7019 20.2981C3.27869 19.8749 3.02502 19.2952 2.88976 18.2892C2.75159 17.2615 2.75 15.9068 2.75 14H1.25ZM14 22.75C15.8644 22.75 17.3382 22.7516 18.489 22.5969C19.6614 22.4392 20.6104 22.1071 21.3588 21.3588L20.2981 20.2981C19.8749 20.7213 19.2952 20.975 18.2892 21.1102C17.2615 21.2484 15.9068 21.25 14 21.25V22.75ZM21.25 14C21.25 15.9068 21.2484 17.2615 21.1102 18.2892C20.975 19.2952 20.7213 19.8749 20.2981 20.2981L21.3588 21.3588C22.1071 20.6104 22.4392 19.6614 22.5969 18.489C22.7516 17.3382 22.75 15.8644 22.75 14H21.25ZM2.75 10C2.75 8.09318 2.75159 6.73851 2.88976 5.71085C3.02502 4.70476 3.27869 4.12511 3.7019 3.7019L2.64124 2.64124C1.89288 3.38961 1.56076 4.33855 1.40313 5.51098C1.24841 6.66182 1.25 8.13558 1.25 10H2.75ZM10.0298 1.25C8.15538 1.25 6.67442 1.24842 5.51887 1.40307C4.34232 1.56054 3.39019 1.8923 2.64124 2.64124L3.7019 3.7019C4.12453 3.27928 4.70596 3.02525 5.71785 2.88982C6.75075 2.75158 8.11311 2.75 10.0298 2.75V1.25Z"
                          fill="currentColor"
                        />
                        <path opacity="0.5" d="M13 2.5V5C13 7.35702 13 8.53553 13.7322 9.26777C14.4645 10 15.643 10 18 10H22" stroke="currentColor" strokeWidth="1.5" />
                        <path opacity="0.5" d="M7 14L6 15L7 16M11.5 16L12.5 17L11.5 18M10 14L8.5 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      JSON
                    </button>

                    <button type="button" onClick={() => exportTable('print')} className="btn btn-outline-warning btn-sm m-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                        <path
                          d="M6 17.9827C4.44655 17.9359 3.51998 17.7626 2.87868 17.1213C2 16.2426 2 14.8284 2 12C2 9.17157 2 7.75736 2.87868 6.87868C3.75736 6 5.17157 6 8 6H16C18.8284 6 20.2426 6 21.1213 6.87868C22 7.75736 22 9.17157 22 12C22 14.8284 22 16.2426 21.1213 17.1213C20.48 17.7626 19.5535 17.9359 18 17.9827"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path opacity="0.5" d="M9 10H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M19 14L5 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path
                          d="M18 14V16C18 18.8284 18 20.2426 17.1213 21.1213C16.2426 22 14.8284 22 12 22C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V14"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          opacity="0.5"
                          d="M17.9827 6C17.9359 4.44655 17.7626 3.51998 17.1213 2.87868C16.2427 2 14.8284 2 12 2C9.17158 2 7.75737 2 6.87869 2.87868C6.23739 3.51998 6.06414 4.44655 6.01733 6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <circle opacity="0.5" cx="17" cy="10" r="1" fill="currentColor" />
                        <path opacity="0.5" d="M15 16.5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path opacity="0.5" d="M13 19H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      PRINT
                    </button>
                  </div>
                </div>
                <div className="xl:ltr:ml-auto xl:rtl:mr-auto">
                  <input type="text" className="form-input w-full xl:w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="mb-4 flex items-center justify-between px-5 sm:hidden xl:hidden">
                <button type="button" onClick={() => exportTable('csv')} className="btn btn-outline-warning btn-sm m-1 ">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                    <path
                      d="M15.3929 4.05365L14.8912 4.61112L15.3929 4.05365ZM19.3517 7.61654L18.85 8.17402L19.3517 7.61654ZM21.654 10.1541L20.9689 10.4592V10.4592L21.654 10.1541ZM3.17157 20.8284L3.7019 20.2981H3.7019L3.17157 20.8284ZM20.8284 20.8284L20.2981 20.2981L20.2981 20.2981L20.8284 20.8284ZM14 21.25H10V22.75H14V21.25ZM2.75 14V10H1.25V14H2.75ZM21.25 13.5629V14H22.75V13.5629H21.25ZM14.8912 4.61112L18.85 8.17402L19.8534 7.05907L15.8947 3.49618L14.8912 4.61112ZM22.75 13.5629C22.75 11.8745 22.7651 10.8055 22.3391 9.84897L20.9689 10.4592C21.2349 11.0565 21.25 11.742 21.25 13.5629H22.75ZM18.85 8.17402C20.2034 9.3921 20.7029 9.86199 20.9689 10.4592L22.3391 9.84897C21.9131 8.89241 21.1084 8.18853 19.8534 7.05907L18.85 8.17402ZM10.0298 2.75C11.6116 2.75 12.2085 2.76158 12.7405 2.96573L13.2779 1.5653C12.4261 1.23842 11.498 1.25 10.0298 1.25V2.75ZM15.8947 3.49618C14.8087 2.51878 14.1297 1.89214 13.2779 1.5653L12.7405 2.96573C13.2727 3.16993 13.7215 3.55836 14.8912 4.61112L15.8947 3.49618ZM10 21.25C8.09318 21.25 6.73851 21.2484 5.71085 21.1102C4.70476 20.975 4.12511 20.7213 3.7019 20.2981L2.64124 21.3588C3.38961 22.1071 4.33855 22.4392 5.51098 22.5969C6.66182 22.7516 8.13558 22.75 10 22.75V21.25ZM1.25 14C1.25 15.8644 1.24841 17.3382 1.40313 18.489C1.56076 19.6614 1.89288 20.6104 2.64124 21.3588L3.7019 20.2981C3.27869 19.8749 3.02502 19.2952 2.88976 18.2892C2.75159 17.2615 2.75 15.9068 2.75 14H1.25ZM14 22.75C15.8644 22.75 17.3382 22.7516 18.489 22.5969C19.6614 22.4392 20.6104 22.1071 21.3588 21.3588L20.2981 20.2981C19.8749 20.7213 19.2952 20.975 18.2892 21.1102C17.2615 21.2484 15.9068 21.25 14 21.25V22.75ZM21.25 14C21.25 15.9068 21.2484 17.2615 21.1102 18.2892C20.975 19.2952 20.7213 19.8749 20.2981 20.2981L21.3588 21.3588C22.1071 20.6104 22.4392 19.6614 22.5969 18.489C22.7516 17.3382 22.75 15.8644 22.75 14H21.25ZM2.75 10C2.75 8.09318 2.75159 6.73851 2.88976 5.71085C3.02502 4.70476 3.27869 4.12511 3.7019 3.7019L2.64124 2.64124C1.89288 3.38961 1.56076 4.33855 1.40313 5.51098C1.24841 6.66182 1.25 8.13558 1.25 10H2.75ZM10.0298 1.25C8.15538 1.25 6.67442 1.24842 5.51887 1.40307C4.34232 1.56054 3.39019 1.8923 2.64124 2.64124L3.7019 3.7019C4.12453 3.27928 4.70596 3.02525 5.71785 2.88982C6.75075 2.75158 8.11311 2.75 10.0298 2.75V1.25Z"
                      fill="currentColor"
                    />
                    <path opacity="0.5" d="M13 2.5V5C13 7.35702 13 8.53553 13.7322 9.26777C14.4645 10 15.643 10 18 10H22" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  CSV
                </button>
                <button type="button" onClick={() => exportTable('txt')} className="btn btn-outline-warning btn-sm m-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                    <path
                      d="M15.3929 4.05365L14.8912 4.61112L15.3929 4.05365ZM19.3517 7.61654L18.85 8.17402L19.3517 7.61654ZM21.654 10.1541L20.9689 10.4592V10.4592L21.654 10.1541ZM3.17157 20.8284L3.7019 20.2981H3.7019L3.17157 20.8284ZM20.8284 20.8284L20.2981 20.2981L20.2981 20.2981L20.8284 20.8284ZM14 21.25H10V22.75H14V21.25ZM2.75 14V10H1.25V14H2.75ZM21.25 13.5629V14H22.75V13.5629H21.25ZM14.8912 4.61112L18.85 8.17402L19.8534 7.05907L15.8947 3.49618L14.8912 4.61112ZM22.75 13.5629C22.75 11.8745 22.7651 10.8055 22.3391 9.84897L20.9689 10.4592C21.2349 11.0565 21.25 11.742 21.25 13.5629H22.75ZM18.85 8.17402C20.2034 9.3921 20.7029 9.86199 20.9689 10.4592L22.3391 9.84897C21.9131 8.89241 21.1084 8.18853 19.8534 7.05907L18.85 8.17402ZM10.0298 2.75C11.6116 2.75 12.2085 2.76158 12.7405 2.96573L13.2779 1.5653C12.4261 1.23842 11.498 1.25 10.0298 1.25V2.75ZM15.8947 3.49618C14.8087 2.51878 14.1297 1.89214 13.2779 1.5653L12.7405 2.96573C13.2727 3.16993 13.7215 3.55836 14.8912 4.61112L15.8947 3.49618ZM10 21.25C8.09318 21.25 6.73851 21.2484 5.71085 21.1102C4.70476 20.975 4.12511 20.7213 3.7019 20.2981L2.64124 21.3588C3.38961 22.1071 4.33855 22.4392 5.51098 22.5969C6.66182 22.7516 8.13558 22.75 10 22.75V21.25ZM1.25 14C1.25 15.8644 1.24841 17.3382 1.40313 18.489C1.56076 19.6614 1.89288 20.6104 2.64124 21.3588L3.7019 20.2981C3.27869 19.8749 3.02502 19.2952 2.88976 18.2892C2.75159 17.2615 2.75 15.9068 2.75 14H1.25ZM14 22.75C15.8644 22.75 17.3382 22.7516 18.489 22.5969C19.6614 22.4392 20.6104 22.1071 21.3588 21.3588L20.2981 20.2981C19.8749 20.7213 19.2952 20.975 18.2892 21.1102C17.2615 21.2484 15.9068 21.25 14 21.25V22.75ZM21.25 14C21.25 15.9068 21.2484 17.2615 21.1102 18.2892C20.975 19.2952 20.7213 19.8749 20.2981 20.2981L21.3588 21.3588C22.1071 20.6104 22.4392 19.6614 22.5969 18.489C22.7516 17.3382 22.75 15.8644 22.75 14H21.25ZM2.75 10C2.75 8.09318 2.75159 6.73851 2.88976 5.71085C3.02502 4.70476 3.27869 4.12511 3.7019 3.7019L2.64124 2.64124C1.89288 3.38961 1.56076 4.33855 1.40313 5.51098C1.24841 6.66182 1.25 8.13558 1.25 10H2.75ZM10.0298 1.25C8.15538 1.25 6.67442 1.24842 5.51887 1.40307C4.34232 1.56054 3.39019 1.8923 2.64124 2.64124L3.7019 3.7019C4.12453 3.27928 4.70596 3.02525 5.71785 2.88982C6.75075 2.75158 8.11311 2.75 10.0298 2.75V1.25Z"
                      fill="currentColor"
                    />
                    <path opacity="0.5" d="M6 14.5H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path opacity="0.5" d="M6 18H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path opacity="0.5" d="M13 2.5V5C13 7.35702 13 8.53553 13.7322 9.26777C14.4645 10 15.643 10 18 10H22" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  TXT
                </button>

                <button type="button" className="btn btn-outline-warning btn-sm m-1" onClick={handleDownloadExcel}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                    <path
                      d="M15.3929 4.05365L14.8912 4.61112L15.3929 4.05365ZM19.3517 7.61654L18.85 8.17402L19.3517 7.61654ZM21.654 10.1541L20.9689 10.4592V10.4592L21.654 10.1541ZM3.17157 20.8284L3.7019 20.2981H3.7019L3.17157 20.8284ZM20.8284 20.8284L20.2981 20.2981L20.2981 20.2981L20.8284 20.8284ZM14 21.25H10V22.75H14V21.25ZM2.75 14V10H1.25V14H2.75ZM21.25 13.5629V14H22.75V13.5629H21.25ZM14.8912 4.61112L18.85 8.17402L19.8534 7.05907L15.8947 3.49618L14.8912 4.61112ZM22.75 13.5629C22.75 11.8745 22.7651 10.8055 22.3391 9.84897L20.9689 10.4592C21.2349 11.0565 21.25 11.742 21.25 13.5629H22.75ZM18.85 8.17402C20.2034 9.3921 20.7029 9.86199 20.9689 10.4592L22.3391 9.84897C21.9131 8.89241 21.1084 8.18853 19.8534 7.05907L18.85 8.17402ZM10.0298 2.75C11.6116 2.75 12.2085 2.76158 12.7405 2.96573L13.2779 1.5653C12.4261 1.23842 11.498 1.25 10.0298 1.25V2.75ZM15.8947 3.49618C14.8087 2.51878 14.1297 1.89214 13.2779 1.5653L12.7405 2.96573C13.2727 3.16993 13.7215 3.55836 14.8912 4.61112L15.8947 3.49618ZM10 21.25C8.09318 21.25 6.73851 21.2484 5.71085 21.1102C4.70476 20.975 4.12511 20.7213 3.7019 20.2981L2.64124 21.3588C3.38961 22.1071 4.33855 22.4392 5.51098 22.5969C6.66182 22.7516 8.13558 22.75 10 22.75V21.25ZM1.25 14C1.25 15.8644 1.24841 17.3382 1.40313 18.489C1.56076 19.6614 1.89288 20.6104 2.64124 21.3588L3.7019 20.2981C3.27869 19.8749 3.02502 19.2952 2.88976 18.2892C2.75159 17.2615 2.75 15.9068 2.75 14H1.25ZM14 22.75C15.8644 22.75 17.3382 22.7516 18.489 22.5969C19.6614 22.4392 20.6104 22.1071 21.3588 21.3588L20.2981 20.2981C19.8749 20.7213 19.2952 20.975 18.2892 21.1102C17.2615 21.2484 15.9068 21.25 14 21.25V22.75ZM21.25 14C21.25 15.9068 21.2484 17.2615 21.1102 18.2892C20.975 19.2952 20.7213 19.8749 20.2981 20.2981L21.3588 21.3588C22.1071 20.6104 22.4392 19.6614 22.5969 18.489C22.7516 17.3382 22.75 15.8644 22.75 14H21.25ZM2.75 10C2.75 8.09318 2.75159 6.73851 2.88976 5.71085C3.02502 4.70476 3.27869 4.12511 3.7019 3.7019L2.64124 2.64124C1.89288 3.38961 1.56076 4.33855 1.40313 5.51098C1.24841 6.66182 1.25 8.13558 1.25 10H2.75ZM10.0298 1.25C8.15538 1.25 6.67442 1.24842 5.51887 1.40307C4.34232 1.56054 3.39019 1.8923 2.64124 2.64124L3.7019 3.7019C4.12453 3.27928 4.70596 3.02525 5.71785 2.88982C6.75075 2.75158 8.11311 2.75 10.0298 2.75V1.25Z"
                      fill="currentColor"
                    />
                    <path opacity="0.5" d="M13 2.5V5C13 7.35702 13 8.53553 13.7322 9.26777C14.4645 10 15.643 10 18 10H22" stroke="currentColor" strokeWidth="1.5" />
                    <path opacity="0.5" d="M7 14L6 15L7 16M11.5 16L12.5 17L11.5 18M10 14L8.5 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  JSON
                </button>

                <button type="button" onClick={() => exportTable('print')} className="btn btn-outline-warning btn-sm m-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                    <path
                      d="M6 17.9827C4.44655 17.9359 3.51998 17.7626 2.87868 17.1213C2 16.2426 2 14.8284 2 12C2 9.17157 2 7.75736 2.87868 6.87868C3.75736 6 5.17157 6 8 6H16C18.8284 6 20.2426 6 21.1213 6.87868C22 7.75736 22 9.17157 22 12C22 14.8284 22 16.2426 21.1213 17.1213C20.48 17.7626 19.5535 17.9359 18 17.9827"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path opacity="0.5" d="M9 10H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M19 14L5 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path
                      d="M18 14V16C18 18.8284 18 20.2426 17.1213 21.1213C16.2426 22 14.8284 22 12 22C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      opacity="0.5"
                      d="M17.9827 6C17.9359 4.44655 17.7626 3.51998 17.1213 2.87868C16.2427 2 14.8284 2 12 2C9.17158 2 7.75737 2 6.87869 2.87868C6.23739 3.51998 6.06414 4.44655 6.01733 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle opacity="0.5" cx="17" cy="10" r="1" fill="currentColor" />
                    <path opacity="0.5" d="M15 16.5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path opacity="0.5" d="M13 19H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  PRINT
                </button>
              </div>
            </div>
            <div className="datatables pagination-padding px-5">
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
                  {
                    accessor: 'class',
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
                        <button className="flex hover:text-primary" onClick={() => handleShow(id)}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              opacity="0.5"
                              d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                            <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="1.5" />
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
                            <div className="text-lg font-bold">Add Student</div>
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
                          <br />
                          <div className="p-5">
                            <form onSubmit={addItem} action="">
                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <input type="hidden" name="_token" value="{{ csrf_token() }}" />
                                <div>
                                  <label htmlFor="nis">Nis</label>
                                  <input
                                    id="nis"
                                    type="text"
                                    name=""
                                    required
                                    value={itemsAdd.nis} //courseInfo adalah useState object / array
                                    onChange={(
                                      e: any //mengupdate perubahan secra realtime
                                    ) => setItemsAdd({ ...itemsAdd, nis: e.target.value })}
                                    placeholder="Enter Nis"
                                    className="form-input"
                                  />
                                </div>
                                <div>
                                  <label htmlFor="email">Email</label>
                                  <input
                                    id="email"
                                    type="email"
                                    name=""
                                    required
                                    value={itemsAdd.email} //courseInfo adalah useState object / array
                                    onChange={(
                                      e: any //mengupdate perubahan secra realtime
                                    ) => setItemsAdd({ ...itemsAdd, email: e.target.value })}
                                    placeholder="Enter Email"
                                    className="form-input"
                                  />
                                </div>
                              </div>
                              <div className="mt-4">
                                <div>
                                  <label htmlFor="shipping-charge">Name</label>
                                  <input
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
                                  />
                                </div>
                              </div>
                              <div className="mt-4">
                                <label htmlFor="payment-method">Class</label>
                                <select
                                  required
                                  className="form-select"
                                  value={itemsAdd.class}
                                  onChange={(
                                    e: any //mengupdate perubahan secra realtime
                                  ) => setItemsAdd({ ...itemsAdd, class: e.target.value })}
                                >
                                  <option value="">Select Class</option>
                                  {dataClass?.map((item: any) => (
                                    <option value={item.name} key={item.id}>
                                      {item.name}
                                    </option>
                                  ))}
                                </select>
                                {/* <select id="payment-method" name="payment-method" className="form-select">
                                  <option value=" ">Select Payment</option>
                                  <option value="bank">Bank Account</option>
                                  <option value="paypal">Paypal</option>
                                  <option value="upi">UPI Transfer</option>
                                </select> */}
                              </div>
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
                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <input type="hidden" name="_token" value="{{ csrf_token() }}" />
                                <div>
                                  <label htmlFor="nis">Nis</label>
                                  <input
                                    id="nis"
                                    type="text"
                                    name=""
                                    required
                                    value={itemsEdit.nis} //courseInfo adalah useState object / array
                                    onChange={(
                                      e: any //mengupdate perubahan secra realtime
                                    ) => setItemsEdit({ ...itemsEdit, nis: e.target.value })}
                                    placeholder="Enter Nis"
                                    className="form-input"
                                  />
                                </div>
                                <div>
                                  <label htmlFor="email">Email</label>
                                  <input
                                    id="email"
                                    type="email"
                                    name=""
                                    required
                                    value={itemsEdit.email} //courseInfo adalah useState object / array
                                    onChange={(
                                      e: any //mengupdate perubahan secra realtime
                                    ) => setItemsEdit({ ...itemsEdit, email: e.target.value })}
                                    placeholder="Enter Email"
                                    className="form-input"
                                  />
                                </div>
                              </div>
                              <div className="mt-4">
                                <div>
                                  <label htmlFor="shipping-charge">name</label>
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
                              <div className="mt-4">
                                <label htmlFor="payment-method">Class</label>
                                <select
                                  required
                                  className="form-select"
                                  value={itemsEdit.class}
                                  onChange={(
                                    e: any //mengupdate perubahan secra realtime
                                  ) => setItemsAdd({ ...itemsAdd, class: e.target.value })}
                                >
                                  <option value="">Select Class</option>
                                  {dataClass?.map((item: any) => (
                                    <option value={item.name} key={item.id}>
                                      {item.name}
                                    </option>
                                  ))}
                                </select>
                                {/* <label htmlFor="payment-method">Kelas</label>
                                <select id="payment-method" name="payment-method" className="form-select">
                                  <option value=" ">Select Payment</option>
                                  <option value="bank">Bank Account</option>
                                  <option value="paypal">Paypal</option>
                                  <option value="upi">UPI Transfer</option>
                                </select> */}
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

            {/* modal excel */}
            <div className="mb-5">
              <Transition appear show={modalExcel} as={Fragment}>
                <Dialog as="div" open={modalExcel} onClose={() => setModalExcel(false)}>
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
                            <div className="text-lg font-bold">Import Excel</div>
                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalExcel(false)}>
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
                            <form onSubmit={handleUpload} action="">
                              <div>
                                <div>
                                  <label htmlFor="shipping-charge">Download Template</label>
                                  <p className="mb-2 text-[14px] text-red-500">*Don't change the header section</p>
                                  <button type="button" className="btn btn-primary" onClick={handleDownload}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                      <path
                                        opacity="0.5"
                                        d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                      <path d="M12 3V16M12 16L16 11.625M12 16L8 11.625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <br />
                              <div className="mt-4">
                                <div>
                                  <label htmlFor="shipping-charge">File Excel</label>
                                  <input
                                    id="ctnFile"
                                    name="file"
                                    type="file"
                                    className="rtl:file-ml-5 form-input p-0 file:border-0 file:bg-primary/90 file:px-4 file:py-2 file:font-semibold file:text-white file:hover:bg-primary ltr:file:mr-5"
                                    // onChange={(e) => onFileUpload(e.target.files[0])}
                                    onChange={handleFileChange}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="mt-8 flex items-center justify-end">
                                <button type="button" className="btn btn-outline-danger" onClick={() => setModalExcel(false)}>
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

            {/* modal show*/}
            <div className="mb-5">
              <Transition appear show={modalShow} as={Fragment}>
                <Dialog as="div" open={modalShow} onClose={() => setModalShow(false)}>
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
                        <Dialog.Panel as="div" className="panel my-8 w-full max-w-sm overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                          <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                            <div className="text-lg font-bold">Profile</div>
                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalShow(false)}>
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
                          <div className="mb-5 p-5">
                            <div className="flex flex-col items-center justify-center">
                              <img src={profileImage} alt="img" className="mb-5 h-24 w-24 rounded-full  object-cover" />
                              <p className="text-xl font-semibold text-primary">{itemsShow.name}</p>
                            </div>
                            <ul className="m-auto mt-5 flex max-w-[160px] flex-col items-center justify-center space-y-4 font-semibold text-white-dark">
                              <li className="flex items-center gap-2">
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M9 6.25C7.48122 6.25 6.25 7.48122 6.25 9C6.25 10.5188 7.48122 11.75 9 11.75C10.5188 11.75 11.75 10.5188 11.75 9C11.75 7.48122 10.5188 6.25 9 6.25ZM7.75 9C7.75 8.30965 8.30965 7.75 9 7.75C9.69036 7.75 10.25 8.30965 10.25 9C10.25 9.69036 9.69036 10.25 9 10.25C8.30965 10.25 7.75 9.69036 7.75 9Z"
                                    fill="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M9 12.25C7.80424 12.25 6.68461 12.4907 5.83616 12.915C5.03258 13.3168 4.25 14.0106 4.25 15L4.24987 15.0625C4.24834 15.5728 4.24576 16.4322 5.06023 17.0218C5.43818 17.2953 5.9369 17.4698 6.55469 17.581C7.1782 17.6932 7.97721 17.75 9 17.75C10.0228 17.75 10.8218 17.6932 11.4453 17.581C12.0631 17.4698 12.5618 17.2953 12.9398 17.0218C13.7542 16.4322 13.7517 15.5728 13.7501 15.0625L13.75 15C13.75 14.0106 12.9674 13.3168 12.1638 12.915C11.3154 12.4907 10.1958 12.25 9 12.25ZM5.75 15C5.75 14.8848 5.86285 14.5787 6.50698 14.2566C7.10625 13.957 7.98662 13.75 9 13.75C10.0134 13.75 10.8937 13.957 11.493 14.2566C12.1371 14.5787 12.25 14.8848 12.25 15C12.25 15.6045 12.2115 15.6972 12.0602 15.8067C11.9382 15.895 11.6869 16.0134 11.1797 16.1047C10.6782 16.1949 9.97721 16.25 9 16.25C8.02279 16.25 7.3218 16.1949 6.82031 16.1047C6.31311 16.0134 6.06182 15.895 5.93977 15.8067C5.78849 15.6972 5.75 15.6045 5.75 15Z"
                                    fill="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <path
                                    d="M19 12.75C19.4142 12.75 19.75 12.4142 19.75 12C19.75 11.5858 19.4142 11.25 19 11.25H15C14.5858 11.25 14.25 11.5858 14.25 12C14.25 12.4142 14.5858 12.75 15 12.75H19Z"
                                    fill="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <path
                                    d="M19.75 9C19.75 9.41422 19.4142 9.75 19 9.75H14C13.5858 9.75 13.25 9.41422 13.25 9C13.25 8.58579 13.5858 8.25 14 8.25H19C19.4142 8.25 19.75 8.58579 19.75 9Z"
                                    fill="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <path
                                    d="M19 15.75C19.4142 15.75 19.75 15.4142 19.75 15C19.75 14.5858 19.4142 14.25 19 14.25H16C15.5858 14.25 15.25 14.5858 15.25 15C15.25 15.4142 15.5858 15.75 16 15.75H19Z"
                                    fill="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <path
                                    opacity="0.5"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M9.94358 3.25H14.0564C15.8942 3.24998 17.3498 3.24997 18.489 3.40314C19.6614 3.56076 20.6104 3.89288 21.3588 4.64124C22.1071 5.38961 22.4392 6.33856 22.5969 7.51098C22.75 8.65018 22.75 10.1058 22.75 11.9435V12.0564C22.75 13.8942 22.75 15.3498 22.5969 16.489C22.4392 17.6614 22.1071 18.6104 21.3588 19.3588C20.6104 20.1071 19.6614 20.4392 18.489 20.5969C17.3498 20.75 15.8942 20.75 14.0565 20.75H9.94359C8.10585 20.75 6.65018 20.75 5.51098 20.5969C4.33856 20.4392 3.38961 20.1071 2.64124 19.3588C1.89288 18.6104 1.56076 17.6614 1.40314 16.489C1.24997 15.3498 1.24998 13.8942 1.25 12.0564V11.9436C1.24998 10.1058 1.24997 8.65019 1.40314 7.51098C1.56076 6.33856 1.89288 5.38961 2.64124 4.64124C3.38961 3.89288 4.33856 3.56076 5.51098 3.40314C6.65019 3.24997 8.10583 3.24998 9.94358 3.25ZM5.71085 4.88976C4.70476 5.02503 4.12511 5.27869 3.7019 5.7019C3.27869 6.12511 3.02503 6.70476 2.88976 7.71085C2.75159 8.73851 2.75 10.0932 2.75 12C2.75 13.9068 2.75159 15.2615 2.88976 16.2892C3.02503 17.2952 3.27869 17.8749 3.7019 18.2981C4.12511 18.7213 4.70476 18.975 5.71085 19.1102C6.73851 19.2484 8.09318 19.25 10 19.25H14C15.9068 19.25 17.2615 19.2484 18.2892 19.1102C19.2952 18.975 19.8749 18.7213 20.2981 18.2981C20.7213 17.8749 20.975 17.2952 21.1102 16.2892C21.2484 15.2615 21.25 13.9068 21.25 12C21.25 10.0932 21.2484 8.73851 21.1102 7.71085C20.975 6.70476 20.7213 6.12511 20.2981 5.7019C19.8749 5.27869 19.2952 5.02503 18.2892 4.88976C17.2615 4.75159 15.9068 4.75 14 4.75H10C8.09318 4.75 6.73851 4.75159 5.71085 4.88976Z"
                                    fill="currentColor"
                                    strokeWidth="1.5"
                                  />
                                </svg>
                                {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                  <path
                                    opacity="0.5"
                                    d="M5 8.51464C5 4.9167 8.13401 2 12 2C15.866 2 19 4.9167 19 8.51464C19 12.0844 16.7658 16.2499 13.2801 17.7396C12.4675 18.0868 11.5325 18.0868 10.7199 17.7396C7.23416 16.2499 5 12.0844 5 8.51464Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <path d="M14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z" stroke="currentColor" strokeWidth="1.5" />
                                  <path
                                    d="M20.9605 15.5C21.6259 16.1025 22 16.7816 22 17.5C22 19.9853 17.5228 22 12 22C6.47715 22 2 19.9853 2 17.5C2 16.7816 2.37412 16.1025 3.03947 15.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                  />
                                </svg> */}
                              </li>
                              <li>{itemsShow.nis}</li>
                              <li>
                                <button className="flex items-center gap-2">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                      opacity="0.5"
                                      d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                    />
                                    <path
                                      d="M6 8L8.1589 9.79908C9.99553 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.79908L18 8"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </button>
                              </li>
                              <li>{itemsShow.email}</li>
                              {/* <li className="flex items-center gap-2">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M5.00659 6.93309C5.04956 5.7996 5.70084 4.77423 6.53785 3.93723C7.9308 2.54428 10.1532 2.73144 11.0376 4.31617L11.6866 5.4791C12.2723 6.52858 12.0372 7.90533 11.1147 8.8278M17.067 18.9934C18.2004 18.9505 19.2258 18.2992 20.0628 17.4622C21.4558 16.0692 21.2686 13.8468 19.6839 12.9624L18.5209 12.3134C17.4715 11.7277 16.0947 11.9628 15.1722 12.8853"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                />
                                <path
                                  opacity="0.5"
                                  d="M5.00655 6.93311C4.93421 8.84124 5.41713 12.0817 8.6677 15.3323C11.9183 18.5829 15.1588 19.0658 17.0669 18.9935M15.1722 12.8853C15.1722 12.8853 14.0532 14.0042 12.0245 11.9755C9.99578 9.94676 11.1147 8.82782 11.1147 8.82782"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                />
                              </svg>
                              <span className="whitespace-nowrap" dir="ltr">
                                +1 (530) 555-12121
                              </span>
                            </li> */}
                            </ul>
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
    </>
  );
};

export default List;
