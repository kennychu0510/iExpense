import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  clearExpenses: () => void;
};

export default function SettingsDialog(props: Props) {
  function onClear() {
    props.clearExpenses();
    props.onClose();
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle align='center'>Confirm</DialogTitle>
      <DialogContent>
        <Typography>Clear all expenses?</Typography>
      </DialogContent>
      <DialogActions>
        <Stack direction={'row'} justifyContent={'center'} width='100%' pb={2} px={2}>
          <Button variant='contained' color='error' onClick={onClear} autoFocus startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
