import { Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"


const Home = () => {
const navigate = useNavigate()

  const PatientView = () => {
  navigate("/patientView")
}

  return (
    <div>
     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-green-50 p-4">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-400 rounded-2xl flex items-center justify-center mx-auto mb-6 ">
        <Heart className="w-10 h-10 text-white" />
      </div>
          <h1 className="text-4xl font-bold mt-5 mb-5">
            Welcome to MediCare Companion
          </h1>
          <p className="text-xl max-w-4xl mx-auto">
            Your trusted partner in medication management. Choose your role to get started with personalized features.
          </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">

        {/* Patient Card */}
        <div className="border hover:border-blue-200 rounded-2xl hover:shadow-lg p-6 bg-white flex flex-col items-center">
          <div className="text-blue-500 text-4xl mb-4">
            <span className="inline-block p-3 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.186 0 4.253.523 6.121 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
          </div>
          <h2 className="text-xl font-bold text-blue-700 mb-2">I'm a Patient</h2>
          <p className="text-gray-600 mb-4 text-center">Track your medication schedule and maintain your health records</p>
          <ul className="text-left text-sm text-gray-700 space-y-2 mb-6">
            <li>• Mark medications as taken</li>
            <li>• Upload proof photos (optional)</li>
            <li>• View your medication calendar</li>
            <li>• Large, easy-to-use interface</li>
          </ul>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" onClick = {PatientView}>Continue as Patient</button>
        </div>

        {/* Caretaker Card */}
        <div className="border hover:border-green-200 rounded-2xl shadow-lg p-6 bg-white flex flex-col items-center">
          <div className="text-green-500 text-4xl mb-4">
            <span className="inline-block p-3 bg-green-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
          </div>
          <h2 className="text-xl font-bold text-green-700 mb-2">I'm a Caretaker</h2>
          <p className="text-gray-600 mb-4 text-center">Monitor and support your loved one's medication adherence</p>
          <ul className="text-left text-sm text-gray-700 space-y-2 mb-6">
            <li>• Monitor medication compliance</li>
            <li>• Set up notification preferences</li>
            <li>• View detailed reports</li>
            <li>• Receive email alerts</li>
          </ul>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">Continue as Caretaker</button>
        </div>

      </div>
    </div>
    </div>
  )
}


export default Home
