import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// Function to dynamically import components based on the type (layout, area, or element)
const importComponent = (type, path) => {
  try {
    let componentPath = '';
    switch (type) {
      case 'layout':
        componentPath = `components/layouts/${path}`;
        break;
      case 'area':
        componentPath = `components/areas/${path}`;
        break;
      case 'element':
        componentPath = `components/elements/${path}`;
        break;
      default:
        throw new Error(`Unknown component type: ${type}`);
    }
    return lazy(() => import(`./${componentPath}`));
  } catch (error) {
    console.error(`Error loading ${type} component at ${path}:`, error);
    return null;
  }
};

// Function to dynamically import CSS files
const importCss = (path) => {
  let cssPath = `components/css/${path}.css`
  try {
    import(`./${cssPath}`);
  } catch (error) {
    console.error(`Error loading CSS at ${path}:`, error);
  }
};

// Recursive function to render nested areas and their elements
const renderNestedAreas = (nestedAreas) => {
  // Dynamically import the main layout component
  const LayoutComponent = importComponent('layout', nestedAreas.layout_name);

  // Map through the result areas and render them
  const resultAreas = nestedAreas.result.map((nestedArea, nestedIndex) => {
    const { area_name, areas, element_name, css_name, is_subpage, layout_name, element_data = [] } = nestedArea;
    const ComponentName = area_name || layout_name; // Use layout or area name to load component
    const NestedAreaComponent = importComponent(area_name ? 'area' : 'layout', ComponentName);

    if (css_name) {
      importCss(css_name); // Import CSS if present
    }

    console.log('==nestedArea==', areas?.element_type, areas.element_data?.[0].element_type);
    if (areas?.element_type === 'container' && areas.element_data[0].element_type?.id_page) {
      // Handle containers with nested elements
      const nestedAreaElements = element_data.map((elementObj, elIndex) => {
        const { area_name, element_name, css_name, element_type, areas: deeperNestedAreas = [] } = elementObj;

        if (css_name) {
          importCss(css_name); // Import CSS if present
        }

        const ElementComponent = importComponent('area', area_name);
        const ElementComponentToSend = importComponent('element', element_name);

        return (
          <Suspense key={`${area_name}-${elIndex}`} fallback={<div>Loading element...</div>}>
            <ElementComponent>
              {element_type ? (
                <ElementComponentToSend data={element_type} />
              ) : null}
              {deeperNestedAreas.length > 0 ? renderNestedAreas(deeperNestedAreas) : null}
            </ElementComponent>
          </Suspense>
        );
      });

      return (
        <Suspense key={`${nestedArea.area_name}-${nestedIndex}`} fallback={<div>Loading nested area...</div>}>
          <NestedAreaComponent>{nestedAreaElements}</NestedAreaComponent>
        </Suspense>
      );
    } else {
      // Handle non-container elements
      const ElementComponentToSend = importComponent('element', element_name);

      return (
        <Suspense key={`${area_name}`} fallback={<div>Loading element...</div>}>
          <NestedAreaComponent>
            <ElementComponentToSend data={areas.element_data?.[0].element_type} areas={areas} />
          </NestedAreaComponent>
        </Suspense>
      );
    }
  });

  // Render the layout and pass the nested result areas as children
  return (
    <Suspense fallback={<div>Loading layout...</div>}>
      <LayoutComponent>
        {resultAreas}
      </LayoutComponent>
    </Suspense>
  );
};

// Main PageBuilder component
const PageBuilder = ({ jsonData }) => {
  const [Layout, setLayout] = useState(null);
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    if (jsonData) {
      // Import CSS for the main layout
      if (jsonData.css_name) {
        importCss(jsonData.css_name);
      }

      // Dynamically load the layout component
      const LayoutComponent = importComponent('layout', jsonData.layout_name);
      setLayout(() => LayoutComponent);

      // Process the areas from the JSON data
      const processElements = (items) => {
        return items.map((itemObj, itemIndex) => {
          const { area_name, areas, css_name, layout_name, is_subpage, element_name } = itemObj;
          const ComponentName = area_name || layout_name; // Use layout or area name to load component
          const ElementComponent = importComponent(area_name ? 'area' : 'layout', ComponentName);

          if (css_name) {
            importCss(css_name); // Load associated CSS if present
          }

          const NestedElementData = areas?.element_data || [];

          // Recursively render nested elements
          const ElementComponentToSend = importComponent('element', element_name);

          if (areas?.element_type === 'container' && areas.element_data[0].element_type?.id_page) {
            const nestedElements = NestedElementData.length > 0 && areas.element_data[0].element_type?.id_page
              ? renderNestedAreas(areas.element_data[0].element_type.data)
              : null;

            return (
              <Suspense key={`${ComponentName}-${itemIndex}`} fallback={<div>Loading element...</div>}>
                <ElementComponent>{nestedElements}</ElementComponent>
              </Suspense>
            );
          } else {
            console.log(areas.element_data?.[0]?.element_type, '===else====xx', areas, itemObj)
            return (
              <Suspense key={`${ComponentName}-${itemIndex}`} fallback={<div>Loading element...</div>}>
                <ElementComponent >
                  <ElementComponentToSend data={areas.element_data?.[0]?.element_type} areas={areas} api={itemObj?.api}/>
                </ElementComponent>
              </Suspense>
            );
          }
        });
      };

      const areaComponents = processElements(jsonData.result);
      setAreas(areaComponents);
    }
  }, [jsonData]);

  if (!Layout) {
    return <div>Loading layout...</div>;
  }

  return (
    <Routes>
      <Route
        path="*"
        element={
          <Suspense fallback={<div>Loading layout...</div>}>
            <Layout areas={areas} />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default PageBuilder;
