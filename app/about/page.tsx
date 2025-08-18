import { Heart, Users, Zap, Award, Leaf, Shield, Baby } from 'lucide-react';

export default function About() {
  const stackingRocksBenefits = [
    {
      icon: <Zap className="h-8 w-8 text-amber-600" />,
      title: "Motor Skills Development",
      description: "Stacking and balancing rocks develops fine motor skills, hand-eye coordination, and spatial awareness."
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Fosters Imagination",
      description: "Open-ended play encourages imagination and creative problem-solving with endless building possibilities."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Family Bonding",
      description: "Strengthens family connections as kids engage with other members during playtime."
    },
    {
      icon: <Award className="h-8 w-8 text-purple-600" />,
      title: "Natural Problem-Solvers",
      description: "The challenging nature encourages creativity and prepares kids to tackle difficult situations."
    },
    {
      icon: <Leaf className="h-8 w-8 text-emerald-600" />,
      title: "Eco-Friendly",
      description: "Crafted using high-quality wood coated with water-based paint for safety and sustainability."
    },
    {
      icon: <Baby className="h-8 w-8 text-pink-600" />,
      title: "Worry-Free Play",
      description: "Smooth surface that's gentle to the touch prevents injuries and keeps playtime safe."
    }
  ];

  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              About <span className="text-amber-600">Qubomax</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover Qubomax - bringing creativity and learning to your home through natural wooden toys.
            </p>
          </div>
        </div>
      </section>

      {/* Our Philosophy Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Philosophy
              </h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  We began this journey as a means to help people elevate their comfort and make their kids smarter. 
                  Currently, we have our signature product in our store: Stacking Rocks for Kids.
                </p>
                <p>
                  At Qubomax, we believe that the best products are those that enhance your daily life while 
                  contributing to your family's well-being. Our carefully curated wooden toys focus on quality, 
                  creativity, and child development.
                </p>
                <p>
                  We strive to create a seamless shopping experience where you can effortlessly buy our products 
                  and elevate your child's learning through natural play.
                </p>
              </div>
            </div>
            <div className="mt-8 lg:mt-0">
              <img
                src="/images/kids-playing-1.jpg"
                alt="Children playing with Qubomax stacking rocks"
                className="rounded-2xl shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stacking Rocks Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Stacking Rocks for Kids
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Help kids foster imagination and develop motor skills with our eco-friendly wooden stacking rocks.
            </p>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center mb-12">
            <div>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  Our Stacking Rocks for Kids are designed to help kids foster imagination and 
                  develop motor skills. Available in different shapes and sizes, the stacks strengthen family 
                  bonding as kids will engage with other members while playing.
                </p>
                <p>
                  And it's not all – the game's challenging nature will also encourage creativity and make them 
                  natural problem-solvers ready to tackle difficult situations.
                </p>
                <p>
                  You'll love our eco-friendly stacks as we've crafted them using high-quality wood coated with 
                  water-based paint. And with a smooth surface that's gentle to the touch, they'll prevent injuries 
                  and keep playtime worry-free.
                </p>
              </div>
            </div>
            <div className="mt-8 lg:mt-0">
              <img
                src="/images/classic-set.jpg"
                alt="Stacking Rocks for Kids"
                className="rounded-2xl shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stackingRocksBenefits.map((benefit, index) => (
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

      {/* Our Mission Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            To bring comfort, joy, and creativity to your home, one product at a time. We strive to create 
            a seamless shopping experience where you can effortlessly buy our products and elevate your daily routine.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Comfort</h3>
              <p className="text-sm text-gray-600">Elevating your family's daily experience</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Joy</h3>
              <p className="text-sm text-gray-600">Bringing happiness through natural play</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Creativity</h3>
              <p className="text-sm text-gray-600">Fostering imagination and development</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              For You & Our World
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every Qubomax product is designed with both your family's well-being and environmental responsibility in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative group">
              <img
                src="/images/kids-building.jpg"
                alt="Kids playing with stacking rocks"
                className="rounded-2xl shadow-lg w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <p className="font-medium text-gray-900">Creative Development</p>
                <p className="text-sm text-gray-600">Building skills through natural play</p>
              </div>
            </div>

            <div className="relative group">
              <img
                src="/images/focused-learning.jpg"
                alt="Child focused on learning through play"
                className="rounded-2xl shadow-lg w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <p className="font-medium text-gray-900">Natural Learning</p>
                <p className="text-sm text-gray-600">Educational play that develops minds</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}