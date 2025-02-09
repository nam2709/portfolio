import React, { useContext, useState, useEffect } from 'react'
import Image from 'next/image'
import AccountContext from '@/Helper/AccountContext'
import coverImage from '../../../../public/assets/images/inner-page/cover-img.jpg'
import Avatar from '@/Components/Common/Avatar'

const SidebarProfile = () => {
  const { accountData, profile } = useContext(AccountContext)
  const [profileImage, setprofileImage] = useState({
    original_url: profile,
  })

  useEffect(() => {
    if (profile) {  // Assuming `profile` holds the new URL or an object with `original_url`
      setprofileImage({
        original_url: profile,  // Here assuming profile is just the URL string
      });
    }
  }, [profile]);

  return (
    <>
      <div className="profile-box">
        <div className="cover-image">
          <Image
            src={coverImage}
            className="img-fluid"
            alt="cover-image"
            height={150}
            width={378}
          />
        </div>

        <div className="profile-contain">
          <div className="profile-image">
            <div className="position-relative">
              <div className="user-round">
                <Avatar
                  data={profileImage}
                  alt="profile-image"
                  height={108}
                  width={108}
                />
              </div>
            </div>
          </div>

          <div className="profile-name">
            <h3>{accountData?.name}</h3>
            <h6 className="text-content">{accountData?.email}</h6>
          </div>
        </div>
      </div>
    </>
  )
}

export default SidebarProfile
