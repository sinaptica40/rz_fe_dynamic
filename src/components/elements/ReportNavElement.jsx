import React from 'react'
import {useNavigate} from 'react-router-dom'
const ReportNavElement = ({ areas,page, setPage }) => {
  const navigate = useNavigate();
  const handleSetPage = (index) =>{
    console.log(areas,'check this areas data ');
    navigate(`/${11}`)
    setPage(parseInt(index))
    sessionStorage.setItem('navlink', index)
    sessionStorage.removeItem('subIndex')
    sessionStorage.removeItem('sezione')
    sessionStorage.removeItem('inspectId')
     sessionStorage.removeItem('menuindex')
  }
  console.log(areas.element_data[0].element_type.data,'check this areas data ');
  return (
    <>
      <div>
      
      </div>
    {areas?.element_data[0]?.element_type.data?.map((item, index) =>(
        <ul key={index} className="sideNav_menu topNavMenu">
        <li className="dash_nav_item" onClick={() => handleSetPage(index)}>
      <a href="javascript:void(0);" className={`${parseInt(index) === parseInt(page) && "active"}`}>
        <span className="icon_sideHolder">
          <svg width="12" height="3" viewBox="0 0 12 3" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 1.5H10.738" stroke="#ECAD42" stroke-width="2" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="title_dash_nav">
          {/* Scopo e campo d'applicazione */}
          {item?.menu_item_name}
        </span>
      </a>
    </li>
    </ul>
      )) 
}
</>
  )
}

export default ReportNavElement