import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from './lib/loader/loader';

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
    // console.log('==import ', lazy(() => import(`./${componentPath}`)))
    return lazy(() => import(`./${componentPath}`));
  } catch (error) {
    console.error(`Error loading ${type} component at ${path}:`, error);
    return null;
  }
};

const importCss = (path) => {
  let cssPath = `components/css/${path}.css`
  try {
    import(`./${cssPath}`);
  } catch (error) {
    console.error(`Error loading CSS at ${path}:`, error);
  }
};

const renderNestedAreas = (nestedAreas) => {
  const LayoutComponent = importComponent('layout', nestedAreas.layout_name);

  const resultAreas = nestedAreas.result.map((nestedArea, nestedIndex) => {
    const { area_name, areas, element_name, css_name, is_subpage, layout_name, element_data = [] } = nestedArea;
    const ComponentName = area_name || layout_name;
    const NestedAreaComponent = importComponent(area_name ? 'area' : 'layout', ComponentName);

    if (css_name) {
      importCss(css_name); // Import CSS if present
    }

    if (areas?.element_type === 'container' && areas.element_data[0].element_type?.id_page) {
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
      const ElementComponentToSend = importComponent('element', element_name);

      return (
        <Suspense key={`${area_name}`} fallback={<div>Loading element...</div>}>
          <NestedAreaComponent>
            <ElementComponentToSend data={areas?.element_data?.[0]?.element_type} areas={areas} api={nestedArea?.api} />
          </NestedAreaComponent>
        </Suspense>
      );
    }
  });

  return (
    <Suspense fallback={<div>Loading layout...</div>}>
      <LayoutComponent>
        {resultAreas}
      </LayoutComponent>
    </Suspense>
  );
};

const PageBuilder = ({ jsonData }) => {
  const [Layout, setLayout] = useState(null);
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    if (jsonData) {
      if (jsonData.css_name) {
        importCss(jsonData.css_name);
      }

      const LayoutComponent = importComponent('layout', jsonData.layout_name);
      setLayout(() => LayoutComponent);

      const processElements = (items) => {
        return items?.map((itemObj, itemIndex) => {
          const { area_name, areas, css_name, layout_name, is_subpage, element_name } = itemObj;
          const ComponentName = area_name || layout_name; // Use layout or area name to load component
          const ElementComponent = importComponent(area_name ? 'area' : 'layout', ComponentName);

          if (css_name) {
            importCss(css_name); // Load associated CSS if present
          }

          const NestedElementData = areas?.element_data || areas?.table_columns || [];

          const ElementComponentToSend = importComponent('element', element_name);

          if (areas?.element_type === 'container' && areas?.element_data[0]?.element_type?.id_page) {
            const nestedElements = NestedElementData?.length > 0 && areas?.element_data[0]?.element_type?.id_page
              ? renderNestedAreas(areas?.element_data[0]?.element_type.data)
              : null;

            return (
              <Suspense key={`${ComponentName}-${itemIndex}`} fallback={<div>Loading element...</div>}>
                <ElementComponent>{nestedElements}</ElementComponent>
              </Suspense>
            );
          }
          // Commented by Naveen
          else if (areas?.element_type === 'table') {
            // Find all columns where `table_fields.page_type` is 'subpage'
            const subpageColumns = areas?.table_columns?.filter(
              column => column?.table_fields?.page_type === 'subpage'
            );

            if (subpageColumns?.length > 0) {
              // Render nested elements for all matching subpage columns
              const nestedElements = subpageColumns.map((subpageColumn, index) => {
                return (
                  NestedElementData.length > 0 && subpageColumn?.table_fields?.page_type
                    ? renderNestedAreas(subpageColumn?.table_fields?.page)
                    : null
                )
              }

              );

              return (
                <Suspense key={`${ComponentName}-${itemIndex}`} fallback={<div>Loading element...</div>}>
                  <ElementComponent>
                    {nestedElements.map((nestedElement, idx) => (
                      <ElementComponentToSend
                        key={`nestedElement-${idx}`}
                        data={areas?.element_data?.[0]?.element_type}
                        areas={areas}
                        api={itemObj?.api}
                        nestedElements={nestedElement?.props?.children?.props?.children}
                      />
                    ))}
                  </ElementComponent>
                </Suspense>
              );
            } else {
              return (
                <Suspense key={`${ComponentName}-${itemIndex}`} fallback={<div>Loading element...</div>}>
                  <ElementComponent>
                    {/* {nestedElements || ( */}
                    <ElementComponentToSend
                      data={areas?.element_data?.[0]?.element_type}
                      areas={areas}
                      api={itemObj?.api}
                      nestedElements={null}
                    />
                    {/* // */}
                  </ElementComponent>
                </Suspense>
              );
            }
          }

          // Commented by Naveen
          else {
            return (
              <Suspense key={`${ComponentName}-${itemIndex}`} fallback={<div>
                {/* Loading element... */}
                <Loader />
              </div>}>
                <ElementComponent >
                  <ElementComponentToSend data={areas.element_data?.[0]?.element_type} areas={areas} api={itemObj?.api} />
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
    return <div>
      <Loader />
      {/* Loading layout... */}
    </div>;
  }

  return (
    <Routes>
      <Route
        path="*"
        element={
          <Suspense fallback={
            <div>
              <Loader />
              {/* Loading layout... */}
            </div>
          }>
            <Layout areas={areas} />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default PageBuilder;
