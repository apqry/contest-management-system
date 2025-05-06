import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'لوحة التحكم' },
  { to: '/scores', label: 'الدرجات' },
  { to: '/contestants', label: 'المتسابقات' },
  { to: '/supervisors', label: 'المشرفات' },
  { to: '/competitions', label: 'المسابقات' },
];

function Navbar() {
  return (
    <nav className="bg-white shadow p-4 flex justify-center space-x-8 rtl:space-x-reverse">
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `text-lg font-semibold hover:text-blue-600 ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'}`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default Navbar;
