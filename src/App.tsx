import { useState } from 'react';

import AddExpenseDialog from './components/AddExpenseDialog/AddExpenseDialog';
import { Stack, Typography, Container, Button, Box } from '@mui/material';
import { Person } from './utilities/entity';



function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseSummary[]>([])

  function onSave(expense: ExpenseSummary) {
    setExpenses(expenses => [...expenses, expense])
  }
  return (
    <Container sx={{ height: '100dvh', py: 2 }}>
      <Stack height={'100%'}>
        <Typography textAlign={'center'} variant='h6'>
          iExpense
        </Typography>
        <Stack direction={'column'} flex={1} justifyContent={'center'}>
          <Stack direction={'row'} justifyContent={'center'}>
            <Button variant='contained' onClick={() => setDialogOpen(true)}>Add Expense</Button>
          </Stack>
        </Stack>
      </Stack>
      <AddExpenseDialog open={dialogOpen} onClose={() => setDialogOpen(false)} updateExpense={onSave}/>
    </Container>
  );
}

export default App;
