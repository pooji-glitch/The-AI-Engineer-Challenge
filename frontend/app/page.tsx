export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            AI Engineer Challenge
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Welcome to the AI Engineer Challenge application. This is a modern, responsive frontend built with Next.js and Tailwind CSS.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature Card 1 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Modern Stack</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Built with Next.js, TypeScript, and Tailwind CSS for a modern development experience.
                </p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Responsive Design</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Fully responsive layout that works on all devices and screen sizes.
                </p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">API Integration</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Seamlessly integrated with the backend API for full-stack functionality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 