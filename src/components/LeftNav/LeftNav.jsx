import ScrollBar from '../ScrollBar/ScrollBar';
import { leftNavList } from '../../datas/list';

export default function LeftNav() {
  function renderChild(list) {
    return list.map((nav) => {
      return <li className="list-nav-item">{nav.name}</li>;
    });
  }

  return (
    <ScrollBar height="526px">
      <div className="left-nav">
        {leftNavList.map((group) => {
          return (
            <ul>
              <b>{group.name}</b>
              {renderChild(group.children)}
            </ul>
          );
        })}
      </div>
    </ScrollBar>
  );
}
