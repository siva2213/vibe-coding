export default function Home(): JSX.Element {
  const services = [
    {
      title: "Primary Care",
      description: "Comprehensive primary healthcare services for all ages",
      icon: "🏥",
    },
    {
      title: "Emergency Care",
      description: "24/7 emergency medical services when you need them most",
      icon: "🚑",
    },
    {
      title: "Specialist Consultation",
      description: "Access to expert specialists across various medical fields",
      icon: "👨‍⚕️",
    },
    {
      title: "Health Checkups",
      description: "Regular health screenings and preventive care programs",
      icon: "💊",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Welcome to HealthCare</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">Your trusted partner in health and wellness</p>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-blue-50">
            We provide comprehensive, compassionate healthcare services to help you and your family live healthier
            lives.
          </p>
          <div className="mt-10">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg">
              Book an Appointment
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div className="text-5xl mb-4 text-center">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">{service.title}</h3>
                <p className="text-gray-600 text-center">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Quality Care</h3>
              <p className="text-gray-600">Award-winning healthcare services with a focus on patient satisfaction</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">👨‍⚕️</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Expert Doctors</h3>
              <p className="text-gray-600">Board-certified physicians with years of experience in their specialties</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🕐</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">24/7 Availability</h3>
              <p className="text-gray-600">Round-the-clock emergency services and support when you need it</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
