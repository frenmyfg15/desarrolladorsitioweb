'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Presentation from './presentation/page';

export default function Page() {
  // const router = useRouter();
  // const { user, hydrate, isLoading } = useSessionStore();

  // useEffect(() => {
  //   hydrate();
  // }, [hydrate]);

  // // 🔁 redirect automático para SUPER_ADMIN
  // useEffect(() => {
  //   if (user?.rolGlobal === 'SUPER_ADMIN') {
  //     router.replace('/superadmin');
  //   }
  // }, [user, router]);

  // if (isLoading) {
  //   return <LoadingScreen logoSrc={logo} label="Cargando tu sesión…" />;
  // }

  // if (!user) {
  //   return <Presentation />;
  // }

  // switch (user.rolGlobal) {
  //   case 'ADMIN':
  //     return <AdminDashboard />;

  //   case 'USUARIO':
  //     return <UserDashboard />;
  //   default:
  return <Presentation />;
  // }
}
