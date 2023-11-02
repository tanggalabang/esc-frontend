import { useGetAllClassByTeacherQuery, useGetAllClassQuery, useGetAllSubjectQuery } from '@/redux/features/class-subject/classSubjectApi';
import RouteProtected from '@/components/route-protected/RouteProtected';
import TimesTable from '@/components/times-table/TimesTable';

type Props = {};

const index = (props: Props) => {
  const { isLoading, data, refetch } = useGetAllClassByTeacherQuery({}, { refetchOnMountOrArgChange: true });

  return (
    <>
      <RouteProtected userType={2} />
      <TimesTable data={data} />
    </>
  );
};

export default index;
