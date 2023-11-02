import Profile from '@/components/profile/Profile';
import RouteProtected from '@/components/route-protected/RouteProtected';

type Props = {};

const index = (props: Props) => {
  return (
    <>
      <RouteProtected userType={3} />
      <Profile />
    </>
  );
};

export default index;
