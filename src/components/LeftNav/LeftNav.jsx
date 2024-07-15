import ScrollBar from '../ScrollBar/ScrollBar';
import { leftNavList } from '../../datas/list.jsx';
import { Link } from 'react-router-dom';

export default function LeftNav() {
  function renderChild(list) {
    return list.map((nav) => {
      return (
        <li className="list-nav-item" key={nav.name}>
          <Link to={nav.key}>{nav.name}</Link>
        </li>
      );
    });
  }

  return (
    <ScrollBar height="526px">
      <div className="left-nav">
        {leftNavList.map((group) => {
          return (
            <ul key={group.key}>
              <b>{group.name}</b>
              {renderChild(group.children)}
            </ul>
          );
        })}
      </div>
    </ScrollBar>
  );
}
