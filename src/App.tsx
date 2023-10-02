import { useCallback, useMemo, useState } from 'react';
import AddExpenseDialog from './components/AddExpenseDialog';
import { Stack, Typography, Container, Button, IconButton, Tabs, Tab } from '@mui/material';
import ExpenseSummary from './components/ExpenseSummary';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsDialog from './components/SettingsDialog';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useLocalStorage } from '@uidotdev/usehooks';
import { ActiveTab } from './utilities/constants';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [expenses, setExpenses] = useLocalStorage<ExpenseSummary[]>('expenses', []);
  const [activeTab, setActiveTab] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  function onSave(expense: ExpenseSummary) {
    setExpenses((expenses) => [...expenses, expense]);
  }

  function clearExpenses() {
    setExpenses([]);
  }

  const getUpdateExpense = useCallback(
    (id: string) => {
      return (expense: ExpenseSummary) =>
        setExpenses((expenses) =>
          expenses.map((exp) => {
            if (exp.id === id) {
              return expense;
            }
            return exp;
          })
        );
    },
    [setExpenses]
  );

  function getDeleteExpense(id: string) {
    return () => {
      setExpenses((expenses) => expenses.filter((expense) => expense.id !== id));
    };
  }

  const onChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  function onMerge() {
    const mergedItems = expenses.filter(items => checkedItems.has(items.id))
    console.log(mergedItems)
  }

  const expensesForDisplay = useMemo(() => {
    return expenses.filter((expense) => expense.isArchived === Boolean(activeTab));
  }, [activeTab, expenses]);

  function setIsChecked(id: string): () => void {
    return () => {
      setCheckedItems((items) => {
        const updatedItems = new Set(items);
        if (items.has(id)) {
          updatedItems.delete(id);
          return updatedItems;
        } else {
          return updatedItems.add(id);
        }
      });
    };
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Container sx={{ height: '100dvh', py: 2 }}>
        <Stack height={'100%'}>
          <Stack direction={'row'} justifyContent={'center'} alignItems={'center'}>
            <Typography textAlign={'center'} variant='h6' color={'white'}>
              iExpense
            </Typography>
          </Stack>
          <Tabs sx={{ my: 2 }} variant='fullWidth' indicatorColor='primary' value={activeTab} onChange={onChangeTab}>
            <Tab label='Expenses' id='Expenses' />
            <Tab label='Archive' />
          </Tabs>
          <Stack direction={'column'} flex={1} justifyContent={activeTab ? 'space-between' : 'space-around'}>
            {expensesForDisplay.map((expense) => (
              <ExpenseSummary
                isChecked={checkedItems.has(expense.id)}
                setIsChecked={setIsChecked(expense.id)}
                expense={expense}
                key={expense.id}
                updateExpense={getUpdateExpense(expense.id)}
                deleteExpense={getDeleteExpense(expense.id)}
                activeTab={activeTab}
              />
            ))}

            {activeTab === ActiveTab.Expenses && (
              <Stack direction={'column'} justifyContent={'center'} alignItems={'center'} gap={2} width={200} alignSelf={'center'}>
                {checkedItems.size > 1 && (
                  <Button variant='contained' onClick={onMerge} fullWidth color='secondary'>
                    Merge Expenses
                  </Button>
                )}
                <Button variant='contained' onClick={() => setDialogOpen(true)} data-testid='add-expense' fullWidth>
                  Add Expense
                </Button>
              </Stack>
            )}
          </Stack>
          <IconButton sx={{ alignSelf: 'flex-end', mb: 2 }} onClick={() => setSettingsOpen(true)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
        <AddExpenseDialog open={dialogOpen} onClose={() => setDialogOpen(false)} updateExpense={onSave} />
        <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} clearExpenses={clearExpenses} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
