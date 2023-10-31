// ** Next Import
import Link from 'next/link';

// ** MUI Imports
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

// ** Styled Component Import
import { EditorWrapper } from '@/components/styles/libs/react-draft-wysiwyg';

// ** Demo Components Imports
import EditorControlled from '@/views/forms/form-elements/editor/EditorControlled';

// ** Source code imports
import * as source from '@/views/forms/form-elements/editor/EditorSourceCode';

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
}));

const Editors = () => {
  return (
    <EditorWrapper>
      <Grid container spacing={6} className="match-height">
        <Grid item xs={12}>
          <EditorControlled />
        </Grid>
      </Grid>
    </EditorWrapper>
  );
};

export default Editors;
