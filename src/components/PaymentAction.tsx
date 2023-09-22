import { Stack, Box, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
type Props = {
  type: 'pay' | 'receive';
  transaction: Map<string, Transaction>;
};

export default function PaymentAction(props: Props) {
  const actions = Array.from(props.transaction, ([name, transaction]) => ({
    name,
    amount: transaction.amount,
  }));
  const action = props.type === 'pay' ? 'Pay' : 'Receive';
  if (props.type === 'pay') {
    return (
      <Box>
        {actions.map((item, idx) => (
          <Stack direction={'row'} alignItems={'center'} key={idx} gap={1}>
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
        <Stack direction={'row'} alignItems={'center'} key={idx} gap={1}>
          <Typography>${item.amount}</Typography>
          <ArrowBackIcon />
          <Typography>{item.name}</Typography>
        </Stack>
      ))}
    </Box>
  );
}
