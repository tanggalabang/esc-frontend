import BlankLayout from '@/components/Layouts/BlankLayout';
import React from 'react';
import Wrapper from '@/layout/wrapper';
// import SEO from '@/src/components/common/seo';
import HomeThree from '@/components/homes/home-3';

const index = () => {
  return (
    <Wrapper>
      {/* <SEO pageTitle={'Home 03'} /> */}
      <HomeThree />
    </Wrapper>
  );
};

index.getLayout = (page) => {
  return <BlankLayout>{page}</BlankLayout>;
};
export default index;
