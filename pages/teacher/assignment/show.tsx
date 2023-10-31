import Link from 'next/link';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import dynamic from 'next/dynamic';
import HTMLReactParser from 'html-react-parser';
import { useGetAllClassQuery, useGetAllSubjectQuery } from '@/redux/features/class-subject/classSubjectApi';
import { useCreateAssignmentMutation, useGetAllAssignmentQuery, useGetAllFilesQuery } from '@/redux/features/assignment/assignmentApi';

import { Dialog, Transition } from '@headlessui/react';
import PDFIcon from '@/pages/components/icons/pdf-solid';
import DocIcon from '@/pages/components/icons/doc-solid';
import ImageIcon from '@/pages/components/icons/image-solid';
import XMLIcon from '@/pages/components/icons/xml-solid';
import VideoIcon from '@/pages/components/icons/video-solid';
import AudioIcon from '@/pages/components/icons/audio-solid';
import FileIcon from '@/pages/components/icons/file-solid';
import Test3 from '@/pages/test/test3';
const DynamicJoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
});

const useReff = (initialValue: any) => {
  return useRef(initialValue);
};
const Add = () => {
  //--main variable
  const [itemsAssignment, setItemsAssignment] = useState({
    name: '',
    class: '',
    subject: '',
    dueDate: '',
    content: null,
  });

  const editor = useRef(null);
  const contentReff = useReff('');

  useEffect(() => {
    console.log(itemsAssignment);
  }, [itemsAssignment]);

  //--get data subject and class
  const { data: dataSubjects } = useGetAllSubjectQuery({});
  const { data: dataClasses } = useGetAllClassQuery({});

  //--handel create
  const [createAssignment, { isSuccess, error }] = useCreateAssignmentMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await setItemsAssignment({
      ...itemsAssignment,
      content: contentReff.current,
    });

    await createAssignment(itemsAssignment);
  };

  //==========
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Invoice Add'));
  });

  const currencyList = ['USD - US Dollar', 'GBP - British Pound', 'IDR - Indonesian Rupiah', 'INR - Indian Rupee', 'BRL - Brazilian Real', 'EUR - Germany (Euro)', 'TRY - Turkish Lira'];
  //==========
  const { isLoading, data, refetch } = useGetAllAssignmentQuery({}, { refetchOnMountOrArgChange: true });

  //--test
  const showData = data && data.find((i: any) => i.uid === 'CC46et0yg1lwvWaPEFqt');
  console.log(showData);

  //============ test2

  const { isLoading: loadingFile, data: dataFile, refetch: refetchFile } = useGetAllFilesQuery({}, { refetchOnMountOrArgChange: true });

  //--test
  // const showData = data && data.find((i: any) => i.ass_uid === 'K5Ekbv3YIHwBfvajOZ6Z');
  const assUidToFilter = 'CC46et0yg1lwvWaPEFqt';
  const showDataFile = dataFile?.filter((item: any) => item.ass_uid === assUidToFilter);
  console.log(showData);

  const fileType = {
    pdf: <PDFIcon className="h-10 w-10" />,
    docx: <DocIcon className="h-10 w-10" />,
    doc: <DocIcon className="h-10 w-10" />,
    png: <ImageIcon className="h-10 w-10" />,
    jpg: <ImageIcon className="h-10 w-10" />,
    jpeg: <ImageIcon className="h-10 w-10" />,
    xls: <XMLIcon className="h-10 w-10" />,
    xlsx: <XMLIcon className="h-10 w-10" />,
    mp4: <VideoIcon className="h-10 w-10" />,
    mp3: <AudioIcon />,
  } as { [key: string]: React.ReactElement };
  //================
  const [modal1, setModal1] = useState(false);
  const [showFile, setShowFile] = useState('');
  const [type, setType] = useState('');
  const [nameFile, setNameFile] = useState('');
  const [className, setClassName] = useState('');

  const handleClick = (fileUrl: any, fileExtension: any, name: any) => {
    setModal1(true);
    setShowFile(fileUrl);
    setType(fileExtension);
    setNameFile(name);
    console.log(fileUrl);

    if (['jpg', 'png', 'jpeg', 'mp3', 'mp4', 'pdf'].includes(fileExtension)) {
      setClassName('max-w-5xl');
    } else {
      setClassName('max-w-sm');
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 xl:flex-row">
          <div className="panel flex-1  py-6 ltr:xl:mr-6 rtl:xl:ml-6">
            <div>
              <label htmlFor="currency">Content</label>
              {/* <DynamicJoditEditor ref={editor} value={contentReff.current} onChange={(newContent) => (contentReff.current = newContent)} /> */}
              <div>{HTMLReactParser(showData?.content)}</div>
            </div>

            {/* file upload */}
            <div className="mt-6">
              <label htmlFor="currency">Files</label>
              <ul className="grid grid-cols-3 gap-4">
                {showDataFile?.map((item: any) => {
                  const modifiedName = item.name.replace(/^uploads\/\d+-/, '');
                  // Memecah nama file berdasarkan titik (.)
                  const nameParts = item.name.split('.');
                  // Mengambil elemen terakhir dari array (ekstensi file)
                  const fileExtension = nameParts[nameParts.length - 1];

                  const fileUrl = `${process.env.NEXT_PUBLIC_URL}${item?.name}`;
                  return (
                    <li
                      key={item.uid}
                      className="cursor-grab"
                      onClick={() => {
                        handleClick(fileUrl, fileExtension, modifiedName);
                      }}
                    >
                      <div className="items-md-center flex flex-col rounded-md border border-white-light bg-white px-6 py-3.5 text-center dark:border-dark dark:bg-[#1b2e4b] md:flex-row ltr:md:text-left rtl:md:text-right">
                        <div className="ltr:sm:mr-4 rtl:sm:ml-4">
                          {/* <img alt="avatar" src={`/assets/images/profile.jpeg`} className="mx-auto h-11 w-11 rounded-full" /> */}
                          <>{fileType[fileExtension] || <FileIcon className="h-10 w-10" />}</>
                        </div>
                        <div className="flex flex-1 flex-col items-center justify-between md:flex-row">
                          <div className="my-3 font-semibold md:my-0">
                            <div className="text-base text-dark dark:text-[#bfc9d4]">{modifiedName}</div>
                            {/* <div className="text-xs text-white-dark">akjdflskdjfkj</div> */}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {/* Basic */}
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
                        <Dialog.Panel as="div" className={`panel my-8 h-full max-h-[80vh] w-full ${className} overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark`}>
                          <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                            <div className="text-lg font-bold">{nameFile}</div>
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
                          <div className="items-center p-5">
                            {type === 'jpg' && <img className="mx-auto h-[600px]" src={showFile} />}
                            {type === 'png' && <img className="mx-auto h-full" src={showFile} />}
                            {type === 'jpeg' && <img className="mx-auto h-full" src={showFile} />}
                            {type === 'mp3' && <audio className="w-full" controls src={showFile} />}
                            {type === 'mp4' && <video className="w-full" controls src={showFile} />}
                            {type === 'pdf' && <iframe src={showFile} width="100%" height="600px"></iframe>}
                            {type && !['jpg', 'png', 'jpeg', 'mp3', 'mp4', 'pdf'].includes(type) && (
                              <a href={showFile} download className="btn btn-primary">
                                Download File
                              </a>
                            )}
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition>
            </div>
            {/* !file upload */}

            {/* comentar */}
            <div className="mt-6">
              <label htmlFor="currency">Commentar</label>
              <Test3 />
            </div>
            {/* !comentar */}
          </div>

          <div className="mt-6 w-full xl:mt-0 xl:w-96">
            <div className="panel mb-5">
              <div>
                <div>
                  <label htmlFor="shipping-charge">Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    className="form-input"
                    defaultValue={itemsAssignment.name}
                    onChange={(e: any) => setItemsAssignment({ ...itemsAssignment, name: e.target.value })}
                    placeholder="Enter Name"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="currency">Class</label>
                <select required className="form-select" onChange={(e: any) => setItemsAssignment({ ...itemsAssignment, subject: e.target.value })}>
                  <option value="">Select Subject</option>
                  {dataSubjects?.map((item: any) => (
                    <option value={item.name} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4">
                <label htmlFor="currency">Subject</label>
                <select required className="form-select" onChange={(e: any) => setItemsAssignment({ ...itemsAssignment, class: e.target.value })}>
                  <option value="">Select Class</option>
                  {dataClasses?.map((item: any) => (
                    <option value={item.name} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4">
                <label htmlFor="tax">Due Date</label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <input id="tax" type="date" name="tax" className="form-input" defaultValue={0} placeholder="Tax" />
                  </div>
                  <div>
                    <input id="discount" type="time" name="discount" className="form-input" defaultValue={0} placeholder="Discount" />
                  </div>
                </div>
              </div>
            </div>
            <div className="panel">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-1">
                <button type="button" onClick={handleSubmit} className="btn btn-success w-full gap-2">
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

                <Link href="/apps/invoice/preview" className="btn btn-primary w-full gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ltr:mr-2 rtl:ml-2">
                    <path
                      opacity="0.5"
                      d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  Preview
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Add;
