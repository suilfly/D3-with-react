import './index.js';
import { RouterProvider } from 'react-router-dom';
import { route } from './router/index.jsx';

export default function App() {
  return <RouterProvider router={route} />;
}
