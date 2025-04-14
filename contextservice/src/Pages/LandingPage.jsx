import { Link } from "react-router-dom";
import Header from "../components/Header";
import Otter5 from "../assets/otterpeaking.png";
import Inbox from "../assets/inbox.png";
import Reply from "../assets/Reply.png";
import Integ from "../assets/integ.png";
import Priority from "../assets/priority.png";
import Summ from "../assets/summ.png";
import Setup from "../assets/setup.png";
import Secure from "../assets/secure.png";
import { motion } from "framer-motion";


function LandingPage() {
  return (
    <div>
      <Header />
      <div className="flex flex-col p-6 bg-custom-lightblue text-center items-center justify-center gap-4">
        {/* Hero Section */}
        <div className="flex flex-col w-full h-auto items-center justify-center px-5">
          <div className="mb-6 flex flex-col justify-center items-center md:w-1/2 pt-40 pb-20">
            <h1 className="text-5xl font-semibold font-serif text-blue-600 mb-2">
              Revolutionize Your Inbox with
              <span
                style={{ fontFamily: "Pacifico, cursive", fontWeight: "bold" }}
              >
                {" "}
                SmartInbox
              </span>
            </h1>
            <p className="text-gray-600 text-lg">
              Automate responses, manage emails smarter, and stay ahead of the
              curve with AI-powered email assistance.
            </p>
            <div className="mt-6">
              <Link
                to="/contextform"
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 mr-4">
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

          {/* Otter Image - Fix positioning */}
          <div>
          <img
                        src={Otter5}
                        alt="Otter Peaking"
                        className="w-56 h-120  "
                        style={{
                          position: "absolute",
                          top: "47%",
                          right: "18%",
                        }}
            />
          </div>

          <div className="flex w-full md:w-3/4 lg:w-full items-center justify-center px-40">
            <img
              src={Inbox}
              alt="SmartInbox Otter"
              className="w-full h-auto object-contain rounded-3xl"
            />
          </div>
        </div>

{/* Features Section */}
<section className="my-20 w-full max-w-7xl px-40 mx-auto">
  <h2 className="text-4xl font-bold text-blue-600 text-center mb-12">
    Why Choose <span className="font-serif">SmartInbox</span>?
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 items-start">
    
    {/* Feature Card 1: Contextual Auto Replies */}
    <motion.div
  whileHover={{
    scale: 1.05,
    boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.15)",
  }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
  className="bg-yellow-100 p-6 rounded-2xl shadow-lg"
>
      <h3 className="text-xl font-bold text-yellow-800 mb-4">
        Contextual Auto Replies
      </h3>
      <p className="text-sm text-gray-700 mb-6">
        Let AI draft replies based on email content and your unique preferences.
      </p>
      <div className="rounded-lg p-3 ">
        <div className="text-yellow-500 text-5xl">
          <img 
              src={Reply}
              alt="Reply otter"
              className="w-fit h-full object-contain rounded-3xl" />
        </div>
      </div>
    </motion.div>

    {/* Feature Card 2: Priority Detection */}
    <motion.div
  whileHover={{
    scale: 1.05,
    boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.15)",
  }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }} className="bg-blue-100 p-6 rounded-2xl shadow-lh-96 h-96">
      <h3 className="text-xl font-bold text-blue-800 mb-4">
        Priority Detection
      </h3>
      <p className="text-sm text-gray-700 mb-6">
        Instantly identify and respond to the most important emails.
      </p>
      <div className="rounded-lg p-3 ">
        <div className="text-yellow-500 text-5xl">
          <img 
              src={Priority}
              alt="Reply otter"
              className="w-fit h-full object-contain rounded-3xl -mt-20" />
        </div>
      </div>
    </motion.div>

    {/* Feature Card 3: Gmail Integration */}
    <motion.div
  whileHover={{
    scale: 1.05,
    boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.15)",
  }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}className="bg-pink-100 p-6 rounded-2xl shadow-lg h-96">
      <h3 className="text-xl font-bold text-pink-800 mb-4">
        Gmail Integration
      </h3>
      <p className="text-sm text-gray-700 mb-6">
        Seamlessly connect your Gmail account with using OAuth.
      </p>
      <div className="rounded-lg p-3 ">
        <div className="text-yellow-500 text-5xl">
          <img 
              src={Integ}
              alt="Reply otter"
              className="w-fit h-full object-contain rounded-3xl -mt-24" />
        </div>
      </div>
    </motion.div>

    {/* Feature Card 4: AI Summaries */}
    <motion.div
  whileHover={{
    scale: 1.05,
    boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.15)",
  }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }} className="bg-green-100 p-6 rounded-2xl shadow-lg -mt-48">
      <h3 className="text-xl font-bold text-green-800 mb-4">
        AI Summaries
      </h3>
      <p className="text-sm text-gray-700 mb-6">
        Get concise summaries of lengthy emails to make fast, informed decisions.
      </p>
      <div className="rounded-lg p-3 ">
        <div className="text-yellow-500 text-5xl">
          <img 
              src={Summ}
              alt="Reply otter"
              className="w-fit h-full object-contain rounded-3xl" />
        </div>
      </div>
    </motion.div>

  </div>
</section>

        {/* SmartInbox Setup Process Section */}
        <section className="my-20 w-full max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-blue-600 mb-12">SmartInbox Setup Process</h2>
          <div>
            <img src={Setup} alt="" className="-mt-28"/>
          </div>
        </section>

     {/* Testimonials Section */}
