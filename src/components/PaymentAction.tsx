import { Stack, Box, Typography, useTheme } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type Props = {
  payments: Map<string, Transaction>;
  receive: Map<string, Transaction>;
  settled: boolean;
};

export default function PaymentActions(props: Props) {
  const theme = useTheme();
  const paymentActions = Array.from(props.payments, ([name, transaction]) => ({
    name,
    amount: transaction.amount,
  }));
  const receiveActions = Array.from(props.receive, ([name, transaction]) => ({
    name,
    amount: transaction.amount,
  }));
  if (paymentActions.length === 0 && receiveActions.length === 0) {
    return  <Typography>{'N/A'}</Typography>
  }
  return (
    <Box>
      {paymentActions.map((item, idx) => (
        <Stack direction={'row'} alignItems={'center'} key={idx} gap={1} color={props.settled ? theme.palette.success.main : theme.palette.error.main}>
          <Typography>${item.amount}</Typography>
          <ArrowForwardIcon />
          <Typography>{item.name}</Typography>
        </Stack>
      ))}
      {receiveActions.map((item, idx) => (
        <Stack direction={'row'} alignItems={'center'} key={idx} gap={1} color={props.settled ? theme.palette.success.main : theme.palette.primary.main}>
          <Typography>${item.amount}</Typography>
          <ArrowBackIcon />
          <Typography>{item.name}</Typography>
        </Stack>
      ))}
    </Box>
  );
}
