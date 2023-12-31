import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, Typography, useTheme } from '@mui/material';
import React, { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useSmallScreen from '../hooks/useSmallScreen';
import { calculateExpenseSplitSummary } from '../utilities';
import { Person } from '../utilities/entity';
import { capitalize } from '../utilities/helper';

type Props = {
  open: boolean;
  onClose: () => void;
  updateExpense: (expense: ExpenseSummary) => void;
  defaultValues?: ExpenseSummary;
};

export default function AddExpenseDialog(props: Props) {
  const theme = useTheme();
  const [people, setPeople] = useState<
    {
      name: string;
      amount: number;
      settled: boolean;
    }[]
  >(
    props.defaultValues?.summary.map((item) => ({
      name: item.name,
      amount: item.paid,
      settled: item.settled,
    })) ?? []
  );
  const [nameInput, setNameInput] = useState('');
  const [expenseName, setExpenseName] = useState(props.defaultValues?.expenseName ?? '');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [formError, setFormError] = useState(false);
  const personInputRef = useRef<HTMLInputElement>(null);

  function deletePerson(name: string) {
    setPeople((people) => people.filter((person) => person.name !== name));
  }

  const nameIsError = people.find((person) => person.name.toLocaleLowerCase() === nameInput.toLocaleLowerCase()) !== undefined;
  const isSmallScreen = useSmallScreen();

  function addPerson() {
    if (nameIsError) {
      return;
    }
    setFormError(false);
    setPeople((people) => [
      ...people,
      {
        name: capitalize(nameInput),
        amount: Number(expenseAmount),
        settled: false,
      },
    ]);
    setNameInput('');
    setExpenseAmount('0');
  }

  function onSave() {
    if (people.length < 1) {
      setFormError(true);
      return;
    }
    const input = people.map((person) => new Person(person.name, person.amount, person.settled));
    const calculatedExpenses = calculateExpenseSplitSummary(input);
    props.updateExpense({
      expenseName: capitalize(expenseName),
      summary: calculatedExpenses,
      id: uuidv4(),
      date: new Date().toDateString(),
      isArchived: false,
    });
    props.onClose();
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} data-testid='add-expense-dialog'>
      <DialogTitle align='center'>{props.defaultValues ? 'Update Expense' : 'Add Expense'}</DialogTitle>
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
              onChangeCapture={() => setFormError(false)}
              data-testid='expense-name-input'
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
              onChangeCapture={() => setFormError(false)}
              ref={personInputRef}
              data-testid='person-name-input'
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
                onChangeCapture={() => setFormError(false)}
                data-testid='person-amount-input'
              />
            </FormControl>
            <IconButton color='primary' onClick={addPerson} disabled={!nameInput} data-testid='add-person'>
              <PersonAddIcon />
            </IconButton>
          </Stack>
        </Stack>
        <Stack pt={2} gap={1} direction={'row'} flexWrap={'wrap'}>
          {people.map((person) => (
            <Chip color={person.amount === 0 ? 'error' : 'primary'} label={`${person.name} - $${person.amount}`} key={person.name} onDelete={() => deletePerson(person.name)} />
          ))}
        </Stack>
        {formError && (
          <Stack direction={'row'} gap={1} alignItems={'center'}>
            <ErrorOutlineIcon color='error' />
            <Typography color={theme.palette.error.main}>Add some people!</Typography>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Stack direction={'row'} justifyContent={'space-between'} width='100%' pb={2} px={2}>
          <Button onClick={props.onClose} variant='contained' color='error'>
            Cancel
          </Button>
          <Button variant='contained' color='success' onClick={onSave} autoFocus data-testid='save-expense'>
            Save
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
