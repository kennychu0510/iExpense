import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';
import { Button, Checkbox, Stack, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import React, { useCallback, useEffect, useState } from 'react';
import PaymentAction from './PaymentAction';
import AddExpenseDialog from './AddExpenseDialog';
import useSmallScreen from '../hooks/useSmallScreen';

type Props = {
  expense: ExpenseSummary;
  updateExpense: (expense: ExpenseSummary) => void;
};

export default function ExpenseSummary(props: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const isSmallScreen = useSmallScreen();

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
  console.log(props.expense);

  return (
    <>
      <Stack gap={1}>
        <TableContainer component={Paper} elevation={5}>
          <Table aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell align='center' colSpan={5}>
                  <Typography fontWeight={'bold'}>{props.expense.expenseName}</Typography>
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
                <TableCell align='left' colSpan={showDetails ? 1 : 3}>
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
                      {item.totalReceive > 0 ? <AccountBalanceIcon color='primary' /> : <PaymentIcon color='error' />}
                      <Typography sx={{ textTransform: 'capitalize' }}>{item.name}</Typography>
                    </Stack>
                  </TableCell>
                  {showDetails && (
                    <TableCell scope='row'>
                      <Typography sx={{ textTransform: 'capitalize' }}>${item.paid}</Typography>
                    </TableCell>
                  )}
                  <TableCell align='left' colSpan={showDetails ? 1 : 3}>
                    <PaymentAction settled={item.settled} transaction={item.payActions} type='pay' />
                    <PaymentAction settled={item.settled} transaction={item.receiveActions} type='receive' />
                  </TableCell>
                  {showDetails && (
                    <TableCell align='left'>
                      <TotalAmount amount={item.totalReceive - item.totalPay}  />
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
                <TableCell colSpan={1} align='center' width={150}>
                  <Button onClick={() => setShowDetails((state) => !state)}>{showDetails ? 'Hide Details' : 'Show Details'}</Button>
                </TableCell>
                <TableCell colSpan={4} align='right'>
                  <Typography variant='caption'>{new Date().toDateString()}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction={'row'} justifyContent={'flex-end'}>
          <Button onClick={() => setEditDialogOpen(true)}>Edit</Button>
        </Stack>
      </Stack>
      <AddExpenseDialog updateExpense={props.updateExpense} open={editDialogOpen} onClose={() => setEditDialogOpen(false)} defaultValues={props.expense} />
    </>
  );
}

const TotalAmount = ({ amount }: { amount: number }) => {
  const theme = useTheme();
  const isPay = amount > 0;
  return (
    <Typography color={isPay ? theme.palette.success.main : theme.palette.error.main}>
      {amount > 0 ? '+' : '-'} {Math.abs(amount).toFixed(2)}
    </Typography>
  );
};
