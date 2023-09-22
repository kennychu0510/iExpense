import React, { useState } from 'react';
import { Checkbox, Stack, Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { pink } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import PaymentAction from './PaymentAction';
import { Typography } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';

type Props = {
  expense: ExpenseSummary;
};

export default function ExpenseSummary(props: Props) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <TableContainer component={Paper}>
      <Table aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell align='center' colSpan={5}>
              {props.expense.expenseName}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Name</TableCell>
            {showDetails && <TableCell align='left'>Paid</TableCell>}
            <TableCell align='left'>Actions</TableCell>
            {showDetails && <TableCell align='right'>Summary</TableCell>}
            <TableCell align='right'>Settled</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.expense.summary.map((item) => (
            <TableRow key={item.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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
              <TableCell align='left'>
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
            <TableCell colSpan={5} align='right'>
              <Button onClick={() => setShowDetails((state) => !state)}>{showDetails ? 'Hide Details' : 'Show Details'}</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const TotalAmount = ({ amount }: { amount: number }) => {
  const theme = useTheme();
  const isPay = amount > 0;
  return (
    <Typography color={isPay ? theme.palette.success.main : theme.palette.error.main}>
      {amount > 0 ? '+' : '-'} {Math.abs(amount)}
    </Typography>
  );
};
