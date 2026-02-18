'use client';

import type { ReactNode } from 'react';
import { NavBar } from '@/components/layout/nav-bar';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="min-h-screen pb-16">{children}</div>
      <NavBar />
    </>
  );
}
