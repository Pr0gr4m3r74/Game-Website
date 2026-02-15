import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🎮 PlayVerse</h1>
          <nav className="space-x-4">
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/register" className="hover:underline">
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="text-center px-4 max-w-4xl">
          <h2 className="text-5xl font-bold mb-6 text-primary-900">
            Welcome to PlayVerse
          </h2>
          <p className="text-xl mb-8 text-gray-700">
            A cross-platform social game platform where you can play, create, and connect
            with friends on web, iOS, and Android.
          </p>
          <div className="space-x-4">
            <Link
              href="/register"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="/games"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition"
            >
              Browse Games
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold mb-2">Cross-Platform</h3>
              <p className="text-gray-600">
                Play on any device - web, iOS, or Android with seamless experience
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Social Gaming</h3>
              <p className="text-gray-600">
                Connect with friends, chat in real-time, and play together
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Creative Sandbox</h3>
              <p className="text-gray-600">
                Build and explore unique game worlds with friends
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-6 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 PlayVerse. A production-ready MVP social game platform.</p>
        </div>
      </footer>
    </main>
  );
}
