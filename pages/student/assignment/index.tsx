import RouteProtected from '@/components/route-protected/RouteProtected';
import Assignment from '@/components/assignment/Assignment';
import { useGetAllAssignmentByStudentQuery } from '@/redux/features/assignment/assignmentApi';

type Props = {};

const index = (props: Props) => {
  const { isLoading, data, refetch } = useGetAllAssignmentByStudentQuery({}, { refetchOnMountOrArgChange: true });

  return (
    <>
      <RouteProtected userType={3} />
      <Assignment data={data} isLoading={isLoading} refetch={refetch} />
    </>
  );
};

export default index;
