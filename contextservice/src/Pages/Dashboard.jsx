import Header from "../components/Header";


const Dashboard = () => {
  return (
    <div>
        <Header />
    <div className="h-svh bg-custom-lightblue">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-blue-800 text-white p-4 h-svh">
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
          <ul>
            <li className="mb-4">
              <a href="/" className="hover:bg-blue-700 p-2 rounded">Home</a>
            </li>
            <li className="mb-4">
              <a href="/profile" className="hover:bg-blue-700 p-2 rounded">Profile</a>
            </li>
            <li className="mb-4">
              <a href="/settings" className="hover:bg-blue-700 p-2 rounded">Settings</a>
            </li>
            <li className="mb-4">
              <a href="/logout" className="hover:bg-blue-700 p-2 rounded">Logout</a>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 h-svh">
          <h1 className="text-3xl font-bold mb-4">Welcome to Your SmartInbox Dashboard</h1>
          
          <div className="grid grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Total Mails Processed</h3>
              <p className="text-3xl font-bold">1,200</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Total Time Saved</h3>
              <p className="text-3xl font-bold">1200 mins</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Pending Mails</h3>
              <p className="text-3xl font-bold">4</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
            <ul>
              <li className="border-b py-2">New user registered: John Doe</li>
              <li className="border-b py-2">Payment received: $500</li>
              <li className="border-b py-2">New request: Pending approval</li>
              <li className="border-b py-2">System maintenance completed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;