import { Stack, Box, Typography, useTheme } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type Props = {
  payments: IAction[]
  receive: IAction[]
  settled: boolean;
};

export default function PaymentActions(props: Props) {
  const theme = useTheme();

  if (props.receive.length === 0 && props.payments.length === 0) {
    return  <Typography>{'N/A'}</Typography>
  }
  return (
    <Box>
      {props.payments.map((item, idx) => (
        <Stack direction={'row'} alignItems={'center'} key={idx} gap={1} color={props.settled ? theme.palette.success.main : theme.palette.error.main}>
          <Typography>${item.amount}</Typography>
          <ArrowForwardIcon />
          <Typography>{item.name}</Typography>
        </Stack>
      ))}
      {props.receive.map((item, idx) => (
        <Stack direction={'row'} alignItems={'center'} key={idx} gap={1} color={props.settled ? theme.palette.success.main : theme.palette.primary.main}>
          <Typography>${item.amount}</Typography>
          <ArrowBackIcon />
          <Typography>{item.name}</Typography>
        </Stack>
      ))}
    </Box>
  );
}
