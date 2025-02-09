import { useEffect, useState } from 'react'
import { RiTimeLine } from 'react-icons/ri'
import Loader from '@/Layout/Loader'
import request from '@/Utils/AxiosUtils'
import { NotificationAPI } from '@/Utils/AxiosUtils/API'
import { dateFormate } from '@/Utils/CustomFunctions/DateFormate'
import { useQuery } from '@tanstack/react-query'
import AccountHeading from '@/Components/Common/AccountHeading'

const NotificationData = () => {
  const [isRead, setIsRead] = useState('')
  const { data, isLoading } = useQuery(
    [NotificationAPI],
    () => request({ url: NotificationAPI }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      select: res => res?.data?.data,
    }
  )

  useEffect(() => {
    return () => {
      setIsRead('read')
    }
  }, [])
  if (isLoading) return <Loader />
  return (
    <>
      <AccountHeading title="Notifications" />
      <ul className="notification-list">
        {data?.map((elem, i) => (
          <li
            className={!elem?.read_at && isRead !== 'read' ? 'unread' : ''}
            key={i}
          >
            <h4>{elem?.data?.message}</h4>
            <h5>
              <RiTimeLine /> {dateFormate(elem?.created_at)}
            </h5>
          </li>
        ))}
      </ul>
    </>
  )
}

export default NotificationData
