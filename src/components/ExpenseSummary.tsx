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
import React, { useCallback, useState } from 'react';
import PaymentAction from './PaymentAction';
import AddExpenseDialog from './AddExpenseDialog';

type Props = {
  expense: ExpenseSummary;
  setExpenses: React.Dispatch<React.SetStateAction<ExpenseSummary[]>>;
};

export default function ExpenseSummary(props: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const onEdit = useCallback(
    function onEdit(id: string) {
      return (expense: ExpenseSummary) => {
        props.setExpenses((expenses) =>
          expenses.map((exp) => {
            if (exp.id === id) {
              return expense;
            }
            return exp;
          })
        );
      };
    },
    [props.setExpenses]
  );

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
                <TableCell>Name</TableCell>
                {showDetails && <TableCell align='left'>Paid</TableCell>}
                <TableCell align='left' colSpan={showDetails ? 1 : 3}>
                  Actions
                </TableCell>
                {showDetails && <TableCell align='right'>Summary</TableCell>}
                <TableCell align='right'>Settled</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.expense.summary.map((item) => (
                <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: item.settled ? '#4caf50' : undefined }}>
                  <TableCell scope='row'>
                    <Stack direction={'row'} gap={1}>
                      {item.paid > 0 ? <AccountBalanceIcon color='primary' /> : <PaymentIcon color='error' />}
                      <Typography sx={{ textTransform: 'capitalize' }}>{item.name}</Typography>
                    </Stack>
                  </TableCell>
                  {showDetails && (
                    <TableCell scope='row'>
                      <Typography sx={{ textTransform: 'capitalize' }}>${item.paid}</Typography>
                    </TableCell>
                  )}
                  <TableCell align='left' colSpan={showDetails ? 1 : 3}>
                    <PaymentAction transaction={item.payActions} type='pay' />
                    <PaymentAction transaction={item.receiveActions} type='receive' />
                  </TableCell>
                  {showDetails && (
                    <TableCell align='right'>
                      <TotalAmount amount={item.getTotalToReceive() - item.getTotalToPay()} />
                    </TableCell>
                  )}
                  <TableCell align='right'>
                    <Checkbox />
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
      <AddExpenseDialog updateExpense={onEdit(props.expense.id)} open={editDialogOpen} onClose={() => setEditDialogOpen(false)} />

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
