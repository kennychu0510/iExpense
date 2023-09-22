import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useTheme, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';
import React, { useId, useState } from 'react';
import { Person } from '../utilities/entity';
import { calculateExpenseSplitSummary } from '../utilities';
import { capitalize } from '../utilities/helper';
import useMediaQuery from '@mui/material/useMediaQuery';

type Props = {
  open: boolean;
  onClose: () => void;
  updateExpense: (expense: ExpenseSummary) => void;
  defaultValues?: {
    name: string;
    amount: number;
  }[];
};

export default function AddExpenseDialog(props: Props) {
  const theme = useTheme();
  const id = useId();
  const [people, setPeople] = useState<
    {
      name: string;
      amount: number;
    }[]
  >(props.defaultValues ?? []);
  const [nameInput, setNameInput] = useState('');
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('0');

  function deletePerson(name: string) {
    setPeople((people) => people.filter((person) => person.name !== name));
  }

  const nameIsError = people.find((person) => person.name.toLocaleLowerCase() === nameInput.toLocaleLowerCase()) !== undefined;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  function addPerson() {
    if (nameIsError) {
      return;
    }
    setPeople((people) => [
      ...people,
      {
        name: capitalize(nameInput),
        amount: Number(expenseAmount),
      },
    ]);
    setNameInput('');
    setExpenseAmount('0');
  }

  function onSave() {
    const input = people.map((person) => new Person(person.name, person.amount));
    const calculatedExpenses = calculateExpenseSplitSummary(input);
    props.updateExpense({
      expenseName: capitalize(expenseName),
      summary: calculatedExpenses,
      id,
      date: new Date().toDateString(),
    });
    props.onClose();
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle align='center'>Add Expense</DialogTitle>
      <DialogContent sx={{ width: isSmallScreen ? 250 : 400 }}>
        <Stack gap={2}>
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
              autoCapitalize=''
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
              error={nameIsError}
            />
            {nameIsError && <Typography color={theme.palette.error.main}>Duplicated name</Typography>}
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
        <Stack pt={2} gap={1} direction={'row'} flexWrap={'wrap'}>
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
