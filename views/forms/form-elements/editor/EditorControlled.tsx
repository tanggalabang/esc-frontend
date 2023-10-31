// ** React Imports
import { useState } from 'react';

// ** Third Party Imports
import { EditorState } from 'draft-js';

// ** Component Import
import ReactDraftWysiwyg from '@/components/react-draft-wysiwyg';

const EditorControlled = () => {
  // ** State
  const [value, setValue] = useState(EditorState.createEmpty());
  console.log(value);

  return <ReactDraftWysiwyg editorState={value} onEditorStateChange={(data: any) => setValue(data)} />;
};

export default EditorControlled;
