import { useRef } from 'react';
import HTMLReactParser from 'html-react-parser';
import React from 'react';
import dynamic from 'next/dynamic';

const DynamicJoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
});

type Props = {};

const useReff = (initialValue: any) => {
  return useRef(initialValue);
};

const index = (props: Props) => {
  const editor = useRef(null);
  const contentReff = useReff('');

  const displayContent = () => {
    console.log(contentReff.current);
  };

  return (
    <div>
      <h1>Welcome to Ageee Dev</h1>
      <DynamicJoditEditor ref={editor} value={contentReff.current} onChange={(newContent) => (contentReff.current = newContent)} />
      <button onClick={displayContent}>Display Content</button>
    </div>
  );
};

export default index;

// import { useRef, useMemo } from 'react';
// import HTMLReactParser from 'html-react-parser';
// import React from 'react';
// import dynamic from 'next/dynamic';

// const DynamicJoditEditor = dynamic(() => import('jodit-react'), {
//   ssr: false,
// });

// type Props = {};

// const useReff = (initialValue: any) => {
//   const ref = useRef(initialValue);

//   return {
//     value: ref.current,
//     setValue: (newValue: any) => {
//       ref.current = newValue;
//     },
//   };
// };

// const index = (props: Props) => {
//   const editor = useRef(null);
//   const contentReff = useReff('');

//   const displayContent = (e: any) => {
//     e.preventDefault();
//     console.log(contentReff.value);
//   };

//   return (
//     <div>
//       <h1>Welcome to Ageee Dev</h1>
//       <DynamicJoditEditor ref={editor} value={contentReff.value} onChange={(newContent) => contentReff.setValue(newContent)} />
//       <button onClick={displayContent}>Display Content</button>
//     </div>
//   );
// };

// export default index;

// import { useRef, useMemo } from 'react';
// import HTMLReactParser from 'html-react-parser';
// import React from 'react';
// import dynamic from 'next/dynamic';

// const DynamicJoditEditor = dynamic(() => import('jodit-react'), {
//   ssr: false, // Setel false untuk menonaktifkan SSR
// });

// type Props = {};

// const useReff = (initialValue: any) => {
//   const ref = useRef(initialValue);

//   return {
//     value: ref.current,
//     setValue: (newValue: any) => {
//       ref.current = newValue;
//     },
//   };
// };

// const index = (props: Props) => {
//   const editor = useRef(null);
//   const contentReff = useReff('');

//   return (
//     <div>
//       <h1>Welcome to Ageee Dev</h1>
//       <DynamicJoditEditor ref={editor} value={contentReff.value} onChange={(newContent) => contentReff.setValue(newContent)} />
//     </div>
//   );
// };

// export default index;

// import { useState, useRef, useMemo } from 'react';
// // import JoditEditor from 'jodit-react';
// import HTMLReactParser from 'html-react-parser';
// import React from 'react';
// import dynamic from 'next/dynamic';

// const DynamicJoditEditor = dynamic(() => import('jodit-react'), {
//   ssr: false, // Setel false untuk menonaktifkan SSR
// });

// type Props = {};

// const index = (props: Props) => {
//   const editor = useRef(null);
//   const [content, setContent] = useState('');
//   // console.log(content);
//   return (
//     <div>
//       <h1>Welcome to Ageee Dev</h1>

//       {/* <JoditEditor ref={editor} value={content} onChange={(newContent) => setContent(newContent)} /> */}
//       <DynamicJoditEditor ref={editor} value={content} onChange={(newContent) => setContent(newContent)} />

//       {/* <div>{HTMLReactParser(content)}</div> */}
//     </div>
//   );
// };

// export default index;
