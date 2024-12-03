import React from 'react'

const MachinerySearchElement =({areas,setSearchText,searchText}) =>{
  return (
    <>
     <button className="cardSearchIcon">
     <img src={areas?.element_data?.interaction_name} />
                        {/* <svg
                            width={24}
                            height={24}
                            viewBox="0 0 27 27"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M25.4781 25.034L19.8631 19.409M22.9741 11.89C22.9741 13.9944 22.3501 16.0515 21.1809 17.8013C20.0118 19.551 18.3501 20.9148 16.4058 21.7201C14.4616 22.5254 12.3223 22.7361 10.2583 22.3256C8.19438 21.915 6.29851 20.9016 4.81048 19.4136C3.32245 17.9256 2.30909 16.0297 1.89854 13.9658C1.48799 11.9018 1.6987 9.76245 2.50402 7.81825C3.30933 5.87404 4.67309 4.2123 6.42283 3.04316C8.17257 1.87403 10.2297 1.25 12.3341 1.25C15.156 1.25 17.8623 2.371 19.8577 4.36638C21.8531 6.36177 22.9741 9.0681 22.9741 11.89Z"
                                stroke="#252525"
                                strokeWidth={2}
                                strokeLinecap="round"
                            />
                        </svg> */}
                    </button>
                    <input
                        value={searchText}
                        type="text"
                        className="form-control"
                        placeholder="Cerca un Macchinario"
                        onChange={(e)=>setSearchText(e.target.value)}
                    />
    </>
  )
}

export default MachinerySearchElement