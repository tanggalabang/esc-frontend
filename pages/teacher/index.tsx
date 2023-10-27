import { Dialog, Transition, Tab } from '@headlessui/react';
import { useCreateExcelTeacherMutation, useCreateTeacherMutation, useDeleteTeacherMutation, useEditTeacherMutation, useGetAllTeachersQuery } from '@/redux/features/teacher/teacherApi';
import React, { useEffect, useState, Fragment } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { downloadExcel } from 'react-export-table-to-excel';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

type Props = {};

const index = (props: Props) => {
  //REDUX
  const { isLoading, data, refetch } = useGetAllTeachersQuery({}, { refetchOnMountOrArgChange: true });
  const [createTeacher, { isSuccess: successAdd, error: errorAdd }] = useCreateTeacherMutation();
  ///REDUX

  //SHOW ON TABLE
  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);
  const [items, setItems] = useState([]);
  //--modal show
  const [modalShow, setModalShow] = useState(false);
  const [showId, setShowId] = useState();
  const [itemsShow, setItemsShow] = useState({});
  //--find data and show
  const showData = data && data.find((i: any) => i.id === showId);

  console.log(showData);
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
  ///SHOW ON TABLE

  //ADD
  useEffect(() => {
    refetch();
    if (successAdd) {
      toast.success('Teacher add successfully');
      setItemsAdd({
        name: '',
        email: '',
      });
    }
  }, [successAdd]);
  const [modalAdd, setModalAdd] = useState(false);

  const [itemsAdd, setItemsAdd] = useState({
    name: '',
    email: '',
  });

  const addItem = async (e: any) => {
    e.preventDefault();
    const data = itemsAdd;
    await createTeacher(data);
    setModalAdd(false);
  };
  //--excel
  const [createExcel, { isLoading: loadingExcel, isSuccess: successExcel, error }] = useCreateExcelTeacherMutation();
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

  ///ADD

  //EDIT
  const [courseId, setCourseId] = useState('');
  const [modalEdit, setModalEdit] = useState(false);
  //--definition main variable
  const [itemsEdit, setItemsEdit] = useState({
    name: '',
    email: '',
  });
  //--find data from teacher by id
  const editCourseData = data && data.find((i: any) => i.id === courseId);
  useEffect(() => {
    if (editCourseData) {
      setItemsEdit({
        name: editCourseData.name,
        email: editCourseData.email,
      });
    }
  }, [editCourseData]);
  //--edit
  const handleEdit = (id: any) => {
    setCourseId(id);
    setModalEdit(true);
  };
  //--handle edit
  const [editTheacher, { isSuccess }] = useEditTeacherMutation();
  const editItem = async (e: any) => {
    e.preventDefault();
    const data = itemsEdit;
    // await editClass({ id: edibackend / app / Models / ClassModel.phptCourseData?.id, data });
    await editTheacher({ id: editCourseData?.id, data });
    setModalEdit(false);
  };
  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success('Student updated successfully');
    }
  }, [isSuccess]);
  ///EDIT
  //DELETE
  //--redux
  const [deleteTeacher, { isSuccess: successDelete }] = useDeleteTeacherMutation({});
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
        }).then((result) => {
          if (result.value) {
            Swal.fire({ title: 'Deleted!', text: 'Your data has been deleted.', icon: 'success', customClass: 'sweet-alerts' });
            deleteTeacher(id);
          }
        });
      }
    };
    showAlert(10);
  };
  ///DELETE

  //EXPORT
  const col = ['name', 'email', 'class', 'subject'];

  const rowData = items;

  const header = ['Name', 'Email', 'Class', 'Subject'];
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
  ///EXPORT

  //SEARCH
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'id'));
  const [recordsData, setRecordsData] = useState(initialRecords);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'id',
    direction: 'asc',
  });
  useEffect(() => {
    setInitialRecords(sortBy(rowData, 'id'));
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
        return (
          item.name.toString().includes(search.toLowerCase()) || item.email.toString().includes(search.toLowerCase())
          // item.class.toLowerCase().includes(search.toLowerCase()) ||
          // item.subject.toLowerCase().includes(search.toLowerCase())
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

  console.log(itemsShow);

  return (
    <>
      <div className="panel border-white-light px-0 dark:border-[#1b2e4b]">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
          </div>
        ) : (
          <div>
            <div className="invoice-table">
              <div className="mb-4.5 flex flex-col gap-5 px-5 md:flex-row md:items-center">
                <div className="flex items-center gap-2">
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

                  <div className="flex flex-wrap items-center">
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
                    accessor: 'subject',
                    sortable: false,
                    title: 'Subjects',
                    render: ({ subject }) => (
                      <ul>
                        {subject?.length === 0 ? (
                          <span className="text-[14px] text-white-dark">There are not subject</span>
                        ) : (
                          <>
                            {subject?.map((sub: any) => (
                              <span key={sub.id} className="badge m-1 whitespace-nowrap bg-info">
                                {sub.name}
                              </span>
                            ))}
                          </>
                        )}
                      </ul>
                    ),
                  },
                  {
                    accessor: 'class',
                    sortable: false,
                    title: 'Class',
                    render: ({ classes }) => (
                      <ul>
                        {classes?.length === 0 ? (
                          <span className="text-[14px] text-white-dark">There are not classes</span>
                        ) : (
                          <>
                            {classes?.map((cls: any) => (
                              <span key={cls.id} className="badge badge-outline-info mr-3 whitespace-nowrap">
                                {cls.name}
                              </span>
                            ))}
                          </>
                        )}
                      </ul>
                    ),
                  },
                  {
                    accessor: 'action',
                    title: 'Actions',
                    sortable: false,
                    textAlignment: 'center',
                    render: ({ id }) => (
                      <div className="mx-auto flex w-max items-center gap-4">
                        <button type="button" className="flex hover:text-info" onClick={() => handleEdit(id)}>
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
                          <br />
                          <div className="p-5">
                            <form onSubmit={addItem} action="">
                              <input type="hidden" name="_token" value="{{ csrf_token() }}" />
                              <div>
                                <div>
                                  <label htmlFor="shipping-charge">Nama</label>
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
              <Transition appear show={modalEdit} as={Fragment}>
                <Dialog as="div" open={modalEdit} onClose={() => setModalEdit(false)}>
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
                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalEdit(false)}>
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
                              <input type="hidden" name="_token" value="{{ csrf_token() }}" />
                              <div>
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
                              <div className="mt-4">
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
                              <p className="text-xl font-semibold text-primary">{itemsShow?.name}</p>
                            </div>
                            <ul className="m-auto mt-5 flex max-w-[160px] flex-col items-center justify-center space-y-4 font-semibold text-white-dark">
                              <li className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                                  <path
                                    opacity="0.5"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M11.9426 1.25C9.63423 1.24999 7.82519 1.24998 6.41371 1.43975C4.96897 1.63399 3.82895 2.03933 2.93414 2.93414C2.03933 3.82895 1.63399 4.96897 1.43975 6.41371C1.24998 7.82519 1.24999 9.63423 1.25 11.9426V12.0574C1.24999 14.3658 1.24998 16.1748 1.43975 17.5863C1.63399 19.031 2.03933 20.1711 2.93414 21.0659C3.82895 21.9607 4.96897 22.366 6.41371 22.5603C7.82519 22.75 9.63423 22.75 11.9426 22.75H12.0574C14.3658 22.75 16.1748 22.75 17.5863 22.5603C19.031 22.366 20.1711 21.9607 21.0659 21.0659C21.9607 20.1711 22.366 19.031 22.5603 17.5863C22.75 16.1748 22.75 14.3658 22.75 12.0574V11.9426C22.75 9.63423 22.75 7.82519 22.5603 6.41371C22.366 4.96897 21.9607 3.82895 21.0659 2.93414C20.1711 2.03933 19.031 1.63399 17.5863 1.43975C16.1748 1.24998 14.3658 1.24999 12.0574 1.25H11.9426ZM6.25 2.98181C5.18517 3.16506 4.50829 3.4813 3.9948 3.9948C3.42514 4.56445 3.09825 5.33517 2.92637 6.61358C2.75159 7.91356 2.75 9.62178 2.75 12C2.75 14.3782 2.75159 16.0864 2.92637 17.3864C3.09825 18.6648 3.42514 19.4355 3.9948 20.0052C4.56445 20.5749 5.33517 20.9018 6.61358 21.0736C7.91356 21.2484 9.62178 21.25 12 21.25C14.3782 21.25 16.0864 21.2484 17.3864 21.0736C18.6648 20.9018 19.4355 20.5749 20.0052 20.0052C20.5749 19.4355 20.9018 18.6648 21.0736 17.3864C21.2484 16.0864 21.25 14.3782 21.25 12C21.25 9.62178 21.2484 7.91356 21.0736 6.61358C20.9018 5.33517 20.5749 4.56445 20.0052 3.9948C19.4917 3.4813 18.8148 3.16506 17.75 2.98181V11.831C17.75 12.2986 17.75 12.6821 17.7326 12.9839C17.7155 13.2816 17.6786 13.5899 17.5563 13.8652C17.1149 14.859 16.0259 15.3949 14.9691 15.1383C14.6764 15.0673 14.4096 14.9084 14.1633 14.7404C13.9136 14.57 13.6097 14.336 13.2392 14.0508L13.2207 14.0365C12.7513 13.6751 12.6192 13.5804 12.4981 13.5277C12.1804 13.3897 11.8196 13.3897 11.5019 13.5277C11.3808 13.5804 11.2487 13.6751 10.7793 14.0365L10.7608 14.0508C10.3903 14.336 10.0864 14.57 9.83672 14.7404C9.59039 14.9084 9.32356 15.0673 9.03086 15.1383C7.97413 15.3949 6.88513 14.859 6.44371 13.8652C6.32145 13.5899 6.28454 13.2816 6.26739 12.9839C6.24999 12.6821 6.25 12.2986 6.25 11.831V2.98181ZM16.25 2.81997C15.1242 2.75085 13.7418 2.75 12 2.75C10.2582 2.75 8.87584 2.75085 7.75 2.81997V11.8076C7.75 12.3043 7.7503 12.6442 7.7649 12.8976C7.78003 13.1601 7.80769 13.2408 7.81457 13.2563C7.96171 13.5876 8.32471 13.7662 8.67695 13.6807C8.69342 13.6767 8.77428 13.6493 8.99148 13.5012C9.20112 13.3582 9.47062 13.151 9.86419 12.848L9.93118 12.7964C10.3014 12.5109 10.5899 12.2885 10.9042 12.152C11.6032 11.8483 12.3968 11.8483 13.0958 12.152C13.4101 12.2885 13.6986 12.5109 14.0688 12.7964L14.1358 12.848C14.5294 13.151 14.7989 13.3582 15.0085 13.5012C15.2257 13.6493 15.3066 13.6767 15.323 13.6807C15.6753 13.7662 16.0383 13.5876 16.1854 13.2563C16.1923 13.2408 16.22 13.1601 16.2351 12.8976C16.2497 12.6442 16.25 12.3043 16.25 11.8076V2.81997Z"
                                    fill="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M6.25 18C6.25 17.5858 6.58579 17.25 7 17.25H17C17.4142 17.25 17.75 17.5858 17.75 18C17.75 18.4142 17.4142 18.75 17 18.75H7C6.58579 18.75 6.25 18.4142 6.25 18Z"
                                    fill="currentColor"
                                    strokeWidth="1.5"
                                  />
                                </svg>
                              </li>
                              <li>
                                {itemsShow.subject?.length === 0 ? (
                                  <span className="text-[14px] text-white-dark">There are not subject</span>
                                ) : (
                                  <>
                                    {itemsShow.subject?.map((subject: any) => (
                                      <span key={subject.id} className="badge m-1 whitespace-nowrap bg-info">
                                        {subject.name}
                                      </span>
                                    ))}
                                  </>
                                )}
                              </li>
                              <li className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 22 21" fill="none" className="h-5 w-5">
                                  <path
                                    opacity="0.5"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M12.4948 2.33224C11.6423 1.57447 10.3577 1.57447 9.50518 2.33224L3.50518 7.66558C3.02483 8.09255 2.75 8.70457 2.75 9.34725V19.2501H4.25L4.25 13.948C4.24997 13.0496 4.24994 12.3004 4.32991 11.7056C4.41432 11.0778 4.59999 10.511 5.05546 10.0555C5.51093 9.60004 6.07773 9.41437 6.70552 9.32996C7.3003 9.25 8.04952 9.25002 8.94801 9.25005H13.052C13.9505 9.25002 14.6997 9.25 15.2945 9.32996C15.9223 9.41437 16.4891 9.60004 16.9445 10.0555C17.4 10.511 17.5857 11.0778 17.6701 11.7056C17.7501 12.3004 17.75 13.0496 17.75 13.9481V19.2501H19.25V9.34725C19.25 8.70457 18.9752 8.09255 18.4948 7.66558L12.4948 2.33224ZM20.75 19.2501V9.34725C20.75 8.27611 20.2919 7.25609 19.4914 6.54446L13.4914 1.21113C12.0705 -0.0518223 9.92946 -0.0518223 8.50864 1.21113L2.50864 6.54446C1.70805 7.25609 1.25 8.27611 1.25 9.34725V19.2501H1C0.585786 19.2501 0.25 19.5858 0.25 20.0001C0.25 20.4143 0.585786 20.7501 1 20.7501H21C21.4142 20.7501 21.75 20.4143 21.75 20.0001C21.75 19.5858 21.4142 19.2501 21 19.2501H20.75ZM16.25 19.2501V14.0001C16.25 13.036 16.2484 12.3885 16.1835 11.9054C16.1214 11.444 16.0142 11.2465 15.8839 11.1162C15.7536 10.9859 15.5561 10.8786 15.0946 10.8166C14.6116 10.7516 13.964 10.7501 13 10.7501H9C8.03599 10.7501 7.38843 10.7516 6.90539 10.8166C6.44393 10.8786 6.24643 10.9859 6.11612 11.1162C5.9858 11.2465 5.87858 11.444 5.81654 11.9054C5.75159 12.3885 5.75 13.036 5.75 14.0001V19.2501H16.25ZM8.25 7.00005C8.25 6.58584 8.58579 6.25005 9 6.25005H13C13.4142 6.25005 13.75 6.58584 13.75 7.00005C13.75 7.41426 13.4142 7.75005 13 7.75005H9C8.58579 7.75005 8.25 7.41426 8.25 7.00005ZM7.25 13.5001C7.25 13.0858 7.58579 12.7501 8 12.7501H14C14.4142 12.7501 14.75 13.0858 14.75 13.5001C14.75 13.9143 14.4142 14.2501 14 14.2501H8C7.58579 14.2501 7.25 13.9143 7.25 13.5001ZM7.25 16.5001C7.25 16.0858 7.58579 15.7501 8 15.7501H14C14.4142 15.7501 14.75 16.0858 14.75 16.5001C14.75 16.9143 14.4142 17.25 14 17.25H8C7.58579 17.25 7.25 16.9143 7.25 16.5001Z"
                                    fill="currentColor"
                                    strokeWidth="1.5"
                                  />
                                </svg>
                              </li>
                              <li>
                                {itemsShow.classes?.length === 0 ? (
                                  <span className="text-[14px] text-white-dark">There are not classes</span>
                                ) : (
                                  <>
                                    {itemsShow.classes?.map((classes: any) => (
                                      <span key={classes.id} className="badge badge-outline-info m-1 whitespace-nowrap">
                                        {classes.name}
                                      </span>
                                    ))}
                                  </>
                                )}
                              </li>
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
                              <li>{itemsShow?.email}</li>
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

export default index;
