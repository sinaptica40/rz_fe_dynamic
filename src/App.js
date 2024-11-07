import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import PageBuilder from './PageBuilder';

let pagesCache = null;

const fetchPages = async () => {
  if (!pagesCache) {
    try {
      const response = await fetch('http://192.168.235.245:4065/api/v1/pages');
      const data = await response.json();
      pagesCache = data.data.pages.reduce((acc, page) => {
        acc[page.page_name_label] = page.id_page;
        return acc;
      }, {});

      console.log('Pages Cache:', pagesCache);

    } catch (error) {
      pagesCache = {};
    }
  }
  return pagesCache;
};

const fetchData = async (route) => {
  console.log('==route==', route)
  const pages = await fetchPages();
  const pageId = pages[route] ?? route;

  const url = pageId
    ? `http://192.168.235.245:4065/api/v1/page-data-retriever/${pageId}`
    : null;

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

  // Try to fetch the page data
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.data;  // Return the actual data if successful
  } catch (error) {
    // If there's an error during the fetch, return the fallback response
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
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="*" element={<AppContent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
