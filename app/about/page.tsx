import { Heart, Users, Zap, Award, Leaf, Shield } from 'lucide-react';

export default function About() {
  const benefits = [
    {
      icon: <Zap className="h-8 w-8 text-amber-600" />,
      title: "Improves Motor Skills",
      description: "Stacking and balancing rocks develops fine motor skills, hand-eye coordination, and spatial awareness."
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Stimulates Creativity",
      description: "Open-ended play encourages imagination and creative problem-solving with endless building possibilities."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Social Development",
      description: "Perfect for cooperative play, teaching children to work together and share ideas."
    },
    {
      icon: <Award className="h-8 w-8 text-purple-600" />,
      title: "Educational Value",
      description: "Introduces concepts of balance, physics, colors, and patterns through hands-on learning."
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "100% Safe",
      description: "Non-toxic materials, smooth surfaces, and child-safe design tested to exceed safety standards."
    },
    {
      icon: <Leaf className="h-8 w-8 text-emerald-600" />,
      title: "Eco-Friendly",
      description: "Sustainably sourced wood with water-based finishes. Good for kids and the environment."
    }
  ];

  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              About <span className="text-amber-600">RockStack</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the magic of natural learning through our handcrafted wooden stacking rocks toys.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Inspired by Nature, Designed for Learning
              </h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  RockStack toys are born from the simple joy of stacking stones by a peaceful stream. 
                  We believe that the best toys are those that connect children with the natural world 
                  while fostering their development.
                </p>
                <p>
                  Each wooden rock is carefully crafted to provide the perfect balance of challenge and 
                  success, encouraging children to experiment, create, and learn through play. Our toys 
                  grow with your child, offering new challenges and discoveries at every stage.
                </p>
                <p>
                  We're committed to creating toys that not only entertain but also contribute to your 
                  child's cognitive, physical, and emotional development in the most natural way possible.
                </p>
              </div>
            </div>
            <div className="mt-8 lg:mt-0">
              <img
                src="/images/kids-playing-1.jpg"
                alt="Children playing with wooden toys"
                className="rounded-2xl shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Parents Choose RockStack
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our toys offer multiple developmental benefits while providing endless entertainment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mr-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
                </div>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Play Images Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Learning Through Play
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how children discover, create, and grow with RockStack toys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative group">
              <img
                src="/images/kids-building.jpg"
                alt="Child building with wooden blocks"
                className="rounded-2xl shadow-lg w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <p className="font-medium text-gray-900">Creative Construction</p>
                <p className="text-sm text-gray-600">Building unique structures and patterns</p>
              </div>
            </div>

            <div className="relative group">
              <img
                src="/images/kids-social-play.jpg"
                alt="Kids playing together with wooden toys"
                className="rounded-2xl shadow-lg w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <p className="font-medium text-gray-900">Social Play</p>
                <p className="text-sm text-gray-600">Learning cooperation and sharing</p>
              </div>
            </div>

            <div className="relative group">
              <img
                src="/images/focused-learning.jpg"
                alt="Focused child playing with educational toys"
                className="rounded-2xl shadow-lg w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <p className="font-medium text-gray-900">Focused Learning</p>
                <p className="text-sm text-gray-600">Developing concentration and patience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Commitment */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Our Quality Promise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sustainable Materials</h3>
              <p className="text-sm text-gray-600">Responsibly sourced hardwood</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Safety Tested</h3>
              <p className="text-sm text-gray-600">Exceeds international toy safety standards</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Handcrafted</h3>
              <p className="text-sm text-gray-600">Each piece individually finished</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}