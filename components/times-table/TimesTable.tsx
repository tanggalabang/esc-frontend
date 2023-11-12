import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useGetAllClassByTeacherQuery, useGetAllClassQuery, useGetAllSubjectQuery } from '@/redux/features/class-subject/classSubjectApi';
import React, { FC, useEffect, useState, Fragment } from 'react';
import sortBy from 'lodash/sortBy';
import { useCreateTimeTableMutation, useGetAllTimeTableQuery } from '@/redux/features/times-table/timeTableApi';
import toast from 'react-hot-toast';
import { useGetAllTeachersQuery } from '@/redux/features/teacher/teacherApi';
import { useRouter } from 'next/router';
import { useAuth } from '@/pages/hooks/auth';
import RouteProtected from '@/components/route-protected/RouteProtected';

type Props = {
  data: any;
};

// const TimesTable = (props: Props) => {
const TimesTable: FC<Props> = ({ data }) => {
  // only for admin
  const { user } = useAuth();
  //REDUX
  // const { isLoading, data, refetch } = useGetAllClassByTeacherQuery({}, { refetchOnMountOrArgChange: true });
  ///REDUX

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

  // console.log(JSON.stringify(items));

  useEffect(() => {
    const firstClass = items[0]?.id;
    console.log(firstClass);
    setActiveRow(firstClass);
  }, [items]);
  // console.log(firstClass);
  console.log(items);
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
        return item.name.toLowerCase().includes(search.toLowerCase());
      });
    });
  }, [search]);
  useEffect(() => {
    const data = sortBy(initialRecords, sortStatus.columnAccessor);
    setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    setPage(1);
  }, [sortStatus]);
  ///SEARCH

  //ROW CLICK
  const [activeRow, setActiveRow] = useState(); // State to keep track of the active row
  const handleRowClick = (id: any) => {
    setActiveRow(id); // Set the active row when it's clicked
  };
  const className = data && data.find((i: any) => i.id === activeRow); // coneole.log(editCourseData);
  ///ROW CLICK

  //TIMETABLE
  const { isSuccess: successTimes, data: dataTimesTable, refetch: refetchTimesTable } = useGetAllTimeTableQuery(activeRow, { refetchOnMountOrArgChange: true });
  const [showLoadingTimes, setShowLoadingTimes] = useState(true);
  const [createTimeTable, { isSuccess: successAdd, error: errorAdd }] = useCreateTimeTableMutation();

  useEffect(() => {
    if (successAdd) {
      refetchTimesTable();
      toast.success('Times table updated successfully');
    }
  }, [successAdd]);

  useEffect(() => {
    // Set isLoading to true initially
    setShowLoadingTimes(true);

    // After 1 second, set isLoading to false
    const timeout = setTimeout(() => {
      setShowLoadingTimes(false);
    }, 700);

    return () => clearTimeout(timeout); // Clean up the timeout if the component unmounts
  }, [dataTimesTable]);

  useEffect(() => {
    if (dataTimesTable) {
      setItemsAddSubject(dataTimesTable);
    }
    setItemsAddSubject((prevItems) => ({
      ...prevItems, // Salin semua properti yang ada
      class: className?.name, // Ganti nilai properti 'class' sesuai kebutuhan
    }));
  }, [dataTimesTable, className]);

  const [periodDay, setPeriodDay] = useState('Mon');

  const [itemsAddSubject, setItemsAddSubject] = useState({
    class: '',
    periods: [
      {
        day: periodDay,
        number: '',
        subject: '',
        teacher: '',
        place: '',
      },
    ],
  });

  const addPeriod = () => {
    const updatedData = { ...itemsAddSubject }; // Salin objek utama
    updatedData.periods = [...itemsAddSubject.periods]; // Salin array periods

    const day = periodDay;
    const sameDayCount = updatedData.periods.filter((period) => period.day === day).length + 1;

    console.log(sameDayCount);

    updatedData.periods.push({
      day: periodDay,
      number: `Period-${sameDayCount}`,
      subject: '',
      teacher: '',
      place: '',
    });
    setItemsAddSubject(updatedData);
  };

  const removePeriod = (index: number) => {
    const updatedData = { ...itemsAddSubject }; // Salin objek utama
    updatedData.periods = [...itemsAddSubject.periods]; // Salin array periods
    updatedData.periods.splice(index, 1); // Hapus periode sesuai dengan indeks yang diberikan
    setItemsAddSubject(updatedData);
  };

  const handleNumberChange = (index: number, newValue: string) => {
    const updatedPeriods = [...itemsAddSubject.periods]; // Salin periode ke dalam array baru
    updatedPeriods[index] = { ...updatedPeriods[index], number: newValue }; // Salin periode yang diubah
    const updatedItemsAddSubject = { ...itemsAddSubject, periods: updatedPeriods }; // Salin objek utama dengan periode yang diperbarui
    setItemsAddSubject(updatedItemsAddSubject);
  };

  const handleSubjectChange = (index: number, newValue: string) => {
    const updatedPeriods = [...itemsAddSubject.periods]; // Salin periode ke dalam array baru
    updatedPeriods[index] = { ...updatedPeriods[index], subject: newValue }; // Salin periode yang diubah
    const updatedItemsAddSubject = { ...itemsAddSubject, periods: updatedPeriods }; // Salin objek utama dengan periode yang diperbarui
    setItemsAddSubject(updatedItemsAddSubject);
  };

  const handleTeacherChange = (index: number, newValue: string) => {
    const updatedPeriods = [...itemsAddSubject.periods]; // Salin periode ke dalam array baru
    updatedPeriods[index] = { ...updatedPeriods[index], teacher: newValue }; // Salin periode yang diubah
    const updatedItemsAddSubject = { ...itemsAddSubject, periods: updatedPeriods }; // Salin objek utama dengan periode yang diperbarui
    setItemsAddSubject(updatedItemsAddSubject);
  };

  const handlePlaceChange = (index: number, newValue: string) => {
    const updatedPeriods = [...itemsAddSubject.periods]; // Salin periode ke dalam array baru
    updatedPeriods[index] = { ...updatedPeriods[index], place: newValue }; // Salin periode yang diubah
    const updatedItemsAddSubject = { ...itemsAddSubject, periods: updatedPeriods }; // Salin objek utama dengan periode yang diperbarui
    setItemsAddSubject(updatedItemsAddSubject);
  };
  const handleTimeTable = async (e: any) => {
    e.preventDefault();
    const data = itemsAddSubject;
    await createTimeTable(data);
  };
  //TIMETABLE
  const { data: dataSubject } = useGetAllSubjectQuery({});
  const { data: dataTeacher } = useGetAllTeachersQuery({});

  return (
    <>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        {/* <div className={`panel mr-3 w-3/4 `}> */}
        <div className="panel col-span-1  xl:col-span-3">
          {showLoadingTimes ? (
            <div className="flex items-center justify-center">
              <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <form onSubmit={handleTimeTable} className=" w-[1000px] sm:w-auto xl:w-auto">
                <div className="mt-2 ">
                  <div className="flex ">
                    <h5 className="  text-lg font-semibold text-primary">{itemsAddSubject.class}</h5>
                    <ToggleButtonGroup style={{ height: '40px', marginLeft: 'auto', marginRight: '20px' }} value={periodDay} onChange={(e, v) => v && setPeriodDay(v)} exclusive>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <ToggleButton value={day} key={day}>
                          {day}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                    {user?.user_type === 1 && items.length !== 0 && (
                      <div
                        className="btn btn-outline-primary inline-block"
                        onClick={() => {
                          addPeriod();
                        }}
                      >
                        Add a Period
                      </div>
                    )}
                  </div>

                  <div className="py-6">
                    {itemsAddSubject.periods.length === 0 ? (
                      <div className="w-full text-center text-[16px] text-white-dark">There are not times table on this day or this class</div>
                    ) : (
                      <>
                        {user?.user_type === 1 && (
                          <div className="mb-[-5px] mt-2 flex justify-between gap-2  pr-[34px]">
                            <div className="w-1/4">
                              <label className="text-white-dark">Period</label>
                            </div>
                            <div className="w-1/4">
                              <label className="text-white-dark">Subject</label>
                            </div>
                            <div className="w-1/4">
                              <label className="text-white-dark">Teacher</label>
                            </div>
                            <div className="w-1/4">
                              <label className="text-white-dark">Place</label>
                            </div>
                          </div>
                        )}
                        {user?.user_type === 2 && (
                          <div className="mb-[-5px] mt-2 flex justify-between gap-2 ">
                            <div className="w-1/4">
                              <label className="text-white-dark">Period</label>
                            </div>
                            <div className="w-1/4">
                              <label className="text-white-dark">Subject</label>
                            </div>
                            <div className="w-1/4">
                              <label className="text-white-dark">Teacher</label>
                            </div>
                            <div className="w-1/4">
                              <label className="text-white-dark">Place</label>
                            </div>
                          </div>
                        )}
                        {itemsAddSubject.periods?.map((period: any, index: any) =>
                          period.day === periodDay ? (
                            <div key={`period-${index}`}>
                              {user?.user_type === 1 && (
                                <div className="flex gap-2 py-2">
                                  <input
                                    className="form-input cursor-not-allowed disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]"
                                    disabled
                                    type="text"
                                    value={period.number}
                                    onChange={(e) => handleNumberChange(index, e.target.value)}
                                  />

                                  <select required className="form-select" value={period.subject} onChange={(e) => handleSubjectChange(index, e.target.value)}>
                                    <option value="">Select Subject</option>
                                    {dataSubject?.map((item: any) => (
                                      <option value={item.name} key={item.id}>
                                        {item.name}
                                      </option>
                                    ))}
                                  </select>
                                  <select required className="form-select" value={period.teacher} onChange={(e) => handleTeacherChange(index, e.target.value)}>
                                    <option value="">Select Teacher</option>
                                    {dataTeacher?.map((item: any) => (
                                      <option value={item.name} key={item.id}>
                                        {item.name}
                                      </option>
                                    ))}
                                  </select>
                                  <input required className="form-input " type="text" value={period.place} onChange={(e) => handlePlaceChange(index, e.target.value)} />
                                  <button type="button" className="ml-2 mt-2 flex hover:text-danger" onClick={() => removePeriod(index)}>
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
                              )}
                              {user?.user_type === 2 && (
                                <div className="flex gap-2 py-2">
                                  {user?.name === period.teacher ? (
                                    <input
                                      className="form-input cursor-not-allowed disabled:pointer-events-none disabled:bg-[#deeffd] dark:disabled:bg-[#1b2e4b]"
                                      disabled
                                      type="text"
                                      value={period.number}
                                    />
                                  ) : (
                                    <input
                                      className="form-input cursor-not-allowed disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]"
                                      disabled
                                      type="text"
                                      value={period.number}
                                    />
                                  )}
                                  {user?.name === period.teacher ? (
                                    <input
                                      className="form-input cursor-not-allowed disabled:pointer-events-none disabled:bg-[#deeffd] dark:disabled:bg-[#1b2e4b]"
                                      disabled
                                      type="text"
                                      value={period.subject}
                                    />
                                  ) : (
                                    <input
                                      className="form-input cursor-not-allowed disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]"
                                      disabled
                                      type="text"
                                      value={period.subject}
                                    />
                                  )}
                                  {user?.name === period.teacher ? (
                                    <input
                                      className="form-input cursor-not-allowed disabled:pointer-events-none disabled:bg-[#deeffd] dark:disabled:bg-[#1b2e4b]"
                                      disabled
                                      type="text"
                                      value={period.teacher}
                                    />
                                  ) : (
                                    <input
                                      className="form-input cursor-not-allowed disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]"
                                      disabled
                                      type="text"
                                      value={period.teacher}
                                    />
                                  )}
                                  {user?.name === period.teacher ? (
                                    <input
                                      className="form-input cursor-not-allowed disabled:pointer-events-none disabled:bg-[#deeffd] dark:disabled:bg-[#1b2e4b]"
                                      disabled
                                      type="text"
                                      value={period.place}
                                    />
                                  ) : (
                                    <input
                                      className="form-input cursor-not-allowed disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]"
                                      disabled
                                      type="text"
                                      value={period.place}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          ) : null
                        )}
                      </>
                    )}
                  </div>
                </div>
                {user?.user_type === 1 && (
                  <button className="btn btn-primary" type="submit">
                    Submit
                  </button>
                )}
              </form>
            </div>
          )}
        </div>

        {/* <div className={`panel ml-3 w-1/4`}> */}
        <div className="panel col-span-1">
          {showLoading ? (
            <div className="flex items-center justify-center">
              <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
            </div>
          ) : (
            <div>
              <div className="invoice-table">
                <h5 className="mb-5  text-lg font-semibold">Class</h5>
                <div className="mb-4.5 flex flex-col md:flex-row md:items-center">
                  <input type="text" className="form-input w-full" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="datatables">
                <DataTable
                  noRecordsText="No results match your search query"
                  highlightOnHover
                  className="table-hover whitespace-nowrap"
                  records={recordsData}
                  columns={[
                    {
                      accessor: 'name',
                      title: 'Name',
                      sortable: false,
                      textAlignment: 'center',
                      render: ({ id, name }) => (
                        <div className={`flex w-max gap-4 ${activeRow === id ? 'text-primary' : ''}`}>
                          <button type="button" className="flex hover:text-primary" onClick={() => handleRowClick(id)}>
                            {name}
                          </button>
                        </div>
                      ),
                    },
                  ]}
                  totalRecords={initialRecords.length}
                  recordsPerPage={pageSize}
                  page={page}
                  onPageChange={(p) => setPage(p)}
                  recordsPerPageOptions={PAGE_SIZES}
                  onRecordsPerPageChange={setPageSize}
                  sortStatus={sortStatus}
                  onSortStatusChange={setSortStatus}
                  minHeight={200}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TimesTable;
