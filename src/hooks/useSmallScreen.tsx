import { useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';

export default function useSmallScreen() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return isSmallScreen;
}
