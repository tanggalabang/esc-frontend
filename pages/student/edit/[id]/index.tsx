import { FC, useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { setPageTitle } from '../../store/themeConfigSlice';
import { useCreateCourseMutation, useEditCourseMutation, useGetAllCoursesQuery } from '@/redux/features/student/studentApi';
import { useRouter } from 'next/router';
import { redirect } from 'next/navigation';

type Props = {};

const Edit = ({ params }: any) => {
  const router = useRouter();
  const { id } = router.query;

  const [editCourse, { isSuccess, error }] = useEditCourseMutation();

  const { data, refetch } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });

  const stringNumber = id;
  const numberId = Number(stringNumber);

  const editCourseData = data && data.find((i: any) => i.id === numberId);

  useEffect(() => {
    if (isSuccess) {
      // toast.success("Course updated successfully");
      redirect('/student/list');
    }
    if (error) {
      if ('data' in error) {
        const errorMessage = error as any;
        // toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (editCourseData) {
      setItems({
        nis: editCourseData.nis,
        name: editCourseData.name,
        email: editCourseData.email,
      });
    }
  }, [editCourseData]);

  const [items, setItems] = useState({
    nis: '',
    name: '',
    email: '',
  });
  // console.log(items);

  const editItem = async (e: any) => {
    e.preventDefault();
    const data = items;
    await editCourse({ id: editCourseData?.id, data });
  };

  // const removeItem = (item: any = null) => {
  //   setItems(items.filter((d: any) => d.id !== item.id));
  // };

  // const changeQuantityPrice = (type: string, value: string, id: number) => {
  //   const list = items;
  //   const item = list.find((d: any) => d.id === id);
  //   if (type === 'quantity') {
  //     item.quantity = Number(value);
  //   }
  //   if (type === 'price') {
  //     item.amount = Number(value);
  //   }
  //   setItems([...list]);
  // };

  return (
    <div className="flex flex-col gap-2.5 xl:flex-row">
      <form onSubmit={editItem} action="">
        <div className="mt-6 w-full xl:mt-0 xl:w-96">
          <div className="panel mb-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input type="hidden" name="_token" value="{{ csrf_token() }}" />
              <div>
                <label htmlFor="nis">Nis</label>
                <input
                  id="nis"
                  type="text"
                  name=""
                  required
                  value={items.nis} //courseInfo adalah useState object / array
                  onChange={(
                    e: any //mengupdate perubahan secra realtime
                  ) => setItems({ ...items, nis: e.target.value })}
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
                  value={items.email} //courseInfo adalah useState object / array
                  onChange={(
                    e: any //mengupdate perubahan secra realtime
                  ) => setItems({ ...items, email: e.target.value })}
                  placeholder="Enter Email"
                  className="form-input"
                />
              </div>
            </div>
            <div className="mt-4">
              <div>
                <label htmlFor="shipping-charge">Nama</label>
                <input
                  id="name"
                  type="text"
                  name=""
                  required
                  value={items.name} //courseInfo adalah useState object / array
                  onChange={(
                    e: any //mengupdate perubahan secra realtime
                  ) => setItems({ ...items, name: e.target.value })}
                  placeholder="Enter Name"
                  className="form-input"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="payment-method">Kelas</label>
              <select id="payment-method" name="payment-method" className="form-select">
                <option value=" ">Select Payment</option>
                <option value="bank">Bank Account</option>
                <option value="paypal">Paypal</option>
                <option value="upi">UPI Transfer</option>
              </select>
            </div>
          </div>
          <div className="panel">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-1">
              <button type="submit" className="btn btn-success w-full gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                  <path
                    d="M3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 11.6585 22 11.4878 21.9848 11.3142C21.9142 10.5049 21.586 9.71257 21.0637 9.09034C20.9516 8.95687 20.828 8.83317 20.5806 8.58578L15.4142 3.41944C15.1668 3.17206 15.0431 3.04835 14.9097 2.93631C14.2874 2.414 13.4951 2.08581 12.6858 2.01515C12.5122 2 12.3415 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M17 22V21C17 19.1144 17 18.1716 16.4142 17.5858C15.8284 17 14.8856 17 13 17H11C9.11438 17 8.17157 17 7.58579 17.5858C7 18.1716 7 19.1144 7 21V22"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path opacity="0.5" d="M7 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Edit;
