import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation,Navigate } from 'react-router-dom';
import PageBuilder from './PageBuilder';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState,useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

let pagesCache = null;

const fetchPages = async () => {
  if (!pagesCache) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/pages`);
      const data = await response.json();
      pagesCache = data.data.pages.reduce((acc, page) => {
        acc[page.page_name_label] = page.id_page;
        return acc;
      }, {});

    } catch (error) {
      pagesCache = {};
    }
  }
  return pagesCache;
};

const fetchData = async (route) => {
  const pages = await fetchPages();
  console.log("pages", pages);
  const pageId = pages[route] ?? route;

  console.log("==pageId===", pageId, typeof pageId)

  const url = pageId ? `${API_BASE_URL}/api/v1/page-data-retriever/${pageId}` : null;

  if (!url) {
    return {
      css_name: "dashboard",
      element_name: "",
      id_page: 1,
      is_subpage: true,
      layout_name: "NoRouteLayout",
      api: null,
      area_name: null,
      areas: {
        element_data: [
          {
            element_type: {
              data: []
            }
          }
        ]
      }
    };
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    // if (pageId == '99') {
    //   return {
    //     "layout_name": "MainLayout8",
    //     "result": [
    //       {
    //         "api": {
    //           "function_name": "/dashboard",
    //           "method_type": "REDIRECT"
    //         },
    //         "area_name": "HeaderArea1",
    //         "areas": {
    //           "element_data": {
    //             "color_code": null,
    //             "data": {
    //               "html_name": "http://rzinspectionpy.dev.obdemo.com:4065/static/images/logoRZ.png",
    //               "type": "img"
    //             },
    //             "html_name": "ImageElement",
    //             "image_icon": null,
    //             "type": "html"
    //           },
    //           "element_type": "html"
    //         },
    //         "css_name": "dashboard",
    //         "element_name": "ImageElement",
    //         "id_page": 99,
    //         "is_subpage": false,
    //         "layout_name": "MainLayout7"
    //       },
    //       {
    //         "api": null,
    //         "area_name": "HeaderArea2",
    //         "areas": {
    //           "element_data": [
    //             {
    //               "element_type": {
    //                 "color_code": null,
    //                 "data": [
    //                   {
    //                     "id_page": 4,
    //                     "image_icon": "http://rzinspectionpy.dev.obdemo.com:4065/static/images/aggiungi_machinario.png",
    //                     "menu_item_name": "Macchinario"
    //                   },
    //                   {
    //                     "id_page": 5,
    //                     "image_icon": "http://rzinspectionpy.dev.obdemo.com:4065/static/images/aggiungi_norma.png",
    //                     "menu_item_name": "Norma"
    //                   },
    //                   {
    //                     "id_page": 3,
    //                     "image_icon": "http://rzinspectionpy.dev.obdemo.com:4065/static/images/nuova_ispezione.png",
    //                     "menu_item_name": "Ispezione"
    //                   }
    //                 ],
    //                 "image_icon": null,
    //                 "menu_name": "nav_bar"
    //               },
    //               "zone": 1,
    //               "zone_name": "nav_menu"
    //             }
    //           ],
    //           "element_type": "container"
    //         },
    //         "css_name": "dashboard",
    //         "element_name": "MenuElement",
    //         "id_page": 99,
    //         "is_subpage": false,
    //         "layout_name": "MainLayout7"
    //       },
    //       {
    //         "api": null,
    //         "area_name": "HeaderArea3",
    //         "areas": {
    //           "element_data": {
    //             "interaction_name": "http://rzinspectionpy.dev.obdemo.com:4065/static/images/bell.png",
    //             "type": "Icon"
    //           },
    //           "element_type": "Interaction"
    //         },
    //         "css_name": "dashboard",
    //         "element_name": "NotifyElement",
    //         "id_page": 99,
    //         "is_subpage": false,
    //         "layout_name": "MainLayout7"
    //       },
    //       {
    //         "api": null,
    //         "area_name": "HeaderArea4",
    //         "areas": {
    //           "element_data": {
    //             "interaction_name": "user_image",
    //             "type": "Button"
    //           },
    //           "element_type": "Interaction"
    //         },
    //         "css_name": "dashboard",
    //         "element_name": "ProfileElement",
    //         "id_page": 99,
    //         "is_subpage": false,
    //         "layout_name": "MainLayout7"
    //       },
    //       {
    //         "api": null,
    //         "area_name": "FormArea7",
    //         "areas": {
    //           "element_data": {
    //             "color_code": null,
    //             "data": {
    //               "html_name": "http://rzinspectionpy.dev.obdemo.com:4065/static/images/pianifica.png",
    //               "type": "img"
    //             },
    //             "html_name": "CardImageElement",
    //             "image_icon": null,
    //             "type": "html"
    //           },
    //           "element_type": "html"
    //         },
    //         "css_name": "dashboard",
    //         "element_name": "CardImageElement",
    //         "id_page": 98,
    //         "is_subpage": false,
    //         "layout_name": "MainLayout7"
    //       },
    //       {
    //         "api": {
    //           "function_name": "/api/v1/inspections/rz-order?id_order=",
    //           "method_type": "GET"
    //         },
    //         "area_name": "FormArea8",
    //         "areas": {
    //           "element_data": {
    //             "color_code": null,
    //             "data": {
    //               "html_name": "Ispezione | Proteko S.p.A.",
    //               "type": "text"
    //             },
    //             "html_name": "TextElement",
    //             "image_icon": null,
    //             "type": "html"
    //           },
    //           "element_type": "html"
    //         },
    //         "css_name": "dashboard",
    //         "element_name": "TextElement",
    //         "id_page": 98,
    //         "is_subpage": false,
    //         "layout_name": "MainLayout7"
    //       },
    //       {
    //         "api": {
    //           "function_name": "/ispezioni",
    //           "method_type": "REDIRECT"
    //         },
    //         "area_name": "EditArea4",
    //         "areas": {
    //           "element_data": {
    //             "interaction_name": "http://rzinspectionpy.dev.obdemo.com:4065/static/images/close.png",
    //             "type": "Icon"
    //           },
    //           "element_type": "Interaction"
    //         },
    //         "css_name": "dashboard",
    //         "element_name": "EditElement4",
    //         "id_page": 99,
    //         "is_subpage": false,
    //         "layout_name": "MainLayout7"
    //       },
    //       {
    //         "api": null,
    //         "area_name": "EditArea5",
    //         "areas": {
    //           "element_data": {
    //             "block_name": "Descrizione",
    //             "id_block": 23,
    //             "type": "str"
    //           },
    //           "element_type": "block",
    //           "parent_page_id": 98
    //         },
    //         "css_name": "dashboard",
    //         "element_name": "InputTextElement5",
    //         "id_page": 98,
    //         "is_subpage": false,
    //         "layout_name": "MainLayout7"
    //       },
    //       {
    //         "api": null,
    //         "area_name": "EditArea6",
    //         "areas": {
    //           "element_data": {
    //             "block_name": "Cliente",
    //             "id_block": 24,
    //             "type": "str"
    //           },
    //           "element_type": "block",
    //           "parent_page_id": 98
    //         },
    //         "css_name": "dashboard",
    //         "element_name": "InputTextElement6",
    //         "id_page": 98,
    //         "is_subpage": false,
    //         "layout_name": "MainLayout7"
    //       },
    //       {
    //         "api": null,
    //         "area_name": "ViewArea1",
    //         "areas": {
    //           "element_data": {
    //             "block_name": "Select Date",
    //             "id_block": 23,
    //             "type": "str"
    //           },
    //           "element_type": "block",
    //           "parent_page_id": 98
    //         },
    //         "css_name": "dashboard",
    //         "element_name": "InputTextElement5",
    //         "id_page": 98,
    //         "is_subpage": false,
    //         "layout_name": "MainLayout7"
    //       },
    //       {
    //         "api": null,
    //         "area_name": "EditArea8",
    //         "areas": {
    //           "element_data": {
    //             "block_name": "Data Inizio Inspezione",
    //             "id_block": 41,
    //             "type": "calender"
    //           },
    //           "element_type": "block",
    //           "parent_page_id": 98
    //         },
    //         "css_name": "dashboard",
    //         "element_name": "InputTextElement8",
    //         "id_page": 98,
    //         "is_subpage": false,
    //         "layout_name": "MainLayout7"
    //       },
    //       {
    //         "api": null,
    //         "area_name": "ViewArea2",
    //         "areas": {
    //           "element_data": {
    //             "block_name": "Tipologia Macchinario",
    //             "id_block": 23,
    //             "type": "str"
    //           },
    //           "element_type": "block",
    //           "parent_page_id": 98
    //         },
    //         "css_name": "dashboard",
    //         "element_name": "InputTextElement5",
    //         "id_page": 98,
    //         "is_subpage": false,
    //         "layout_name": "MainLayout7"
    //       },
    //       {
    //         "api": null,
    //         "area_name": "ViewArea3",
    //         "areas": {
    //           "element_data": {
    //             "block_name": "Noma dell marchio *",
    //             "id_block": 23,
    //             "type": "str"
    //           },
    //           "element_type": "block",
    //           "parent_page_id": 98
    //         },
    //         "css_name": "dashboard",
    //         "element_name": "InputTextElement5",
    //         "id_page": 98,
    //         "is_subpage": false,
    //         "layout_name": "MainLayout7"
    //       },
    //       {
    //         "api": null,
    //         "area_name": "ViewArea4",
    //         "areas": {
    //           "element_data": {
    //             "block_name": "Macchinario*",
    //             "id_block": 23,
    //             "type": "str"
    //           },
    //           "element_type": "block",
    //           "parent_page_id": 98
    //         },
    //         "css_name": "dashboard",
    //         "element_name": "InputTextElement5",
    //         "id_page": 98,
    //         "is_subpage": false,
    //         "layout_name": "MainLayout7"
    //       },
    //       {
    //         "api": null,
    //         "area_name": "ViewArea5",
    //         "areas": {
    //           "element_data": {
    //             "block_name": "Anno costruzione",
    //             "id_block": 23,
    //             "type": "str"
    //           },
    //           "element_type": "block",
    //           "parent_page_id": 98
    //         },
    //         "css_name": "dashboard",
    //         "element_name": "InputTextElement5",
    //         "id_page": 98,
    //         "is_subpage": false,
    //         "layout_name": "MainLayout7"
    //       },
    //       {
    //         "api": null,
    //         "area_name": "ViewArea6",
    //         "areas": {
    //           "element_data": {
    //             "block_name": "Norme",
    //             "id_block": 23,
    //             "type": "str"
    //           },
    //           "element_type": "block",
    //           "parent_page_id": 98
    //         },
    //         "css_name": "dashboard",
    //         "element_name": "InputTextElement5",
    //         "id_page": 98,
    //         "is_subpage": false,
    //         "layout_name": "MainLayout7"
    //       },
    //       {
    //         "api": null,
    //         "area_name": "ViewArea7",
    //         "areas": {
    //           "element_data": {
    //             "block_name": "Ispettore*",
    //             "id_block": 23,
    //             "type": "str"
    //           },
    //           "element_type": "block",
    //           "parent_page_id": 98
    //         },
    //         "css_name": "dashboard",
    //         "element_name": "InputTextElement5",
    //         "id_page": 98,
    //         "is_subpage": false,
    //         "layout_name": "MainLayout7"
    //       },
    //       {
    //         "api": null,
    //         "area_name": "ViewArea8",
    //         "areas": {
    //           "element_data": {
    //             "block_name": "Area lavoro",
    //             "id_block": 23,
    //             "type": "str"
    //           },
    //           "element_type": "block",
    //           "parent_page_id": 98
    //         },
    //         "css_name": "dashboard",
    //         "element_name": "InputTextElement5",
    //         "id_page": 98,
    //         "is_subpage": false,
    //         "layout_name": "MainLayout7"
    //       },
    //       {
    //         "api": null,
    //         "area_name": "ViewArea9",
    //         "areas": {
    //           "element_data": {
    //             "block_name": "Note",
    //             "id_block": 23,
    //             "type": "str"
    //           },
    //           "element_type": "block",
    //           "parent_page_id": 98
    //         },
    //         "css_name": "dashboard",
    //         "element_name": "InputTextElement5",
    //         "id_page": 98,
    //         "is_subpage": false,
    //         "layout_name": "MainLayout7"
    //       },
    //       {
    //         "api": null,
    //         "area_name": "ViewIdArea",
    //         "areas": {
    //           "element_data": {
    //             "block_name": "",
    //             "id_block": 23,
    //             "type": "str"
    //           },
    //           "element_type": "block",
    //           "parent_page_id": 98
    //         },
    //         "css_name": "dashboard",
    //         "element_name": "ViewIdElement",
    //         "id_page": 98,
    //         "is_subpage": false,
    //         "layout_name": "MainLayout7"
    //       },
    //       {
    //         "api": null,
    //         "area_name": "EditCheckArea1",
    //         "areas": {
    //           "element_data": {
    //             "block_name": "CE",
    //             "id_block": 36,
    //             "type": "checkbox"
    //           },
    //           "element_type": "block",
    //           "parent_page_id": 98
    //         },
    //         "css_name": "dashboard",
    //         "element_name": "EditCheckElement1",
    //         "id_page": 98,
    //         "is_subpage": false,
    //         "layout_name": "MainLayout7"
    //       },
    //       {
    //         "api": null,
    //         "area_name": "EditCheckArea2",
    //         "areas": {
    //           "element_data": {
    //             "block_name": "ATEX",
    //             "id_block": 37,
    //             "type": "checkbox"
    //           },
    //           "element_type": "block",
    //           "parent_page_id": 98
    //         },
    //         "css_name": "dashboard",
    //         "element_name": "EditCheckElement2",
    //         "id_page": 98,
    //         "is_subpage": false,
    //         "layout_name": "MainLayout7"
    //       }
    //     ]
    //   }
    // }
    return data.data;
  } catch (error) {
    return {
      css_name: "dashboard",
      element_name: "",
      id_page: 1,
      is_subpage: true,
      layout_name: "NoRouteLayout",
      api: null,
      area_name: null,
      areas: {
        element_data: [
          {
            element_type: {
              data: []
            }
          }
        ]
      }
    };
  }
};

const AppContent = () => {
  const [jsonData, setJsonData] = React.useState(null);
  const location = useLocation();
  const route = location.pathname.substring(1) || '/';

  React.useEffect(() => {
    const getData = async () => {
      const data = await fetchData(route);
      setJsonData(data);
    };

    getData();
  }, [route]);

  if (!jsonData) {
    return <div>Loading...</div>;
  }

  return <PageBuilder jsonData={jsonData} />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = localStorage.getItem("access_token");


  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  return (
    <Router>
      <Provider store={store}>
        <div className="App">
          <Routes>
          <Route path="/" element={isAuthenticated ? <AppContent /> : <Navigate to="/login" />}/>
            <Route path="*" element={<AppContent />} />
          </Routes>
        </div>
      </Provider>
      <ToastContainer position="top-center" />
    </Router>
  );
}

export default App;
