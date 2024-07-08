import { Link, Outlet } from 'react-router-dom';
import '../style/root.scss';

export default function Root() {
  return (
    <div className="root-wrapper">
      <header>
        <div className="header-container"></div>
      </header>
      <div className="nav-wrapper">
        <ul>
          {[1, 2, 4, 5].map((item) => {
            return (
              <li>
                <Link to={`nav/${item}`}>{item}</Link>
              </li>
            );
          })}
        </ul>
        <Outlet />
      </div>
    </div>
  );
}
