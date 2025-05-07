import React, { ReactNode } from 'react';
import useFirefoxFix from '@/utils/useFirefoxFix';

interface FirefoxFixProviderProps {
  children: ReactNode;
}

export default function FirefoxFixProvider({ children }: FirefoxFixProviderProps) {
  useFirefoxFix();
  return <>{children}</>;
}