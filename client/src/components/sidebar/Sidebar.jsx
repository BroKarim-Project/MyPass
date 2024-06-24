import { Link } from 'react-router-dom';
import { menu } from '../../data';

const Sidebar = () => {
  return (
    <div className="menu">
      {menu.map((item) => (
        <div className="item flex flex-col gap-2 mb-5 " key={item.id}>
          <span className="title uppercase text-base font-semibold">{item.title}</span>
          {item.listItems.map((listItem) => (
            <a href={listItem.url} className="listItem flex items-center gap-3 p-2 rounded-md hover:bg-slate-400 " key={listItem.id}>
              <img src={listItem.icon} className="sm:block hidden" alt="" />
              <span className="listItemTitle">{listItem.title}</span>
            </a>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
