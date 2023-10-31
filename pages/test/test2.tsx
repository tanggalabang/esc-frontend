import { Dialog, Transition } from '@headlessui/react';
import { useGetAllFilesQuery } from '@/redux/features/assignment/assignmentApi';
import React, { Fragment, useEffect, useState } from 'react';
import PDFIcon from '../components/icons/pdf-solid';
import DocIcon from '../components/icons/doc-solid';
import ImageIcon from '../components/icons/image-solid';
import XMLIcon from '../components/icons/xml-solid';
import VideoIcon from '../components/icons/video-solid';
import AudioIcon from '../components/icons/audio-solid';
import FileIcon from '../components/icons/file-solid';

type Props = {};

const test2 = (props: Props) => {
  const { isLoading, data, refetch } = useGetAllFilesQuery({}, { refetchOnMountOrArgChange: true });

  //--test
  // const showData = data && data.find((i: any) => i.ass_uid === 'K5Ekbv3YIHwBfvajOZ6Z');
  const assUidToFilter = 'CC46et0yg1lwvWaPEFqt';
  const showData = data?.filter((item: any) => item.ass_uid === assUidToFilter);
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
      <ul className="grid grid-cols-3 gap-4">
        {showData?.map((item: any) => {
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
    </>
  );
};

export default test2;
