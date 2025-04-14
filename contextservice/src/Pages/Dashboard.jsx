import { useEffect, useState } from "react";
import { contextRequest } from "../../axios";
import { Mail, Send, Clock, AlertCircle } from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import { FaUser } from 'react-icons/fa';
import { useLocation,useNavigate } from 'react-router-dom';


// Card Component
// eslint-disable-next-line react/prop-types
const Card = ({ icon: Icon, title, value, color }) => (
  <div className="flex items-center p-5 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-200 space-x-4">
    <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-semibold text-gray-800">{value}</h2>
    </div>
  </div>
);

// Section Component
// eslint-disable-next-line react/prop-types
const Section = ({ title, children }) => (
  <section className="bg-white p-6 rounded-2xl shadow-md">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
    {children}
  </section>
);


const Dashboard = () => {
  const location = useLocation();
  const email = location.state?.email;
  console.log(email);
  const [smartReplies, setSmartReplies] = useState([]);
  const [userContext, setUserContext] = useState({});
  const [summaryList, setSummaryList] = useState([]);
  const [loadingDisconnect, setLoadingDisconnect] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [emailPipelineData, setEmailPipelineData] = useState([]);
  const navigate = useNavigate();
  const fetchDashboardMetrics = async () => {
    try {
      const res = await contextRequest.get(`/dashBoardMetrics`);
      setDashboardMetrics(res.data);
      const raw = res.data.raw || {};

    const pipelineData = [
      { stage: "Fetched", value: raw.totalMailsFetched || 0 },
      { stage: "Preprocessed", value: raw.totalMailsPreprocessed || 0 },
      { stage: "Responses Generated", value: raw.totalResponsesGenerated || 0 },
      { stage: "Responses Sent", value: raw.totalResponsesSent || 0 },
    ];

    setEmailPipelineData(pipelineData);
    } catch (err) {
      console.error("Failed to fetch dashboard metrics:", err);
    }
  };
  const fetchUserData = async () => {
    try {
      const res = await contextRequest.get(`/contextData/${email}`);
      console.log(res);
      setSmartReplies(res.data.contextDoc.previousEmail || []);
      setUserContext({
        name: res.data.contextDoc.name,
        email: res.data.contextDoc.email,
        token: res.data.contextDoc.token, 
        interests: "AI, Startups, Productivity",
        role: "Product Manager at TechCo",
      });
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  
  const fetchSummary = async () => {
    try {
      const res = await contextRequest.get(`/summarize/${email}`);
      setSummaryList(res.data.summary || []);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchDashboardMetrics();
    fetchUserData();
  }, []);

  const handleGmailDisconnect = async () => {
    if (!userContext?.email) return;
    setLoadingDisconnect(true);
    try {
      await contextRequest.delete(`/token/${userContext.email}`);
      await fetchUserData(); // re-render with updated token
    } catch (err) {
      console.error("Error disconnecting Gmail", err);
    } finally {
      setLoadingDisconnect(false);
    }
  };

  const tokenExists = !(userContext?.token == " ");

  const handleToggle = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };
  return (
    <div className="min-h-screen p-2 px-6 space-y-10">
      <header className=" bg-white flex items-center justify-between py-2 px-8 mx-4  shadow rounded-3xl">
            {/* Left side: Logo and Main Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-blue-600"  onClick={() => navigate("/")}>SmartInbox</h1>
              </div>
              <nav>
                <ul className="flex space-x-6 text-sm font-medium">
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
                  <FaUser className="text-xm" />
                </li>
                <li className="bg-blue-600 text-white px-4 py-1 rounded-3xl cursor-pointer hover:bg-blue-700">
                  Try for free
                </li>
              </ul>
            </div>
          </header>

      {/* Stats and Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card
  title="Emails Processed"
  value={dashboardMetrics?.emailProcessed ?? "—"}
  icon={Mail}
  color="text-blue-600"
/>
<Card
  title="Replies Sent"
  value={dashboardMetrics?.repliesSent ?? "—"}
  icon={Send}
  color="text-green-600"
/>
<Card
  title="Pending Replies"
  value={dashboardMetrics?.pendingReplies ?? "—"}
  icon={AlertCircle}
  color="text-yellow-600"
/>
<Card
  title="Avg Response Time"
  value="2.1s"
  icon={Clock}
  color="text-purple-600"
/>
          </div>

          <Section title="Email Processing Pipeline">
  <div className="h-72 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={emailPipelineData}
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        barCategoryGap="20%"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
</Section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Section title="User Context">
            <div className="space-y-2 text-gray-700 text-sm">
              <p><span className="font-medium">Name:</span> {userContext.name}</p>
              <p><span className="font-medium">Email:</span> {userContext.email}</p>
              <p><span className="font-medium">Interests:</span> {userContext.interests}</p>
              <p><span className="font-medium">Role:</span> {userContext.role}</p>
              <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm" onClick={() => navigate("/contextform")}>Edit Context</button>
            </div>
          </Section>

        
<Section title="Settings">
  <div className="space-y-3 text-gray-700 text-sm">
    <p>
      📡 Gmail:{" "}
      <span className={`font-medium ${tokenExists ? "text-green-600" : "text-red-500"}`}>
        {tokenExists ? "Connected" : "Disconnected"}
      </span>
    </p>
    <p>🔑 API Token: ********1234</p>
    <p>🧠 AI Tone: Friendly</p>

    {tokenExists ? (
      <button
        onClick={handleGmailDisconnect}
        disabled={loadingDisconnect}
        className="mt-2 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm disabled:opacity-60"
      >
        {loadingDisconnect ? "Disconnecting..." : "Disconnect Gmail"}
      </button>
    ) : (
      <button
        onClick={() => navigate('/setuppage', { state: { email: userContext.email } })}
        className="mt-2 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
      >
        Connect Gmail
      </button>
    )}
  </div>
</Section>
        </div>
      </div>

      <Section title="Quick Bits">
  <div className="space-y-4">
    {summaryList.length > 0 ? (
      summaryList.map((item, index) => (
        <div
          key={index}
          className="flex items-start bg-gradient-to-r from-white to-blue-50 border border-blue-100 p-4 rounded-2xl shadow hover:shadow-md transition duration-200"
        >
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
              {item.sender && item.sender !== "undefined"
                ? item.sender.charAt(0).toUpperCase()
                : "?"}
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-blue-700">
                {item.sender && item.sender !== "undefined"
                  ? item.sender
                  : "Someone"}
              </p>
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded">
                {item.totalMails} mails
              </span>
            </div>
            <p className="text-gray-700 text-sm mt-1">{item.summary}</p>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-400 italic">No quick bits to show.</p>
    )}
  </div>
</Section>
<Section title="Smart Replies">
  <div className="space-y-4">
    {smartReplies.length === 0 ? (
      <p className="text-gray-500 text-sm">No smart replies found.</p>
    ) : (
      smartReplies.map((reply, idx) => {
        const [fromLine, messageLine, responseLine] = reply.split(" | ");
        const parsedResponse = JSON.parse(responseLine.split("Response: ")[1]);
        const subject = parsedResponse.subject || "No Subject";

        return (
          <div
            key={idx}
          >
            <div className="bg-white p-4 rounded-xl shadow bg-gradient-to-r from-white to-blue-50 border border-blue-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1">
                  <p className="font-medium">Subject: {subject}</p>
                  <p className="text-sm text-gray-500 italic">{fromLine}</p>
                </div>
                <button
                  onClick={() => handleToggle(idx)}
                  className="px-4 py-2 text-sm bg-blue-200 text-blue-800 hover:bg-blue-300 rounded"
                >
                  {expandedIndex === idx ? "Hide" : "View"}
                </button>
              </div>

              {expandedIndex === idx && (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-md">
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Message:</p>
                      <p className="text-sm text-gray-700">{messageLine}</p>
                    </div>
                    <div>
                      <p className="font-medium">Response:</p>
                      <div className="bg-white p-4 rounded-md shadow">
                        <p><strong>Greeting:</strong> {parsedResponse.greeting}</p>
                        <p><strong>Body:</strong> {parsedResponse.body}</p>
                        <p><strong>Signature:</strong> {parsedResponse.signature}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })
    )}
  </div>
</Section>
    </div>
  );
};

export default Dashboard;