import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import PaymentIcon from '@mui/icons-material/Payment';
import { Button, Checkbox, IconButton, Stack, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import React, { useCallback, useEffect, useState } from 'react';
import useSmallScreen from '../hooks/useSmallScreen';
import { ActiveTab } from '../utilities/constants';
import AddExpenseDialog from './AddExpenseDialog';
import PaymentActions from './PaymentAction';

type Props = {
  expense: ExpenseSummary;
  updateExpense: (expense: ExpenseSummary) => void;
  deleteExpense: () => void;
  activeTab: ActiveTab;
  isChecked: boolean;
  setIsChecked: () => void;
};

export default function ExpenseSummary(props: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const isSmallScreen = useSmallScreen();
  const [checked, setChecked] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setShowDetails(!isSmallScreen);
  }, [isSmallScreen]);

  const updateChecked = useCallback(
    (checked: boolean, id: string) => {
      props.updateExpense({
        ...props.expense,
        summary: props.expense.summary.map((detail) => {
          if (detail.id === id) {
            return {
              ...detail,
              settled: checked,
            };
          }
          return detail;
        }),
      });
    },
    [props.updateExpense]
  );

  function archiveExpense() {
    props.updateExpense({ ...props.expense, isArchived: !props.expense.isArchived });
  }

  return (
    <>
      <Stack gap={1} my={2} data-testid='expense-table'>
        <TableContainer component={Paper} elevation={5} sx={{ borderWidth: 1, borderColor: theme.palette.primary.main, borderStyle: checked ? 'solid' : 'none' }}>
          <Table aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell align='center' colSpan={5}>
                  <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ position: 'relative' }}>
                    <Checkbox
                      value={props.isChecked}
                      onChange={props.setIsChecked}
                    />
                    <Typography fontWeight={'bold'}>{props.expense.expenseName}</Typography>
                    <Stack direction={'row'} gap={1}>
                      <IconButton onClick={props.deleteExpense}>
                        <DeleteIcon color={'error'} />
                      </IconButton>
                      <IconButton onClick={archiveExpense}>
                        <ArchiveIcon color='success' />
                      </IconButton>
                      {props.activeTab === ActiveTab.Expenses && (
                        <IconButton onClick={() => setEditDialogOpen(true)}>
                          <EditIcon color='primary' />
                        </IconButton>
                      )}
                    </Stack>
                  </Stack>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography fontWeight={'bold'}>Name</Typography>
                </TableCell>
                {showDetails && (
                  <TableCell align='left'>
                    <Typography fontWeight={'bold'}>Paid</Typography>
                  </TableCell>
                )}
                <TableCell align='center' colSpan={showDetails ? 1 : 3}>
                  <Typography fontWeight={'bold'}>Actions</Typography>
                </TableCell>
                {showDetails && (
                  <TableCell align='left'>
                    <Typography fontWeight={'bold'}>Summary</Typography>
                  </TableCell>
                )}
                <TableCell align='right'>
                  <Typography fontWeight={'bold'}>Settled</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.expense.summary.map((item) => (
                <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell scope='row'>
                    <Stack direction={'row'} gap={1}>
                      {item.payments.length === 0 && item.receives.length === 0 ? (
                        <InsertEmoticonIcon color='secondary' />
                      ) : item.totalReceive > 0 ? (
                        <AccountBalanceIcon color='primary' />
                      ) : (
                        <PaymentIcon color='error' />
                      )}
                      <Typography sx={{ textTransform: 'capitalize' }}>{item.name}</Typography>
                    </Stack>
                  </TableCell>
                  {showDetails && (
                    <TableCell scope='row'>
                      <Typography sx={{ textTransform: 'capitalize' }}>${item.paid}</Typography>
                    </TableCell>
                  )}
                  <TableCell align='left' colSpan={showDetails ? 1 : 3}>
                    <PaymentActions settled={item.settled} payments={item.payments} receive={item.receives} />
                  </TableCell>
                  {showDetails && (
                    <TableCell align='left'>
                      <TotalAmount amount={item.totalReceive - item.totalPay} />
                    </TableCell>
                  )}
                  <TableCell align='right'>
                    <Checkbox
                      checked={item.settled}
                      onChange={(e) => {
                        updateChecked(e.target.checked, item.id);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={5}>
                  <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant='caption'>{new Date().toDateString()}</Typography>
                    <Stack direction={'row'}>
                      <Button onClick={() => setShowDetails((state) => !state)}>{showDetails ? 'Hide Details' : 'Show Details'}</Button>
                    </Stack>
                  </Stack>
                  <Stack direction={'row'} justifyContent={'space-between'}></Stack>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
      <AddExpenseDialog updateExpense={props.updateExpense} open={editDialogOpen} onClose={() => setEditDialogOpen(false)} defaultValues={props.expense} />
    </>
  );
}

const TotalAmount = ({ amount }: { amount: number }) => {
  const theme = useTheme();
  const isPay = amount > 0;

  if (amount === 0) {
    return <Typography color={theme.palette.primary.main}>{Math.abs(amount).toFixed(2)}</Typography>;
  }
  return (
    <Typography color={isPay ? theme.palette.success.main : theme.palette.error.main}>
      {amount > 0 ? '+' : '-'} {Math.abs(amount).toFixed(2)}
    </Typography>
  );
};
