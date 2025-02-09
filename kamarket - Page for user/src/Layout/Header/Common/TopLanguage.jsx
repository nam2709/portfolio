'use client'
import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap'
import { usePathname, useSearchParams } from 'next/navigation'
import { useTranslation } from '@/app/i18n/client'
import I18NextContext from '@/Helper/I18NextContext'
import English from '../../../../public/assets/images/country/English.png'
import VietNam from '../../../../public/assets/images/country/vietnam.png'
import China from '../../../../public/assets/images/country/China.png'
import SouthKorea from '../../../../public/assets/images/country/SouthKorea.png'

const TopLanguage = () => {
  const { i18Lang } = useContext(I18NextContext)
  const { t, i18n } = useTranslation(i18Lang, 'common')
  const pathname = usePathname()
  const search = useSearchParams()
  const searchparam = search.toString()
  const supportedLanguages = ['ko', 'vi', 'en', 'zh-CN'];
  const pathParts = pathname.split('/');

  if (supportedLanguages.includes(pathParts[1])) {
    pathParts.splice(1, 1); // Remove the first segment if it's a supported language
  }

  const updatedPath = pathParts.join('/') + (searchparam ? `?${searchparam}` : '');
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedLang, setSelectedLang] = useState({})
  const toggle = () => setDropdownOpen(prevState => !prevState)
  const language = [
    { id: 2, title: 'English', icon: 'en', iconlink: `en/${updatedPath}`,  image: English, isLang: '/en/' },
    { id: 3, title: '한국인', icon: 'ko', iconlink: `ko/${updatedPath}`, image: SouthKorea, isLang: '/ko/' },
    { id: 1, title: 'Tiếng Việt', icon: 'vi', iconlink: `vi/${updatedPath}`, image: VietNam, isLang: '/vi/' },
    { id: 4, title: '汉语', icon: 'zh-CN', iconlink: `zh-CN/${updatedPath}`, image: China, isLang: '/zh-CN/' },
  ]
  const isLangIncludes = language.find(lang => pathname.includes(lang.isLang))
  const splitPathname = isLangIncludes
    ? pathname.split(isLangIncludes.isLang)[1]
    : ''
  useEffect(() => {
    setSelectedLang(language.find(elem => elem.icon == i18Lang))
  }, [])

  // To change Language
  const handleChangeLang = value => {
    setSelectedLang(value)
    i18n.changeLanguage(value.icon)
  }
  return (
    <Dropdown
      className="theme-form-select"
      isOpen={dropdownOpen}
      toggle={toggle}
    >
      <DropdownToggle
        caret
        className="select-dropdown"
        type="button"
        id="select-language"
      >
        {selectedLang?.image && (
          <Image
            src={selectedLang?.image}
            className="img-fluid"
            alt="Language Name"
            height={20}
            width={20}
          />
        )}
        <span>{selectedLang?.title}</span>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-end">
        {language?.map((elem, i) => (
          <Link
            href={`/${elem.iconlink}`}
            onClick={() => handleChangeLang(elem)}
            key={i}
          >
            <DropdownItem id={elem.title}>
              <Image
                src={elem?.image}
                className="img-fluid"
                alt={elem.title}
                height={20}
                width={20}
                priority
              />
              <span>{elem.title}</span>
            </DropdownItem>
          </Link>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}

export default TopLanguage
