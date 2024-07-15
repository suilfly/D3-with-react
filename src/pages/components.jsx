import { Outlet } from 'react-router-dom';
import LeftNav from '../components/LeftNav/LeftNav';

export default function Components() {
  return (
    <div className="component-wrapper">
      <LeftNav />
      <div className="right-container">
        <Outlet />
      </div>
    </div>
  );
}
