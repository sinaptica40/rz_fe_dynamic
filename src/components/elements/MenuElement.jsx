import React from "react";
import { useNavigate } from 'react-router-dom';

const MenuElement = ({ data }) => {
    const navigate = useNavigate();
    return (
        <>
            <button className="navbar-toggler menuClose-icon" type="button">
                <svg
                    width={14}
                    height={14}
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"
                        fill="black"
                    />
                </svg>
            </button>
            <ul className="navbar-nav ms-auto">
                {data.data.map((item) => {
                    return (
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => navigate(`/${item.id_page}`)}>
                                <span className="header_menuIcon">
                                    <svg
                                        width={36}
                                        height={36}
                                        viewBox="0 0 36 36"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M6.188 0H25.312C26.9532 0 28.5271 0.651948 29.6876 1.81242C30.8481 2.9729 31.5 4.54684 31.5 6.188V14.85C30.7808 14.4822 30.0272 14.1861 29.25 13.966V6.188C29.25 5.14358 28.8351 4.14193 28.0966 3.40341C27.3581 2.6649 26.3564 2.25 25.312 2.25H6.187C5.14284 2.25 4.14145 2.66479 3.40312 3.40312C2.66479 4.14145 2.25 5.14284 2.25 6.187V25.312C2.25027 26.3563 2.66525 27.3578 3.40371 28.0963C4.14217 28.8348 5.14366 29.2497 6.188 29.25H13.966C14.1853 30.0275 14.4814 30.7812 14.85 31.5H6.188C4.54684 31.5 2.9729 30.8481 1.81242 29.6876C0.651948 28.5271 0 26.9532 0 25.312V6.187C0.000265188 4.54601 0.65233 2.97233 1.81278 1.81207C2.97322 0.651811 4.54701 -2.14276e-08 6.188 0ZM14.625 15.75H18.758C17.851 16.388 17.0338 17.1447 16.328 18H14.628C14.3296 18 14.0435 17.8815 13.8325 17.6705C13.6215 17.4595 13.503 17.1734 13.503 16.875C13.503 16.5766 13.6215 16.2905 13.8325 16.0795C14.0435 15.8685 14.3296 15.75 14.628 15.75H14.625ZM8.438 11.25C8.7719 11.25 9.09829 11.151 9.37591 10.9655C9.65352 10.7799 9.86987 10.5162 9.9976 10.2077C10.1253 9.89924 10.1587 9.55979 10.0935 9.23232C10.0283 8.90485 9.86741 8.60408 9.63124 8.36805C9.39507 8.13202 9.0942 7.97133 8.7667 7.90631C8.43919 7.84129 8.09976 7.87487 7.79134 8.00278C7.48291 8.13069 7.21935 8.3472 7.03399 8.62493C6.84863 8.90265 6.7498 9.2291 6.75 9.563C6.75 9.78462 6.79367 10.0041 6.87851 10.2088C6.96335 10.4136 7.08771 10.5996 7.24446 10.7562C7.40122 10.9129 7.58731 11.0372 7.79211 11.1219C7.9969 11.2066 8.21638 11.2501 8.438 11.25ZM10.126 16.313C10.1262 16.6469 10.0273 16.9734 9.84194 17.2512C9.65653 17.5289 9.39291 17.7454 9.08443 17.8733C8.77595 18.0012 8.43647 18.0347 8.10893 17.9696C7.7814 17.9045 7.48054 17.7437 7.2444 17.5076C7.00827 17.2715 6.84749 16.9706 6.78239 16.6431C6.71729 16.3155 6.7508 15.9761 6.87868 15.6676C7.00657 15.3591 7.22308 15.0955 7.50082 14.9101C7.77856 14.7247 8.10506 14.6258 8.439 14.626C8.66062 14.626 8.88008 14.6697 9.08482 14.7545C9.28956 14.8394 9.47558 14.9637 9.63224 15.1205C9.78891 15.2772 9.91315 15.4633 9.99787 15.6681C10.0826 15.8729 10.1261 16.0924 10.126 16.314V16.313ZM10.126 23.063C10.1262 23.3969 10.0273 23.7234 9.84194 24.0012C9.65653 24.2789 9.39291 24.4954 9.08443 24.6233C8.77595 24.7512 8.43647 24.7847 8.10893 24.7196C7.7814 24.6545 7.48054 24.4937 7.2444 24.2576C7.00827 24.0215 6.84749 23.7206 6.78239 23.3931C6.71729 23.0655 6.7508 22.7261 6.87868 22.4176C7.00657 22.1091 7.22308 21.8455 7.50082 21.6601C7.77856 21.4747 8.10506 21.3758 8.439 21.376C8.66062 21.376 8.88008 21.4197 9.08482 21.5045C9.28956 21.5894 9.47558 21.7137 9.63224 21.8705C9.78891 22.0272 9.91315 22.2133 9.99787 22.4181C10.0826 22.6229 10.1261 22.8424 10.126 23.064V23.063ZM13.5 10.125C13.5 9.82663 13.6185 9.54048 13.8295 9.3295C14.0405 9.11853 14.3266 9 14.625 9H23.625C23.9234 9 24.2095 9.11853 24.4205 9.3295C24.6315 9.54048 24.75 9.82663 24.75 10.125C24.75 10.4234 24.6315 10.7095 24.4205 10.9205C24.2095 11.1315 23.9234 11.25 23.625 11.25H14.625C14.3266 11.25 14.0405 11.1315 13.8295 10.9205C13.6185 10.7095 13.5 10.4234 13.5 10.125Z"
                                            fill="currentcolor"
                                        />
                                        <path
                                            d="M25.8659 15.7334C23.8618 15.7336 21.9028 16.3281 20.2366 17.4416C18.5703 18.5552 17.2717 20.1378 16.5049 21.9894C15.7381 23.8409 15.5376 25.8783 15.9287 27.8439C16.3198 29.8094 17.285 31.6148 18.7021 33.0319C20.1193 34.4489 21.9248 35.4139 23.8904 35.8048C25.856 36.1957 27.8933 35.9949 29.7449 35.228C31.5964 34.461 33.1789 33.1622 34.2922 31.4959C35.4056 29.8295 35.9999 27.8705 35.9999 25.8664C35.9996 23.1789 34.9318 20.6015 33.0314 18.7012C31.1309 16.8009 28.5534 15.7334 25.8659 15.7334ZM26.7869 29.5514C26.7869 29.7957 26.6899 30.0299 26.5171 30.2026C26.3444 30.3754 26.1102 30.4724 25.8659 30.4724C25.6216 30.4724 25.3874 30.3754 25.2146 30.2026C25.0419 30.0299 24.9449 29.7957 24.9449 29.5514V26.7884H22.1819C21.9376 26.7884 21.7034 26.6914 21.5306 26.5186C21.3579 26.3459 21.2609 26.1117 21.2609 25.8674C21.2609 25.6231 21.3579 25.3889 21.5306 25.2162C21.7034 25.0434 21.9376 24.9464 22.1819 24.9464H24.9459V22.1824C24.9459 21.9381 25.0429 21.7039 25.2156 21.5312C25.3884 21.3584 25.6226 21.2614 25.8669 21.2614C26.1112 21.2614 26.3454 21.3584 26.5181 21.5312C26.6909 21.7039 26.7879 21.9381 26.7879 22.1824V24.9464H29.5519C29.7962 24.9464 30.0304 25.0434 30.2031 25.2162C30.3759 25.3889 30.4729 25.6231 30.4729 25.8674C30.4729 26.1117 30.3759 26.3459 30.2031 26.5186C30.0304 26.6914 29.7962 26.7884 29.5519 26.7884H26.7879L26.7869 29.5514Z"
                                            fill="currentcolor"
                                        />
                                    </svg>
                                </span>
                                {item.menu_item_name}
                            </a>
                        </li>
                    )
                })}
            </ul>
        </>
    )
};

export default MenuElement;
