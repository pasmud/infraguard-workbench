import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/scan-results', label: 'Scan Results', icon: '🔍' },
  { to: '/exceptions', label: 'Exceptions', icon: '⚠️' },
  { to: '/compliance', label: 'Compliance', icon: '✅' },
  { to: '/reports', label: 'Reports', icon: '📄' },
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-gray-800 text-gray-200 flex flex-col py-4">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `px-4 py-3 flex items-center gap-2 hover:bg-gray-700 transition-colors ${
              isActive ? 'bg-gray-700 border-r-2 border-indigo-400' : ''
            }`
          }
        >
          <span>{link.icon}</span>
          <span>{link.label}</span>
        </NavLink>
      ))}
    </aside>
  );
}
