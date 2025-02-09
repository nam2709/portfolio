'use client'

import SettingProvider from 'Helper/SettingContext/SettingProvider'
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useState } from 'react'
import ComingSoonComponent from 'Components/ComingSoon'

const ComingSoonPage = children => {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={children.dehydratedState}>
        <SettingProvider>
          <ComingSoonComponent />
        </SettingProvider>
      </Hydrate>
    </QueryClientProvider>
  )
}

export default ComingSoonPage
