import './index.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './router/root.jsx';
import LeftContainer from './router/leftContainer.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'nav/:id',
        element: <LeftContainer />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
