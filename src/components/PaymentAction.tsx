import { Stack, Box, Typography, useTheme } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
type Props = {
  type: 'pay' | 'receive';
  transaction: Map<string, Transaction>;
  settled: boolean;
};

export default function PaymentAction(props: Props) {
  const theme = useTheme();
  const actions = Array.from(props.transaction, ([name, transaction]) => ({
    name,
    amount: transaction.amount,
  }));
  if (props.type === 'pay') {
    return (
      <Box>
        {actions.map((item, idx) => (
          <Stack direction={'row'} alignItems={'center'} key={idx} gap={1} color={props.settled ? theme.palette.success.main : theme.palette.error.main}>
            <Typography>${item.amount}</Typography>
            <ArrowForwardIcon />
            <Typography>{item.name}</Typography>
          </Stack>
        ))}
      </Box>
    );
  }
  return (
    <Box>
      {actions.map((item, idx) => (
        <Stack direction={'row'} alignItems={'center'} key={idx} gap={1} color={props.settled ? theme.palette.success.main : theme.palette.primary.main}>
          <Typography>${item.amount}</Typography>
          <ArrowBackIcon />
          <Typography>{item.name}</Typography>
        </Stack>
      ))}
    </Box>
  );
}
