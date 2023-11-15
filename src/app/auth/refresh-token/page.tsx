'use client';

import { Button } from '@/components/ui/Button'
import useAxiosPrivate from '@/hooks/use-axios-private'
import { useAuthStore } from '@/store/auth-store';
import React, { useState } from 'react'

const Page = () => {
  const axios = useAxiosPrivate()
  const zustandAccessToken = useAuthStore(state => state.token)
  const [accessToken, setAccessToken] = useState('')
  const refresh = async () => {
    const { data } = await axios.get('/auth/refresh-token')
    // eslint-disable-next-line no-console
    console.log(data);
    setAccessToken(data.access_token)

    return data;
  }

  return zustandAccessToken ? (
    <div className='pt-30 flex flex-col container'>
      <p>Prev access token: {zustandAccessToken}</p>
      <p>New access token: {accessToken}</p>      
      <Button onClick={() => refresh()}>
        Refresh Token
      </Button>
    </div>
  ) : null;
}

export default Page