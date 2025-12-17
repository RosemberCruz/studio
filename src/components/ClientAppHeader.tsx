
'use client';

import React, { useEffect, useState } from 'react';
import { AppHeader } from './AppHeader';

export function ClientAppHeader() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return <>{isClient && <AppHeader />}</>;
}
