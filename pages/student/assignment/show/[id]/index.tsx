import Link from 'next/link';
import HTMLReactParser from 'html-react-parser';
import { useGetAllAssignmentQuery, useGetAllFilesQuery } from '@/redux/features/assignment/assignmentApi';
import { useRouter } from 'next/router';
//componnets
import FileShow from '@/components/files/FileShow';
import Comment from '@/components/comment/Comment';
import { useAuth } from '@/pages/hooks/auth';
import { useEffect } from 'react';
import RouteProtected from '@/components/route-protected/RouteProtected';
import { useGetAllStudentWorkQuery } from '@/redux/features/student-work/studentWorkApi';

type Props = {};

const Show = ({ params }: any) => {
  //--get id from url
  const router = useRouter();
  const { id } = router.query;

  console.log(id);

  //--get assignment by id url
  const { isLoading, data, refetch } = useGetAllAssignmentQuery({}, { refetchOnMountOrArgChange: true });

  const showData = data && data.find((i: any) => i.uid === id);

  //--get file assignment by id url
  const { isLoading: loadingFile, data: dataFile, refetch: refetchFile } = useGetAllFilesQuery({}, { refetchOnMountOrArgChange: true });

  const assUidToFilter = id;
  const showDataFile = dataFile?.filter((item: any) => item.ass_uid === assUidToFilter);

  //======
  const { data: dataStudentWork } = useGetAllStudentWorkQuery({}, { refetchOnMountOrArgChange: true });

  const matchingWork = dataStudentWork?.find((work: any) => work?.ass_id === id);

  return (
    <>
      <RouteProtected userType={3} />
      {isLoading ? (
        <div className="flex items-center justify-center">
          <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
        </div>
      ) : (
        <div>
          {!matchingWork && (
            <div className="relative mb-4 flex items-center rounded border border-danger bg-danger-light p-3.5 text-danger before:absolute before:top-1/2 before:-mt-2 before:inline-block before:border-b-8 before:border-r-8 before:border-t-8 before:border-b-transparent before:border-r-inherit before:border-t-transparent ltr:border-r-[64px] ltr:before:right-0 rtl:border-l-[64px] rtl:before:left-0 rtl:before:rotate-180 dark:bg-danger-dark-light">
              <span className="absolute inset-y-0 m-auto h-6 w-6 text-white ltr:-right-11 rtl:-left-11">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 7V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="12" cy="16" r="1" fill="currentColor" />
                </svg>
              </span>
              <span className="ltr:pr-2 rtl:pl-2">
                <strong className="ltr:mr-1 rtl:ml-1">Warning!</strong>This task has no yet been completed
              </span>
            </div>
          )}
          <div className="flex flex-col gap-2.5 xl:flex-row">
            {/* left component */}
            <div className="panel flex-1 px-10  py-6 ltr:xl:mr-6 rtl:xl:ml-6">
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
                <div className="!table-responsive">
                  <table className="table-hover text-left">
                    <tr>
                      <th className="py-1 text-white-dark">Name</th>
                      <td>: {showData?.name}</td>
                    </tr>
                    <tr>
                      <th className="py-1 text-white-dark">Class</th>
                      <td>: {showData?.class_name}</td>
                    </tr>
                    <tr>
                      <th className="py-1 text-white-dark">Subject</th>
                      <td>: {showData?.subject_name}</td>
                    </tr>
                    <tr>
                      <th className="py-1 text-white-dark">Due Date</th>
                      <td>: {showData?.due_date}</td>
                    </tr>
                  </table>
                </div>
              </div>
              <div className="panel">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-1">
                  <Link href={`/student/assignment/work/${id}`} className="btn btn-success w-full gap-2">
                    Your Work
                  </Link>
                  <Link href="/student/assignment" className="btn btn-outline-danger w-full gap-2">
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
        </div>
      )}
    </>
  );
};

export default Show;
