import { useGetAllClassQuery } from '@/redux/features/class-subject/classSubjectApi';
import TimesTable from '@/components/times-table/TimesTable';
import RouteProtected from '@/components/route-protected/RouteProtected';

type Props = {};

const index = (props: Props) => {
  const { isLoading, data, refetch } = useGetAllClassQuery({}, { refetchOnMountOrArgChange: true });

  return (
    <>
      <RouteProtected userType={1} />
      <TimesTable data={data} />
    </>
  );
};

export default index;
