import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  updateExpense: (expense: ExpenseSummary) => void;
};

export default function AddExpenseDialog(props: Props) {
  const [people, setPeople] = useState<
    {
      name: string;
      amount: number;
    }[]
  >([
    {
      name: 'john',
      amount: 100,
    },
    {
      name: 'sam',
      amount: 0,
    },
    {
      name: 'mark',
      amount: 0,
    },
  ]);
  const [nameInput, setNameInput] = useState('');
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('0');

  function deletePerson(name: string) {
    setPeople((people) => people.filter((person) => person.name !== name));
  }

  function addPerson() {
    setPeople((people) => [
      ...people,
      {
        name: nameInput,
        amount: Number(expenseAmount),
      },
    ]);
    setNameInput('');
  }

  function onSave() {
    // props.updateExpense()
    props.onClose();
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle align='center'>Add Expense</DialogTitle>
      <DialogContent>
        <Stack gap={2} width={300}>
          <Typography fontWeight={'bold'}>Description of Expense</Typography>
          <FormControl fullWidth>
            <InputLabel htmlFor='expense'>Expense Name</InputLabel>
            <OutlinedInput
              value={expenseName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setExpenseName(event.target.value)}
              id='expense'
              label='Expense Name'
              startAdornment={
                <InputAdornment position='start'>
                  <ShoppingCartIcon color='error' />
                </InputAdornment>
              }
            />
          </FormControl>

          <Typography fontWeight={'bold'}>People Involved</Typography>

          <FormControl fullWidth>
            <InputLabel htmlFor='person'>Person</InputLabel>
            <OutlinedInput
              id='person'
              label='Person'
              startAdornment={
                <InputAdornment position='start'>
                  <AccountCircleIcon />
                </InputAdornment>
              }
              value={nameInput}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNameInput(event.target.value)}
            />
          </FormControl>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <FormControl fullWidth>
              <InputLabel htmlFor='expense-amount'>Amount</InputLabel>
              <OutlinedInput
                value={expenseAmount}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setExpenseAmount(event.target.value)}
                fullWidth
                id='expense-amount'
                label='Amount'
                type='number'
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                startAdornment={<InputAdornment position='start'>$</InputAdornment>}
              />
            </FormControl>
            <IconButton color='primary' onClick={addPerson} disabled={!nameInput}>
              <PersonAddIcon />
            </IconButton>
          </Stack>
        </Stack>
        <Stack pt={2} gap={1} direction={'row'} flexWrap={'wrap'} maxWidth={300}>
          {people.map((person) => (
            <Chip color={person.amount === 0 ? 'error' : 'primary'} label={`${person.name} - $${person.amount}`} key={person.name} onDelete={() => deletePerson(person.name)} />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction={'row'} justifyContent={'space-between'} width='100%' pb={2} px={2}>
          <Button onClick={props.onClose} variant='contained' color='error'>
            Cancel
          </Button>
          <Button variant='contained' color='success' onClick={onSave} autoFocus>
            Save
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
