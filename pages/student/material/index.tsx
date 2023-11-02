import RouteProtected from '@/components/route-protected/RouteProtected';
import Material from '@/components/material/Material';
import { useGetAllMaterialByStudentQuery } from '@/redux/features/material/materialApi';

type Props = {};

const index = (props: Props) => {
  const { isLoading, data } = useGetAllMaterialByStudentQuery({}, { refetchOnMountOrArgChange: true });
  return (
    <>
      <RouteProtected userType={3} />
      <Material data={data} isLoading={isLoading} />
    </>
  );
};

export default index;
