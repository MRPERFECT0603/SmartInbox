import { Link } from "react-router-dom";
import Header from "../components/Header";
import Otter from "../assets/otter.jpg";

function LandingPage() {
  return (
    <div>
      <Header />
      <div className="flex flex-col p-6 bg-slate-50 shadow-lg rounded-lg text-center items-center justify-center gap-4">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row w-full h-auto items-center justify-center px-5">
          <div className="mb-6 flex flex-col justify-center items-center md:w-1/2">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">
              Revolutionize Your Inbox with SmartInbox
            </h1>
            <p className="text-gray-600 text-lg">
              Automate responses, manage emails smarter, and stay ahead of the
              curve with AI-powered email assistance.
            </p>
            <div className="mt-6">
              <Link
                to="/contextform"
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 mr-4"
              >
                Get Started for Free
              </Link>
              <Link
                to="/demo"
                className="bg-gray-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-700"
              >
                Watch Demo
              </Link>
            </div>
          </div>
          <div className="flex w-full md:w-1/2 items-center justify-center">
            <img
              src={Otter}
              alt="SmartInbox Otter"
              className="w-full h-full object-contain rounded-3xl"
            />
          </div>
        </div>
        <div className="flex pt-20 pb-20 justify-center items-center">
        {/* Features Section */}
        <section className="my-8 w-full max-w-screen-md mx-auto">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            Why Choose SmartInbox?
          </h2>
          <ul className="text-gray-700 text-md leading-relaxed list-disc list-inside">
            <li>Automated email replies with context.</li>
            <li>Intelligent prioritization of important emails.</li>
            <li>Seamless integration with Gmail.</li>
            <li>AI-powered summaries and categorization.</li>
          </ul>
        </section>

        {/* How It Works Section */}
        <section className="my-8 w-full max-w-screen-md mx-auto">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">How It Works</h2>
          <div className="text-gray-700 text-md leading-relaxed">
            <p>
              1. <strong>Connect Your Gmail Account:</strong> Secure and easy
              setup.
            </p>
            <p>
              2. <strong>Customize Your Assistant:</strong> Personalize
              responses and priorities.
            </p>
            <p>
              3. <strong>Enjoy Smart Assistance:</strong> Save time and boost
              productivity.
            </p>
          </div>
        </section>
        </div>
        {/* Testimonials Section */}
        <section className="my-8 w-full max-w-screen-md mx-auto">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            What Our Users Say
          </h2>
          <div className="flex gap-40 p-20">
          <blockquote className="text-gray-700 italic border-l-4 border-blue-600 pl-4">
            &quot;SmartInbox saved me hours every week. I can’t imagine going
            back!&quot; – Vivek
          </blockquote>
          <blockquote className="text-gray-700 italic border-l-4 border-blue-600 pl-4">
            &quot;SmartInbox saved me hours every week. I can’t imagine going
            back!&quot; – Nemo
          </blockquote>
          </div>
          <div className="flex gap-40 p-20">
          <blockquote className="text-gray-700 italic border-l-4 border-blue-600 pl-4">
            &quot;SmartInbox saved me hours every week. I can’t imagine going
            back!&quot; – Naman
          </blockquote>
          <blockquote className="text-gray-700 italic border-l-4 border-blue-600 pl-4">
            &quot;SmartInbox saved me hours every week. I can’t imagine going
            back!&quot; – Shaurya
          </blockquote>
          </div>
        </section>

        {/* Integration and Security Section */}
        <section className="my-8 w-full max-w-screen-md mx-auto">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            Your Emails, Safe and Secure
          </h2>
          <p className="text-gray-700 text-md leading-relaxed">
            SmartInbox integrates seamlessly with Gmail using OAuth for secure
            access and ensures data encryption to protect your privacy.
          </p>
        </section>

        {/* Call-to-Action Section */}
        <section className="my-8 w-full max-w-screen-md mx-auto">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            Ready to Transform Your Email Experience?
          </h2>
          <Link
            to="/contextform"
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700"
          >
            Sign Up Now
          </Link>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-gray-500 text-center w-full border-t-2 border-slate-500">
          <p>Built with ❤️ by the SmartInbox Team</p>
          <p>© {new Date().getFullYear()} SmartInbox. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;