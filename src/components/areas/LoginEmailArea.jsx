// import React from "react";

// const LoginEmailArea = ({children}) => {
//     return (
//         <>
//             <div className="form-floating">
//                 {/* <input type="email" className="form-control" id="Email" placeholder="Email" />
//                 <label htmlFor="Email">Email</label> */}
//                 {children}
//             </div>
//         </>
//     )
// }

// export default LoginEmailArea;

import React from "react";

const LoginEmailArea = ({children}) => {
   
    return (
        <>
            <div className="form-floating">
                {/* <input type="email" className="form-control" id="Email" placeholder="Email" />
                <label htmlFor="Email">Email</label> */}
                {children}
            </div>
        </>
    )
}

export default LoginEmailArea;