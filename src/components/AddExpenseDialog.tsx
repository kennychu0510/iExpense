import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useTheme, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';
import React, { useId, useRef, useState } from 'react';
import { Person } from '../utilities/entity';
import { calculateExpenseSplitSummary } from '../utilities';
import { capitalize } from '../utilities/helper';
import useMediaQuery from '@mui/material/useMediaQuery';
import useSmallScreen from '../hooks/useSmallScreen';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

type Props = {
  open: boolean;
  onClose: () => void;
  updateExpense: (expense: ExpenseSummary) => void;
  defaultValues?: ExpenseSummary;
};

export default function AddExpenseDialog(props: Props) {
  const theme = useTheme();
  const randomId = useId();
  const id = props.defaultValues?.id ?? randomId;
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
      settled: item.settled
    })) ?? [
      {
        name: 'john',
        amount: 100,
        settled: false
      },
      {
        name: 'sam',
        amount: 200,
        settled: false
      },
      {
        name: 'dave',
        amount: 0,
        settled: false
      },
    ]
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
        settled: false
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
              onChangeCapture={() => setFormError(false)}
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
          <Button variant='contained' color='success' onClick={onSave} autoFocus>
            Save
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
