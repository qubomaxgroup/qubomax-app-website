import Link from 'next/link';
import { ArrowRight, Star, Shield, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left mb-12 lg:mb-0">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                <span className="text-amber-600">RockStack</span>
                <br />
                <span className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-700 block mt-2">
                  Natural Learning Through Play
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Fun, Creative, and Safe Wooden Stacking Rocks Toys for Kids
              </p>
              <p className="mt-4 text-base text-gray-500 max-w-2xl mx-auto lg:mx-0">
                Handcrafted wooden toys that inspire creativity, improve motor skills, and provide hours of educational entertainment.
              </p>

              {/* CTA Button */}
              <div className="mt-10">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <a
                    href="https://amazon.com/your-store-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    Buy on Amazon
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-orange-200 rounded-3xl transform rotate-3 scale-105"></div>
                <img
                  src="https://images.pexels.com/photos/8613060/pexels-photo-8613060.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Wooden stacking rocks toys"
                  className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose RockStack?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our wooden stacking rocks combine fun and learning in one beautiful, natural toy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">
                Made from sustainable, natural wood with non-toxic finishes. Safe for children and the planet.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safety First</h3>
              <p className="text-gray-600">
                Smooth edges, child-safe materials, and rigorously tested to meet all safety standards.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Educational</h3>
              <p className="text-gray-600">
                Develops balance, coordination, creativity, and problem-solving skills through natural play.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-amber-100 to-orange-100">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to Inspire Creative Play?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands of parents who have discovered the joy of natural, educational toys.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 rounded-full"
            >
              <a
                href="https://amazon.com/your-store-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Shop Now on Amazon
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-amber-300 text-amber-700 hover:bg-amber-50 px-8 py-3 rounded-full"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}