import { Mail, Facebook, Instagram, MessageCircle, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Contact() {
  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Get in <span className="text-amber-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We'd love to hear from you! Whether you have questions about our products, 
            need help with your order, or just want to share your RockStack creations.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Details */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
              
              <div className="space-y-6">
                {/* Email */}
                <Card className="border border-amber-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Email Us</h3>
                        <p className="text-gray-600 mb-2">Send us a message anytime</p>
                        <a
                          href="mailto:hello@rockstack.com"
                          className="text-amber-600 hover:text-amber-700 font-medium"
                        >
                          hello@rockstack.com
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Response Time */}
                <Card className="border border-green-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Response Time</h3>
                        <p className="text-gray-600 mb-2">We typically respond within</p>
                        <p className="text-green-600 font-medium">24 hours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location */}
                <Card className="border border-blue-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Based in</h3>
                        <p className="text-gray-600 mb-2">Handcrafted with love from</p>
                        <p className="text-blue-600 font-medium">Portland, Oregon, USA</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Social Media & Community */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Follow Our Journey</h2>
              
              <div className="space-y-6">
                {/* Facebook */}
                <Card className="border border-blue-100 hover:shadow-md transition-shadow group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Facebook className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Facebook</h3>
                          <p className="text-gray-600">Join our community of parents</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50 group-hover:border-blue-300"
                        asChild
                      >
                        <a
                          href="https://facebook.com/rockstacktoys"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Follow
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Instagram */}
                <Card className="border border-pink-100 hover:shadow-md transition-shadow group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <Instagram className="h-6 w-6 text-pink-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Instagram</h3>
                          <p className="text-gray-600">Daily inspiration & customer features</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-pink-200 text-pink-600 hover:bg-pink-50 group-hover:border-pink-300"
                        asChild
                      >
                        <a
                          href="https://instagram.com/rockstacktoys"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Follow
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Service */}
                <Card className="border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="h-8 w-8 text-amber-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Need Help with Your Order?
                      </h3>
                      <p className="text-gray-600 mb-4">
                        For Amazon order support, returns, or shipping questions, 
                        please contact Amazon customer service directly.
                      </p>
                      <Button
                        variant="outline"
                        className="border-amber-300 text-amber-700 hover:bg-amber-100"
                        asChild
                      >
                        <a
                          href="https://amazon.com/gp/help/customer/display.html"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Amazon Help Center
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Share Your Creations!
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            We love seeing how children use their RockStack toys! Tag us on social media 
            to be featured in our gallery.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white px-4 py-2 rounded-full border border-amber-200">
              <span className="text-amber-700 font-medium">#RockStackToys</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full border border-amber-200">
              <span className="text-amber-700 font-medium">#NaturalPlay</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full border border-amber-200">
              <span className="text-amber-700 font-medium">#WoodenToys</span>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <img
              src="https://images.pexels.com/photos/8613063/pexels-photo-8613063.jpeg?auto=compress&cs=tinysrgb&w=300"
              alt="Customer creation 1"
              className="rounded-lg shadow-md hover:shadow-lg transition-shadow"
            />
            <img
              src="https://images.pexels.com/photos/8923965/pexels-photo-8923965.jpeg?auto=compress&cs=tinysrgb&w=300"
              alt="Customer creation 2"
              className="rounded-lg shadow-md hover:shadow-lg transition-shadow"
            />
            <img
              src="https://images.pexels.com/photos/8613094/pexels-photo-8613094.jpeg?auto=compress&cs=tinysrgb&w=300"
              alt="Customer creation 3"
              className="rounded-lg shadow-md hover:shadow-lg transition-shadow"
            />
            <img
              src="https://images.pexels.com/photos/8923962/pexels-photo-8923962.jpeg?auto=compress&cs=tinysrgb&w=300"
              alt="Customer creation 4"
              className="rounded-lg shadow-md hover:shadow-lg transition-shadow"
            />
          </div>
        </div>
      </section>
    </div>
  );
}