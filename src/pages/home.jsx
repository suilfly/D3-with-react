import '@/assets/style/root.scss';
import logo from '@/assets/logo.svg';
import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react';

export default function Home() {
  const [menuLists, setMenuLists] = useState([
    {
      name: '指南',
      to: '/guide',
      selected: false,
    },
    {
      name: '组件',
      to: '/components',
      selected: false,
    },
    {
      name: '主题',
      to: '/theme',
      selected: false,
    },
    {
      name: '资源',
      to: '/resource',
      selected: false,
    },
  ]);

  function menuClickHandle(index) {
    const values = [...menuLists];
    values.forEach((item, i) => {
      i === index ? (item.selected = true) : (item.selected = false);
    });
    setMenuLists(values);
    console.log(menuLists);
  }

  return (
    <div className="root-wrapper">
      <header>
        <div className="header-container">
          {/* <img src={logo} /> */}
          <div className="menu-list">
            {menuLists.map((item, index) => {
              return (
                <div
                  className={`menu-item ${item.selected ? 'selected-menu' : ''}`}
                  onClick={() => menuClickHandle(index)}
                  key={item.name}
                >
                  <Link to={item.to}>{item.name}</Link>
                </div>
              );
            })}
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
