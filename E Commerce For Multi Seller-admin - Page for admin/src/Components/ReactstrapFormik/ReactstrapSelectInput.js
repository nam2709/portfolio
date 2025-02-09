import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { useTranslation } from "@/app/i18n/client";
import Image from "next/image";
import { FormFeedback, Input, Label } from "reactstrap";
import useOutsideDropdown from "../../Utils/Hooks/CustomHooks/useOutsideDropdown";
import I18NextContext from "@/Helper/I18NextContext";
import { useParams, useRouter } from 'next/navigation';
import { fetchAuthSession } from "aws-amplify/auth";
import { ToastNotification } from '@/Utils/CustomFunctions/ToastNotification';

const ReactstrapSelectInput = ({ field, form: { touched, errors, setFieldValue }, getValuesKey = "id", setvalue, ...props }) => {
  const { i18Lang } = useContext(I18NextContext);
    const { t } = useTranslation(i18Lang, 'common');
  const [searchInput, setSearchInput] = useState();
  const [selectedItems, setSelectedItems] = useState();
  const [list, setList] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  console.log('filteredCategories', filteredCategories)
  const [categoriesList, setCategoriesList] = useState([]);
  const { ref, isComponentVisible, setIsComponentVisible } = useOutsideDropdown();
  let error = errors[field.name];
  let touch = touched[field.name];
  const params = useParams()
  console.log('field', field)
  console.log('params', params)
  console.log('selectedItems', selectedItems)

  const fetchAndFilterCategories = async () => {
    console.log('params?.updateId:', params?.updateId);
    try {
      const session = await fetchAuthSession();
      const token = session?.tokens?.idToken?.toString();

      if (token) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${params?.updateId}/categories`, {
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const categories = await response.json();
        console.log('categories.categories', categories.categories.Items)
        const categoryItemsPromises = categories.categories.Items.map(async category => {
          const categoryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/${category?.categoryId}`);
          const categoryData = await categoryResponse.json();
          console.log('categoryData', categoryData)
          return categoryData[0];  // Assuming the API returns an object with a 'name' property
        });

        const categoryItems = await Promise.all(categoryItemsPromises);
        console.log('categoryItems',categoryItems)
        setFilteredCategories(categoryItems);
      }
    } catch (error) {
      console.error('Failed to fetch category:', error);
    }
  };

  useEffect(() => {
    fetchAndFilterCategories();
  }, [params?.updateId]);

  useEffect(() => {
    if (props?.inputprops?.options[0]?.categoryId) {
      setCategoriesList(props?.inputprops?.options)
    } 
  }, [props?.inputprops?.options[0]?.categoryId]);

  useEffect(() => {
    async function fetchData() {
      if (selectedItems?.categoryId && params?.updateId) {
        const token = await fetchAuthSession()
          .then(session => session?.tokens?.idToken?.toString())
          .catch(() => null);

        if (token) {
          const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${selectedItems.categoryId}/products/${params?.updateId}`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          const data = await result.json();
          ToastNotification("success", t("Thêm sản phẩm vào danh mục thành công"))
        }
      }
    }

    fetchData();
  }, [selectedItems, params]);
  // On initial mount setting options data
  useEffect(() => {
    setList(props.inputprops.options)
  }, [])

  useEffect(() => {
    setList(props.inputprops.options)
    if (searchInput) {
      if (props.inputprops?.setsearch) {
        props.inputprops?.setsearch(searchInput)
      } else {
        setList(
          props.inputprops.options.filter(item =>
            item.name.toLowerCase().includes(searchInput?.toLowerCase())
          )
        )
      }
    } else {
      props.inputprops?.setsearch && props.inputprops?.setsearch(searchInput)
    }
  }, [searchInput])
  // Memorized the value and update on option changes
  const listOpt = useMemo(() => {
    return props?.inputprops?.options
  }, [props?.inputprops?.options])
  useEffect(() => {
    setSearchInput()
    setList(props.inputprops.options)
  }, [isComponentVisible])
  // Selecting Values from dropdown
  const onSelectValue = option => {
    if (Array.isArray(field?.value)) {
      const temp = [...selectedItems]
      const index = temp.findIndex(elem => elem[getValuesKey] == option[getValuesKey])
      if (index !== -1) {
        temp.splice(index, 1)
      } else {
        temp.push(option)
      }
      setSelectedItems(temp)
      setFieldValue(
        field?.name,
        temp.map(elem => elem[getValuesKey])
      )
    } else {
      setIsComponentVisible(false)
      const valueToSet = props.store === 'obj' ? option : option.id
      const { inputprops, index, title } = props
      setSelectedItems(option)
      setvalue
        ? setvalue(inputprops.name, valueToSet, index, title)
        : setFieldValue(inputprops.name, valueToSet, index)
    }
  }
  useEffect(() => {
    // Setting variables for type Array datas
    if (props.inputprops?.setsearch) {
      Array.isArray(field?.value) &&
        setSelectedItems &&
        setSelectedItems(listOpt?.filter(elem => field?.value?.includes(elem[getValuesKey])))
    } else {
      Array.isArray(field?.value) &&
        setSelectedItems &&
        setSelectedItems(list?.filter(elem => field?.value?.includes(elem[getValuesKey])))
    }
    // Setting variables for type String datas
    if (props.inputprops?.setsearch) {
      !Array.isArray(field?.value) &&
        setSelectedItems &&
        setSelectedItems(listOpt?.find(elem => field?.value == elem[getValuesKey]))
    } else {
      !Array.isArray(field?.value) &&
        setSelectedItems &&
        setSelectedItems(list?.find(elem => field?.value == elem[getValuesKey]))
    }
  }, [])

  const RemoveSelectedItem = (id, item) => {
    if (props?.inputprops?.close) {
      setSelectedItems('')
      setFieldValue(field.name, '')
    } else {
      let temp = field.value
      if (temp.length > 0) {
        temp?.splice(temp.indexOf(id), 1)
        setFieldValue(field.name, temp)
      }
    }
  }

  const onRemove = async (index) => {
    console.log('index', index)
    const token = await fetchAuthSession()
      .then(session => session?.tokens?.idToken?.toString())
      .catch(() => null);

    if (token) {
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${index.categoryId}/products/${params?.updateId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await result.json();
      console.log('data', data)
      await fetchAndFilterCategories();
      ToastNotification("success", t("Xóa sản phẩm khỏi danh mục thành công"))
    }
  }

  const SquareWithRoundTag = ({ tags = [], onRemove }) => {
    const squareStyle = {
      width: '100%',
      backgroundColor: '#f0f0f0',
      display: 'flex',
      flexWrap: 'wrap', // Enables tag wrapping
      alignItems: 'flex-start', // Aligns tags to the top
      justifyContent: 'flex-start', // Aligns tags from left to right
      padding: '10px'  // Padding for visual spacing
    };
  
    const tagStyle = {
      backgroundColor: '#0da486',
      color: 'white',
      padding: '5px 10px',  // Horizontal padding for text fitting and vertical padding fixed
      borderRadius: '25px',  // Rounded sides
      margin: '5px',  // Margin for spacing between tags
      fontSize: '14px',  // Font size can be adjusted based on your design
      height: '30px',  // Fixed height to ensure uniform tag size
      whiteSpace: 'nowrap',  // Ensures text stays on one line
      display: 'flex',
      alignItems: 'center',
    };
  
    const closeButtonStyle = {
      marginLeft: '10px',
      cursor: 'pointer',
      fontWeight: 'bold'
    };

    return (
      <div style={squareStyle}>
        {tags.map((tag, index) => (
          <div key={index} style={tagStyle}>
            {t(tag?.name)}
            <span
              style={closeButtonStyle}
              onClick={() => onRemove(tag)}>✕</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {props.label && (
        <Label htmlFor={props.inputprops.id} className={'label-color'}>
          {props.label}
        </Label>
      )}
      <div
        className={`custom-select-box ${props.formfloat == 'true' && 'form-floating'}`}
        ref={ref}
      >
        {Array.isArray(selectedItems) ? (
          <div
            className={`category-select-box`}
            onClick={() => setIsComponentVisible(p => p !== field?.name && field?.name)}
          >
            <div className={`bootstrap-tagsinput form-select`}>
              {selectedItems.length > 0 ? (
                selectedItems?.map((item, i) => (
                  <span className="tag label label-info" key={i}>
                    {item?.name}
                    <a className="ms-2 text-white">
                      <RiCloseLine
                        onClick={e => {
                          e.stopPropagation()
                          RemoveSelectedItem(item[getValuesKey], item)
                          setSelectedItems(p =>
                            p.filter(elem => elem[getValuesKey] !== item[getValuesKey])
                          )
                          setFieldValue(
                            field.name,
                            field?.value?.filter(elem => elem[getValuesKey] !== item[getValuesKey])
                          )
                        }}
                      />
                    </a>
                  </span>
                ))
              ) : (
                <span>{t('Select')}</span>
              )}
            </div>
          </div>
        ) : (
          <Input type="text" className="form-control form-select cursor position-absolute"
            value={t(setvalue !== undefined ? (props?.inputprops?.value || selectedItems?.name) : props?.inputprops?.options?.find((item) => item.id === field.value)?.name) || t("Select")}
            onClick={() => setIsComponentVisible(true)} readOnly invalid={Boolean(touched[field.name] && errors[field.name])}
          />
        )}
        {!Array.isArray(selectedItems) && (
          <Input
            id={props.inputprops.id}
            {...field}
            {...props}
            placeholder="Search"
            className="form-control form-select"
            type="text"
            invalid={Boolean(touched[field.name] && errors[field.name])}
            disabled
          />
        )}
        <p className="help-text">{props?.inputprops?.helpertext}</p>
        <div className={`box-content ${isComponentVisible ? 'open' : ''}`}>
          <Input
            type="text"
            className="form-control"
            value={searchInput || ''}
            onChange={e => setSearchInput(e.target.value)}
          />
          <ul className="intl-tel-input">
            {(props.inputprops?.setsearch ? listOpt : list)?.map((option, index) => (
              <Fragment key={index}>
                {option?.data ? (
                  <li
                    onClick={() => {
                      setIsComponentVisible(false)
                      setvalue
                        ? setvalue(
                            props.inputprops.name,
                            props.store === 'obj' ? option : option.id,
                            props.index,
                            props?.title
                          )
                        : setFieldValue(
                            props.inputprops.name,
                            props.store === 'obj' ? option : option.id,
                            props.index
                          )
                    }}
                  >
                    <div className="country">
                      <div className="flag-box">
                        <div className={`iti-flag ${option?.data?.class}`}></div>
                      </div>
                      <span className="dial-code">{option?.data?.code}</span>
                    </div>
                  </li>
                ) : (
                  <li onClick={() => onSelectValue(option)}>
                    {option?.image && (
                      <Image
                        src={option?.image}
                        className="img-fluid category-image"
                        alt={option?.name}
                        height={50}
                        width={50}
                      />
                    )}
                    <p
                      className={`cursor ${(selectedItems?.[index]?.[getValuesKey] || selectedItems?.[getValuesKey]) == option[getValuesKey] ? 'selected' : ''}`}
                    >
                      {t(option.name)}
                    </p>
                  </li>
                )}
              </Fragment>
            ))}
          </ul>
          {props.inputprops?.setsearch
            ? listOpt?.length <= 0 && 'No Data'
            : list?.length <= 0 && 'No Data'}
        </div>
        {touch && error && <FormFeedback>{t(props.title) || t(props?.floatlabel)} {t("IsRequired")}</FormFeedback>}
        {props?.inputprops?.close && <div className="close-icon"><RiCloseLine onClick={() => RemoveSelectedItem()} /></div>}
       { props?.floatlabel&&<Label>{t(props?.floatlabel)}</Label>}
      </div>
      <div>
      {
        field.name === "categories" ? (
          filteredCategories.length > 0 ? (
            <SquareWithRoundTag tags={filteredCategories} onRemove={onRemove} name={field.name} />
          ) : (
            <SquareWithRoundTag tags={[]} />
          )
        ) : (
          <></>
        )
      }
      </div>
    </>
  )
}
export default ReactstrapSelectInput
