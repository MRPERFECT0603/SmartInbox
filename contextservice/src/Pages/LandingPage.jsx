import { Link } from "react-router-dom";
import Header from "../components/Header";
function LandingPage() {
  return (
    <div>
        <Header />
      <div className="flex flex-col p-6 bg-custom-lightblue shadow-lg rounded-lg text-center h-screen items-center justify-center">
        {/* Hero Section */}
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Welcome to SmartInbox
          </h1>
          <p className="text-gray-600 text-lg">
            Simplify your life with a personalized AI assistant tailored to your
            needs.
          </p>
        </header>

        {/* Description Section */}
        <section className="mb-6">
          <p className="text-gray-700 text-md leading-relaxed">
            SmartInbox helps you create custom email assistants to manage your
            correspondence efficiently and professionally. Get started today and
            experience the power of AI in your daily workflow.
          </p>
        </section>

        {/* Navigation Button */}
        <section className="mt-6">
          <Link
            to="/contextform"
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700"
          >
            Go to Context Form
          </Link>
        </section>

        {/* Footer */}
        <footer className="mt-6 text-gray-500">
          <p>Built with ❤️ by the SmartInbox Team</p>
          <p>© {new Date().getFullYear()} SmartInbox. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
