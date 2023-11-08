'use client'

import { Button } from "@/components/ui/Button"
import useAxiosPrivate from "@/hooks/use-axios-private"

const Page = () => {
  const axios = useAxiosPrivate();

  const refresh = async () => {
    const response = await axios.get('/auth/refresh-token');
    console.log(response.data);
  }

  return (
    <div className="pt-20">Page
      <Button onClick={() => refresh()}>Button</Button>
    </div>
  )
}

export default Page