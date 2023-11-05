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

type Props = {};

// const TimesTable = (props: Props) => {
const TimesTableDash3: FC<Props> = ({}) => {
  // only for admin
  const { user } = useAuth();
  const { isLoading, data, refetch } = useGetAllClassQuery({}, { refetchOnMountOrArgChange: true });
  const className = data && data.find((i: any) => i.id === user?.class_id); // coneole.log(editCourseData);

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
    const firstClass = user?.class_id;
    console.log(firstClass);
    setActiveRow(firstClass);
  }, [items]);
  // console.log(firstClass);
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

  return (
    <>
      <div className="gap-6">
        {/* <div className={`panel mr-3 w-3/4 `}> */}
        <div className="panel">
          {showLoadingTimes ? (
            <div className="flex items-center justify-center">
              <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
            </div>
          ) : (
            <>
              <form onSubmit={handleTimeTable}>
                <div className="mt-2 ">
                  <div className="flex ">
                    {/* <h5 className="  text-lg font-semibold text-primary">{itemsAddSubject.class}</h5> */}
                    <h5 className="  text-lg font-semibold">Times Table</h5>
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
                        {itemsAddSubject.periods?.map((period: any, index: any) =>
                          period.day === periodDay ? (
                            <div key={`period-${index}`}>
                              <div className="flex gap-2 py-2">
                                <input
                                  className="form-input cursor-not-allowed disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]"
                                  disabled
                                  type="text"
                                  value={period.number}
                                />
                                <input
                                  className="form-input cursor-not-allowed disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]"
                                  disabled
                                  type="text"
                                  value={period.subject}
                                />
                                <input
                                  className="form-input cursor-not-allowed disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]"
                                  disabled
                                  type="text"
                                  value={period.teacher}
                                />
                                <input className="form-input cursor-not-allowed disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]" disabled type="text" value={period.place} />
                              </div>
                            </div>
                          ) : null
                        )}
                      </>
                    )}
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TimesTableDash3;
