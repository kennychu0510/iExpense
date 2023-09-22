import { useState } from 'react';

import AddExpenseDialog from './components/AddExpenseDialog';
import { Stack, Typography, Container, Button, IconButton } from '@mui/material';
import ExpenseSummary from './components/ExpenseSummary';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsDialog from './components/SettingsDialog';

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseSummary[]>([]);

  function onSave(expense: ExpenseSummary) {
    setExpenses((expenses) => [...expenses, expense]);
  }

  function clearExpenses() {
    setExpenses([]);
  }

  return (
    <Container sx={{ height: '100dvh', py: 2 }}>
      <Stack height={'100%'}>
        <Stack direction={'row'} justifyContent={'center'} alignItems={'center'}>
          <Typography textAlign={'center'} variant='h6'>
            iExpense
          </Typography>
        </Stack>
        <Stack direction={'column'} flex={1} justifyContent={'space-around'}>
          {expenses.map((expense) => (
            <ExpenseSummary expense={expense} key={expense.id} />
          ))}
          <Stack direction={'row'} justifyContent={'center'}>
            <Button variant='contained' onClick={() => setDialogOpen(true)}>
              Add Expense
            </Button>
          </Stack>
        </Stack>
        <IconButton sx={{ alignSelf: 'flex-end' }} onClick={() => setSettingsOpen(true)}>
          <DeleteIcon />
        </IconButton>
      </Stack>
      <AddExpenseDialog open={dialogOpen} onClose={() => setDialogOpen(false)} updateExpense={onSave} />
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} clearExpenses={clearExpenses} />
    </Container>
  );
}

export default App;
