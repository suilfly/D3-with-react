import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/home.jsx';
import Guide from '../pages/guide.jsx';
import Components from '../pages/components.jsx';
import Theme from '../pages/theme.jsx';
import Resource from '../pages/resource.jsx';

export const route = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: 'guide',
        element: <Guide />,
      },
      {
        path: 'components',
        element: <Components />,
      },
      {
        path: 'theme',
        element: <Theme />,
      },
      {
        path: 'resource',
        element: <Resource />,
      },
    ],
  },
]);
