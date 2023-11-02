import { useAuth } from '@/pages/hooks/auth';
import { useGetAllMaterialByTeacherQuery } from '@/redux/features/material/materialApi';
import RouteProtected from '@/components/route-protected/RouteProtected';
import Material from '@/components/material/Material';

type Props = {};

const index = (props: Props) => {
  const { isLoading, data, refetch } = useGetAllMaterialByTeacherQuery({}, { refetchOnMountOrArgChange: true });

  return (
    <>
      <RouteProtected userType={2} />
      <Material data={data} isLoading={isLoading} refetch={refetch} />
    </>
  );
};

export default index;
