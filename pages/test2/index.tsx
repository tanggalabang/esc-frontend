import React, { useState } from 'react';

export const styles = {
  title: 'text-[25px] text-black dark:text-white font-[500] font-Poppins text-center py-2',
  label: 'text-[16px] font-Poppins text-black dark: text-white',
  input: 'w-full text-black dark:text-white bg-transparent border rounded h-[40px] px-2 outline-none mt-[10px] font-Poppins',
  button: 'flex flex-row justify-center items-center py-3 px-6 rounded-full cursor-pointer bg-[#2190ff] min-h-[45px] w-full text-[16px] font-Poppins font-semibold',
};

type Props = {};

const index = (props: Props) => {
  // variable data
  const [courseContentData, setCourseContentData] = useState([
    {
      videoUrl: '',
      title: '',
      description: '',
      videoSection: 'Untitled Section',
      links: [
        {
          title: '',
          url: '',
        },
      ],
      suggestion: '',
    },
  ]);

  // add section
  const addNewSection = () => {
    const newContent = {
      videoUrl: '',
      title: '',
      description: '',
      videoSection: `Untitled Section`,
      links: [{ title: '', url: '' }],
    };
    setCourseContentData([...courseContentData, newContent]);
  };
  console.log(courseContentData);

  return (
    <div className="m-auto mt-24 w-[80%] p-3">
      <form>
        {courseContentData?.map((item: any, index: number) => {
          return (
            <>
              <div className="flex justify-between">
                <input
                  type="text"
                  className={`text-[20px] ${item.videoSection === 'Untitled Section' ? 'w-[170px]' : 'w-min'} font-Poppins cursor-pointer bg-transparent text-black outline-none dark:text-white`}
                  value={item.videoSection}
                  onChange={(e) => {
                    const updatedData = [...courseContentData];
                    updatedData[index].videoSection = e.target.value;
                    setCourseContentData(updatedData);
                  }}
                />
                <div
                  className={`mr-2 text-[20px] text-black dark:text-white ${index > 0 ? 'cursor-pointer' : 'cursor-no-drop'}`}
                  onClick={() => {
                    if (index > 0) {
                      const updatedData = [...courseContentData];
                      updatedData.splice(index, 1);
                      setCourseContentData(updatedData);
                    }
                  }}
                >
                  hapus
                </div>
              </div>
              <div>
                {/* video title */}
                <div className="my-3">
                  <label className={styles.label}>Video Title</label>
                  <input
                    type="text"
                    placeholder="Project Plan..."
                    className={`${styles.input}`}
                    value={item.title}
                    onChange={(e) => {
                      const updatedData = [...courseContentData];
                      updatedData[index].title = e.target.value;
                      setCourseContentData(updatedData);
                    }}
                  />
                </div>
                {/* video url */}
                <div className="mb-3">
                  <label className={styles.label}>Video Url</label>
                  <input
                    type="text"
                    placeholder="sdde"
                    className={`${styles.input}`}
                    value={item.videoUrl}
                    onChange={(e) => {
                      const updatedData = [...courseContentData];
                      updatedData[index].videoUrl = e.target.value;
                      setCourseContentData(updatedData);
                    }}
                  />
                </div>
                {/* video description */}
                <div className="mb-3">
                  <label className={styles.label}>Video Description</label>
                  <textarea
                    rows={8}
                    cols={30}
                    placeholder="sdder"
                    className={`${styles.input} !h-min py-2`}
                    value={item.description}
                    onChange={(e) => {
                      const updatedData = [...courseContentData];
                      updatedData[index].description = e.target.value;
                      setCourseContentData(updatedData);
                    }}
                  />
                  <br />
                </div>
              </div>
            </>
          );
        })}
        <div className="btn btn-success" onClick={() => addNewSection()}>
          add section
        </div>
      </form>
    </div>
  );
};

export default index;