<section className="py-24 w-full px-6">
  <div className="max-w-7xl mx-auto text-center">
    <h2 className="text-5xl font-extrabold text-blue-800 mb-20">
      What Our Users Are Saying
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
      {[
        {
          name: "Vivek",
          quote: "SmartInbox saved me hours every week. I can’t imagine going back!",
          role: "Startup Founder",
          rating: 5,
        },
        {
          name: "Nemo",
          quote: "Emails feel lighter and faster with SmartInbox!",
          role: "Product Manager",
          rating: 4,
        },
        {
          name: "Naman",
          quote: "The AI responses are scarily accurate. Big fan!",
          role: "Freelancer",
          rating: 5,
        },
        {
          name: "Shaurya",
          quote: "My inbox has never been this clean. 10/10 would recommend.",
          role: "Marketing Lead",
          rating: 5,
        },
        {
          name: "Ishita",
          quote: "Feels like a personal email assistant. Total game changer!",
          role: "HR Consultant",
          rating: 5,
        },
        {
          name: "Raghav",
          quote: "Auto-replies that actually sound like me? Insane. I love it.",
          role: "Technical Writer",
          rating: 4,
        },
      ].map((user, i) => (
        <div
          key={i}
          className="bg-white border border-blue-100 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 relative"
        >
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent hover:border-blue-400 rounded-2xl transition-all duration-300 pointer-events-none"></div>

          {/* Avatar */}
          <div className="flex items-center mb-4 space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl shadow-md">
              {user.name[0]}
            </div>
            <div className="text-left">
              <h4 className="font-bold text-lg text-blue-800">{user.name}</h4>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
          </div>

          {/* Quote */}
          <p className="text-gray-700 italic mb-4">“{user.quote}”</p>

          {/* Stars */}
          <div className="flex space-x-1">
            {[...Array(user.rating)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.943a1 1 0 00.95.69h4.146c.969 0 1.371 1.24.588 1.81l-3.36 2.444a1 1 0 00-.364 1.118l1.287 3.943c.3.921-.755 1.688-1.538 1.118l-3.36-2.444a1 1 0 00-1.175 0l-3.36 2.444c-.783.57-1.838-.197-1.538-1.118l1.287-3.943a1 1 0 00-.364-1.118L2.075 9.37c-.783-.57-.38-1.81.588-1.81h4.146a1 1 0 00.95-.69l1.286-3.943z" />
              </svg>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

        {/* Integration and Security Section */}
        <section className="my-20 max-w-4xl mx-auto px-6 text-center flex justify-around gap-20">
          <div className="text-xl text-blue-600 mb-4">
            <img src={Secure}
            className="h-84 object-contain"/>
          </div>
          <div className="flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            Your Emails, Safe and Secure
          </h2>
          <p className="text-gray-700 text-md leading-relaxed">
            SmartInbox uses Google OAuth for secure Gmail access. All email data is encrypted and protected—your privacy is our priority.
          </p>
          </div>
        </section>

        {/* Final Call-to-Action Section */}
        <section className="my-20 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-blue-600 mb-6">
            Ready to Transform Your Inbox?
          </h2>
          <p className="text-gray-600 mb-6">
            Start for free. No credit card needed.
          </p>
          <Link
            to="/contextform"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition">
            Get Started Now
          </Link>
        </section>
      </div>

    {/* Footer */}
      <div className="bg-gray-100 border-t mt-20 pt-12 pb-4 px-6 text-gray-700 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">

      <div className="mr-40">
        <img src={Otter5} alt="" />
      </div>
    
    {/* About */}
    <div>
      <h3 className="text-md font-bold mb-3 text-gray-800">About</h3>
      <ul className="space-y-2">
        <li><a href="#" className="hover:text-blue-600 transition">What is SmartInbox?</a></li>
        <li><a href="#" className="hover:text-blue-600 transition">How it Works</a></li>
        <li><a href="#" className="hover:text-blue-600 transition">Testimonials</a></li>
      </ul>
    </div>

    {/* Resources */}
    <div>
      <h3 className="text-md font-bold mb-3 text-gray-800">Resources</h3>
      <ul className="space-y-2">
        <li><a href="#" className="hover:text-blue-600 transition">Blog</a></li>
        <li><a href="#" className="hover:text-blue-600 transition">Help Center</a></li>
        <li><a href="#" className="hover:text-blue-600 transition">Privacy Policy</a></li>
      </ul>
    </div>

    {/* Contact */}
    <div>
      <h3 className="text-md font-bold mb-3 text-gray-800">Contact</h3>
      <ul className="space-y-2">
        <li><a href="mailto:support@smartinbox.ai" className="hover:text-blue-600 transition">support@smartinbox.ai</a></li>
        <li><a href="#" className="hover:text-blue-600 transition">LinkedIn</a></li>
        <li><a href="#" className="hover:text-blue-600 transition">Twitter</a></li>
      </ul>
    </div>
  </div>

  {/* Bottom Note */}
  <div className="mt-12 text-center text-gray-500">
    <p>Built with 💙 by the SmartInbox Team © {new Date().getFullYear()} SmartInbox. All rights reserved.</p>
  </div>
</div>
    </div>
  );
}

export default LandingPage;