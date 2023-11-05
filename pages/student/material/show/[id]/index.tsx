import Link from 'next/link';
import HTMLReactParser from 'html-react-parser';
import { useGetAllFilesQuery } from '@/redux/features/assignment/assignmentApi';
import { useRouter } from 'next/router';
//componnets
import FileShow from '@/components/files/FileShow';
import Comment from '@/components/comment/Comment';
import { useGetAllMaterialQuery } from '@/redux/features/material/materialApi';
import RouteProtected from '@/components/route-protected/RouteProtected';

type Props = {};

const Show = ({ params }: any) => {
  //--get id from url
  const router = useRouter();
  const { id } = router.query;

  //--get assignment by id url
  const { isLoading, data, refetch } = useGetAllMaterialQuery({}, { refetchOnMountOrArgChange: true });

  const showData = data && data.find((i: any) => i.uid === id);

  //--get file assignment by id url
  const { isLoading: loadingFile, data: dataFile, refetch: refetchFile } = useGetAllFilesQuery({}, { refetchOnMountOrArgChange: true });

  const assUidToFilter = id;
  const showDataFile = dataFile?.filter((item: any) => item.ass_uid === assUidToFilter);

  return (
    <>
      <RouteProtected userType={3} />
      {isLoading ? (
        <div className="flex items-center justify-center">
          <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 xl:flex-row">
          {/* left component */}
          <div className="panel flex-1 px-10  py-6 ltr:xl:mr-6 rtl:xl:ml-6">
            {/* content */}
            <div className="mb-6">
              <h5 className="mb-6 text-lg font-semibold dark:text-white-light">Content</h5>
              {showData?.content && <div>{HTMLReactParser(showData?.content)}</div>}
            </div>

            {/* file upload */}
            {showDataFile?.length !== 0 && (
              <>
                <hr />
                <div className="mb-6 mt-10">
                  <h5 className="mb-6 text-lg font-semibold dark:text-white-light">Files</h5>
                  <FileShow showDataFile={showDataFile} />
                </div>
              </>
            )}

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
              </table>
            </div>
            <div className="panel">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-1">
                <Link href="/student/material" className="btn btn-outline-danger w-full gap-2">
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
