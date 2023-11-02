import Link from 'next/link';
import HTMLReactParser from 'html-react-parser';
import { useGetAllAssignmentQuery, useGetAllFilesQuery } from '@/redux/features/assignment/assignmentApi';
import { useRouter } from 'next/router';
//componnets
import FileShow from '@/components/files/FileShow';
import Comment from '@/components/comment/Comment';
import { useAuth } from '@/pages/hooks/auth';
import { useEffect } from 'react';

type Props = {};

const Show = ({ params }: any) => {
  //--get id from url
  const router = useRouter();
  const { id } = router.query;

  //--get assignment by id url
  const { isLoading, data, refetch } = useGetAllAssignmentQuery({}, { refetchOnMountOrArgChange: true });

  const showData = data && data.find((i: any) => i.uid === id);

  //--get file assignment by id url
  const { isLoading: loadingFile, data: dataFile, refetch: refetchFile } = useGetAllFilesQuery({}, { refetchOnMountOrArgChange: true });

  const assUidToFilter = id;
  const showDataFile = dataFile?.filter((item: any) => item.ass_uid === assUidToFilter);

  //ROUTE PROTECTED
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.user_type !== 2) {
      router.push('/404');
    }
  }, [user]); // Gunakan array dependensi kosong agar efek hanya dijalankan sekali
  //ROUTE PROTECTED
  return (
    <>
      {/* LOADING PROTECTED */}
      {!user ||
        (user?.user_type !== 2 && (
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
      {/* !LOADING PROTECTED */}
      {isLoading ? (
        <div className="flex items-center justify-center">
          <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 xl:flex-row">
          {/* left component */}
          <div className="panel flex-1  py-6 ltr:xl:mr-6 rtl:xl:ml-6">
            {/* content */}
            <div className="mb-6">
              <h5 className="mb-6 text-lg font-semibold dark:text-white-light">Content</h5>
              {showData?.content && <div>{HTMLReactParser(showData?.content)}</div>}
            </div>

            <hr />

            {/* file upload */}
            <div className="mb-6 mt-10">
              <FileShow showDataFile={showDataFile} />
            </div>

            {/* comment */}
            <hr />
            <div className="mb-6 mt-10">
              <h5 className="mb-6 text-lg font-semibold dark:text-white-light">Commentar</h5>
              <Comment uid={showData?.uid} />
            </div>
          </div>
          {/* !left component */}

          {/* right component */}
          <div className=" mt-6 w-full xl:mt-0 xl:w-96">
            <div className="panel mb-5">
              <h5 className="mb-6 text-lg font-semibold dark:text-white-light">Information</h5>
              <table className="text-left">
                <tr>
                  <th className="py-2">Name</th>
                  <td>: {showData?.name}</td>
                </tr>
                <tr>
                  <th className="py-2">Class</th>
                  <td>: {showData?.class_name}</td>
                </tr>
                <tr>
                  <th className="py-2">Subject</th>
                  <td>: {showData?.subject_name}</td>
                </tr>
                <tr>
                  <th className="py-2">Due Date</th>
                  <td>: {showData?.due_date}</td>
                </tr>
              </table>
            </div>
            <div className="panel">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-1">
                <Link href="/teacher/assignment" className="btn btn-danger w-full gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M14.5 7L19.5 12L14.5 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M19.5 12L9.5 12C7.83333 12 4.5 13 4.5 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                  Back
                </Link>
              </div>
            </div>
          </div>
          {/* !right component */}
        </div>
      )}
    </>
  );
};

export default Show;
