import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useTheme, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';
import React, { useId, useState } from 'react';
import { Person } from '../utilities/entity';
import { calculateExpenseSplitSummary } from '../utilities';
import { capitalize } from '../utilities/helper';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
  open: boolean;
  onClose: () => void;
  clearExpenses: () => void;
};

export default function SettingsDialog(props: Props) {
  function onClear() {
    props.clearExpenses();
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
