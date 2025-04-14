import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

/**
 * Header Component
 * This component displays the application header, including the logo and application name.
 */

function Header() {
  const navigate = useNavigate();
  return (
    <header className=" bg-white flex items-center justify-between py-2 px-8 mx-24  shadow rounded-3xl">
      {/* Left side: Logo and Main Navigation */}
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-4">
        <h1
          className="text-xl font-semibold text-blue-600 cursor-pointer"
          onClick={() => navigate("/")}> SmartInbox </h1>
        </div>
        <nav>
          <ul className="flex space-x-6 text-sm font-medium ">
            <li>Products</li>
            <li>Solutions</li>
            <li>Resources</li>
            <li>Pricing</li>
          </ul>
        </nav>
      </div>

      {/* Right side: User Actions */}
      <div>
        <ul className="flex items-center space-x-6 text-sm font-medium">
          <li className="flex items-center space-x-2 cursor-pointer">
            <button onClick={() => navigate("/loginpage")} >
            <FaUser className="text-xm" />
            </button>
          </li>
          <li className="bg-blue-600 text-white px-6 py-1 rounded-3xl cursor-pointer hover:bg-blue-700">
          <button onClick={() => navigate("/loginpage")} >
            Login
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;