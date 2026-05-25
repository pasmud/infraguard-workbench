export default function Navbar() {
  return (
    <nav className="bg-indigo-700 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold">InfraGuard Workbench</span>
        <span className="text-indigo-200 text-sm">Infrastructure Security Scanner</span>
      </div>
      <div className="text-indigo-200 text-xs">v1.0.0</div>
    </nav>
  );
}
