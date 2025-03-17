import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation,Navigate,useNavigate } from 'react-router-dom';
import PageBuilder from './PageBuilder';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

let pagesCache = null;

const fetchPages = async () => {
  if (!pagesCache) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/pages`,{
        headers: {
          'Accept-Language': 'en', // Set the desired language
        },
      });
      const data = await response.json();
      localStorage.setItem("navPages",JSON.stringify(data?.data?.pages))
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

const fetchData = async (route, token) => {
  
  const pages = await fetchPages();
  console.log(pages,'check pages array')
  let pageId;

  if (!token) {
    pageId = pages['login']
  } else {
    if (route == pages['login'] || route == 'login') {
      pageId = pages['dashboard']
    } else {
      pageId = pages[route] ?? route;
    }
  }

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
    const response = await fetch(url,{
      headers: {
        'Accept-Language': 'en', // Set the desired language
      },
    });
    const data = await response.json();
    console.log(data,'check data here get from url')
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
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const route = location.pathname.substring(1) || '/';
  console.log(route,'check the route name here')
  React.useEffect(() => {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    if(!token){
      navigate('/login')
    }
    
    const getData = async () => {
      const data = await fetchData(route, token);
      console.log(data,'check getData Function')
      setJsonData(data);
      console.warn("dataaaa",jsonData)
     
    };
   
      getData();
      // const userdata = await getUserDetails({

      // });
  }, [route]);

  if (!jsonData) {
    return <div>Loading...</div>;
  }

  return <PageBuilder jsonData={jsonData} />;
};

function App() {
 
  return (
    <Router>
      <Provider store={store}>
        <div className="App">
          <Routes>
            <Route path="*" element={<AppContent />} />
          </Routes>
        </div>
      </Provider>
      <ToastContainer position="top-center" />
    </Router>
  );
}

export default App;
