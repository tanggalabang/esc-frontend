import RouteProtected from '@/components/route-protected/RouteProtected';
import Assignment from '@/components/assignment/Assignment';
import { useGetAllAssignmentByTeacherQuery } from '@/redux/features/assignment/assignmentApi';

type Props = {};

const index = (props: Props) => {
  const { isLoading, data, refetch } = useGetAllAssignmentByTeacherQuery({}, { refetchOnMountOrArgChange: true });
  console.log(data);

  return (
    <>
      <RouteProtected userType={2} />
      <Assignment data={data} isLoading={isLoading} refetch={refetch} />
    </>
  );
};

export default index;
