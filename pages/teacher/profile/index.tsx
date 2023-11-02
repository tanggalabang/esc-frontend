import { useAuth } from '@/pages/hooks/auth';
import { useGetAllTeachersQuery } from '@/redux/features/teacher/teacherApi';
import Profile from '@/components/profile/Profile';
import RouteProtected from '@/components/route-protected/RouteProtected';

type Props = {};

const index = (props: Props) => {
  const { user } = useAuth();

  //GET TEACHER
  const { data: dataTeacher } = useGetAllTeachersQuery({}, { refetchOnMountOrArgChange: true });

  const showData = dataTeacher && dataTeacher.find((i: any) => i.id === user.id);
  //GET TEACHER

  return (
    <>
      <RouteProtected userType={2} />
      <Profile showData={showData} />
    </>
  );
};

export default index;
