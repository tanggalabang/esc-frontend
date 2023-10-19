import { useGetAllCoursesQuery } from '@/redux/features/student/studentApi';
import BlankLayout from '@/components/Layouts/BlankLayout';
import React from 'react';

type Props = {};

const student = (props: Props) => {
    const { data } = useGetAllCoursesQuery({});

    console.log(data);

    return (
        <div>
         {data ? (
        data.data.map((course:any) => (
          <li key={course.id}>{course.name} : {course.email}</li>
        ))
      ) : (
        <div>Loading...</div>
      )}
        </div>
    );
};
student.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};

export default student;
