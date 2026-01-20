'use client'

import React, { useState } from 'react'
import Presentation from './presentation/page';

type User = 'ADMIN' | 'USER' | ''

export default function page() {

  const [user] = useState<User>('');

  const Show = () => {
    switch (user) {
      case '':
        return <Presentation />
      case 'ADMIN':
        return <div></div>
      case 'USER':
        return <div></div>
    }
  }
  return (
    <div>
      <Show />
    </div>
  )
}



