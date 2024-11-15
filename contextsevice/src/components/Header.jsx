import logo from "../assets/otter.jpg"
function Header() {
  return (
    <header className="bg-custom-blue text-white flex items-center justify-between p-2">
      {/* Logo and Name on the Left */}
      <div className="flex items-center space-x-4">
        <img
          src= {logo} // Replace with the actual logo path
          alt="SmartInbox Logo"
          className="w-12 h-12 rounded-full"
        />
        <h1 className="text-3xl font-semibold">SmartInbox</h1>
      </div>
    </header>
  );
}

export default Header;