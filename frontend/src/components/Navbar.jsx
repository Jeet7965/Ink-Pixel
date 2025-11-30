import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import api from "../config/ApiUrl";
import logo from "../assets/logo.jpeg";

const navigation = [
  { name: "Home", href: "/" },
  {
    name: "Blogs",
    submenu: [
      { name: "Discover", href: "/blogs" },
      { name: "My Stories", href: "/my-blogs" },
      { name: "Write", href: "/create-blog" },
    ],
  },
  {
    name: "Media",
    submenu: [
      { name: "Gallery", href: "/gallery" },
      { name: "MY Gallery", href: "/my-gallery" },
      { name: "Add Media", href: "/upload-media" },
    ],
  },
   { name: "About Us", href: "/aboutus" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const id = JSON.parse(localStorage.getItem("USER_ID"));
      if (!id) return;

      const response = await api.get(`/users/get-user/${id}`);
      setUser(response.data.result);
    } catch (error) {
      console.error("Navbar user error:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const isLoggedIn = !!user; // 🔵 ADDED

  return (
    <Disclosure as="nav" className="bg-gray-900 relative z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img className="h-8 w-auto" src={logo} alt="Logo" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex space-x-4 ml-6">
            {navigation.map((item) =>
              item.submenu ? (
                <Menu key={item.name} as="div" className="relative inline-block text-left">
                  <MenuButton className="px-3 py-2 rounded-md text-l font-bold text-gray-300 hover:bg-gray-800 hover:text-white">
                    {item.name}
                  </MenuButton>
                  <MenuItems className="absolute left-0 mt-2 w-48 rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-white/10 z-50">
                    {item.submenu.map((sub) => (
                      <MenuItem key={sub.name}>
                        {({ active }) => (
                          <Link
                            to={sub.href}
                            className={classNames(
                              active ? "bg-gray-700" : "",
                              "block px-4 py-2 text-l text-gray-300"
                            )}
                          >
                            {sub.name}
                          </Link>
                        )}
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    location.pathname === item.href
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white",
                    "px-3 py-2 rounded-md text-l font-bold"
                  )}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* Profile & Mobile Menu */}
          <div className="relative flex items-center">

            {/*  IF USER NOT LOGGED IN → SHOW LOGIN / SIGNUP */}
            {!isLoggedIn && (
              <div className="hidden sm:flex space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                >
                  Signup
                </Link>
              </div>
            )}

            {/* IF USER LOGGED IN → SHOW PROFILE MENU */}
            {isLoggedIn && (
              <Menu as="div" className="hidden sm:block mr-3">
                <MenuButton className="flex rounded-full focus:outline-none">
                  <img
                    className="h-9 w-9 rounded-full"
                    src={user?.profilePic || "https://i.pravatar.cc/100?u=default"}
                    alt="User"
                  />
                </MenuButton>

                <MenuItems className="absolute right-0 mt-2 w-48 rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-white/10 z-50">
                  <MenuItem>
                    {({ active }) => (
                      <Link
                        className={classNames(active ? "bg-gray-700" : "", "block px-4 py-2 text-sm text-gray-300")}
                        to="/profile"
                      >
                        Profile
                      </Link>
                    )}
                  </MenuItem>

                  <MenuItem>
                    {({ active }) => (
                      <Link
                        className={classNames(active ? "bg-gray-700" : "", "block px-4 py-2 text-sm text-gray-300")}
                        to="/settings"
                      >
                        Settings
                      </Link>
                    )}
                  </MenuItem>

                  <MenuItem>
                    {({ active }) => (
                      <button
                        className={classNames(active ? "bg-gray-700" : "", "w-full text-left px-4 py-2 text-sm text-gray-300")}
                        onClick={logout}
                      >
                        Logout
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            )}

            {/* Mobile button */}
            <div className="sm:hidden">
              <DisclosureButton className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md">
                <Bars3Icon className="block h-6 w-6 ui-open:hidden" />
                <XMarkIcon className="hidden h-6 w-6 ui-open:block" />
              </DisclosureButton>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <DisclosurePanel className="sm:hidden bg-gray-900 border-t border-gray-700 z-50">
        <div className="space-y-1 px-4 pt-2 pb-3 text-right">

          {navigation.map((item) =>
            item.submenu ? (
              <Disclosure key={item.name}>
                {({ open }) => (
                  <>
                    <DisclosureButton className="w-full flex justify-between px-4 py-2 text-gray-300 rounded-md hover:bg-gray-800">
                      {item.name}
                      <span>{open ? "▲" : "▼"}</span>
                    </DisclosureButton>

                    <DisclosurePanel className="pl-4 space-y-1">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.href}
                          className="block px-4 py-2 text-gray-300 rounded-md hover:bg-gray-800"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            ) : (
              <Link
                key={item.name}
                to={item.href}
                className="block px-4 py-2 text-gray-300 rounded-md hover:bg-gray-800"
              >
                {item.name}
              </Link>
            )
          )}

          {/*  MOBILE LOGIN/SIGNUP */}
          {!isLoggedIn && (
            <div className="border-t border-gray-700 mt-3 pt-3">
              <Link className="block px-4 py-2 text-gray-300 hover:bg-gray-800" to="/login">
                Login
              </Link>
              <Link className="block px-4 py-2 text-gray-300 hover:bg-gray-800" to="/signup">
                Signup
              </Link>
            </div>
          )}

          {/*  MOBILE USER MENU */}
          {isLoggedIn && (
            <div className="border-t border-gray-700 mt-3 pt-3">
              <Link className="block px-4 py-2 text-gray-300 hover:bg-gray-800" to="/profile">
                Profile
              </Link>
              <Link className="block px-4 py-2 text-gray-300 hover:bg-gray-800" to="/settings">
                Settings
              </Link>
              <button
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
