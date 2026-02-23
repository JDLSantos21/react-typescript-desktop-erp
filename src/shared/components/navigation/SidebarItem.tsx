import { Link, useLocation, useNavigate } from "react-router-dom";
import { NavigationItem } from "./sidebar.types";
import { ChevronDownIcon } from "../icons";

interface SidebarItemProps {
  item: NavigationItem;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function SidebarItem({
  item,
  isOpen = false,
  onToggle,
}: SidebarItemProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const hasChildren = item.children && item.children.length > 0;
  const isParentActive = currentPath.startsWith(item.href);

  const baseClasses =
    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 h-11 text-sm font-medium";

  const activeClasses = "bg-blue-50/80 text-blue-700 border border-blue-100";

  const inactiveClasses =
    "text-slate-500 hover:bg-slate-50 hover:text-slate-700 border border-transparent";

  // Simple item without children
  if (!hasChildren) {
    return (
      <li>
        <Link
          to={item.href}
          className={`${baseClasses} ${isParentActive ? activeClasses : inactiveClasses}`}
        >
          <item.icon className="w-[18px] h-[18px]" />
          {item.name}
        </Link>
      </li>
    );
  }

  // Item with collapsible children
  const handleParentClick = () => {
    if (!isParentActive) navigate(item.href);
    onToggle?.();
  };

  return (
    <li>
      <button
        onClick={handleParentClick}
        className={`w-full cursor-pointer ${baseClasses} ${isParentActive ? activeClasses : inactiveClasses}`}
      >
        <item.icon className="w-[18px] h-[18px]" />
        <span className="flex-1 text-left">{item.name}</span>
        <ChevronDownIcon
          className={`w-3 h-3 opacity-50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Collapsible children */}
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-in-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <ul className="mt-1 ml-[18px] pl-3 border-l border-slate-200 space-y-0.5">
            {item.children!.map((child) => {
              const isChildActive = currentPath.startsWith(child.href);

              return (
                <li key={child.name}>
                  <Link
                    to={child.href}
                    className={`flex items-center gap-2.5 py-2 px-3 text-[13px] rounded-md transition-all duration-150 ${
                      isChildActive
                        ? "text-blue-700 font-medium bg-blue-50/60"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {child.icon && <child.icon className="w-4 h-4" />}
                    {child.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </li>
  );
}
