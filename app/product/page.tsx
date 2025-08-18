import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Star, Package, Zap } from 'lucide-react';

export default function Product() {
  const products = [
    {
      id: 1,
      name: "Classic RockStack Set",
      image: "/images/classic-set.jpg",
      description: "Our signature set of 12 wooden stacking rocks in various sizes and natural wood tones. Perfect for beginners and includes a storage bag.",
      features: ["12 unique wooden pieces", "Storage bag included", "Ages 3+", "Natural wood finish"],
      price: "$29.99",
      amazonLink: "https://amazon.com/your-classic-set-link"
    },
    {
      id: 2,
      name: "Rainbow RockStack Collection",
      image: "/images/rainbow-set.jpg",
      description: "Colorful wooden rocks with safe, water-based stains in vibrant colors. Combines natural wood beauty with engaging rainbow hues.",
      features: ["15 colorful pieces", "Non-toxic water-based stains", "Ages 2+", "Color learning guide"],
      price: "$39.99",
      amazonLink: "https://amazon.com/your-rainbow-set-link"
    },
    {
      id: 3,
      name: "Deluxe RockStack Builder",
      image: "/images/deluxe-set.jpg",
      description: "Premium large set with 20 pieces including extra-large base rocks and miniature pieces for advanced building challenges.",
      features: ["20 assorted pieces", "Extra-large base rocks", "Advanced building guide", "Premium storage box"],
      price: "$59.99",
      amazonLink: "https://amazon.com/your-deluxe-set-link"
    },
    {
      id: 4,
      name: "Mini Travel RockStack",
      image: "/images/travel-set.jpg",
      description: "Compact travel-friendly set perfect for on-the-go play. Includes 8 smaller rocks in a portable wooden box.",
      features: ["8 travel-sized pieces", "Portable wooden box", "Perfect for travel", "Compact design"],
      price: "$19.99",
      amazonLink: "https://amazon.com/your-travel-set-link"
    }
  ];

  const gallery = [
    {
      image: "/images/natural-wood-beauty.jpg",
      title: "Natural Wood Beauty",
      description: "Each piece showcases the unique grain and character of premium hardwood."
    },
    {
      image: "/images/endless-creativity.jpg",
      title: "Endless Creativity",
      description: "Build towers, sculptures, and imaginative structures with no limits."
    },
    {
      image: "/images/perfect-balance.jpg",
      title: "Perfect Balance",
      description: "Carefully weighted and shaped for optimal stacking and balancing challenges."
    }
  ];

  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-amber-600">RockStack Set</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover our handcrafted wooden stacking rocks set, designed to inspire creativity and learning through natural play.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-700">
              <div className="flex items-center">
                <Package className="h-5 w-5 text-amber-600 mr-2" />
                Free Amazon Shipping
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 text-amber-600 mr-2" />
                4.9/5 Customer Rating
              </div>
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-amber-600 mr-2" />
                Prime Delivery Available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Gallery */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Product Gallery</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See the craftsmanship and natural beauty that makes each RockStack set special.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {gallery.map((item, index) => (
              <div key={index} className="relative group">
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm opacity-90">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">RockStack Wooden Stacking Set</h2>
            <p className="text-lg text-gray-600">
              Our signature wooden stacking rocks set designed for creative play and learning.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white">
              <div className="lg:grid lg:grid-cols-2 lg:gap-0">
                {/* Product Image */}
                <div className="aspect-w-16 aspect-h-12 lg:aspect-none">
                  <img
                    src="/images/classic-set.jpg"
                    alt="RockStack Wooden Stacking Set"
                    className="w-full h-64 lg:h-full object-cover"
                  />
                </div>
                
                {/* Product Details */}
                <CardContent className="p-8 lg:p-12">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">RockStack Set</h3>
                    <span className="text-3xl lg:text-4xl font-bold text-amber-600">$29.99</span>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                    Our signature set of 12 handcrafted wooden stacking rocks in various sizes and natural wood tones. 
                    Perfect for developing creativity, balance, and motor skills through natural play.
                  </p>
                  
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4 text-lg">What's Included:</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mr-3 flex-shrink-0"></span>
                        12 unique wooden stacking pieces
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mr-3 flex-shrink-0"></span>
                        Premium storage bag included
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mr-3 flex-shrink-0"></span>
                        Suitable for ages 3 and up
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mr-3 flex-shrink-0"></span>
                        Natural wood finish, non-toxic
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mr-3 flex-shrink-0"></span>
                        Free shipping with Amazon Prime
                      </li>
                    </ul>
                  </div>

                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-lg py-4"
                  >
                    <a
                      href="https://amazon.com/your-store-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center"
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      Buy Now on Amazon
                    </a>
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Why Amazon Customers Love RockStack
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">4.9★</div>
              <p className="text-gray-600">Average Customer Rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">500+</div>
              <p className="text-gray-600">5-Star Reviews</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">98%</div>
              <p className="text-gray-600">Would Recommend</p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-amber-50 rounded-2xl">
            <blockquote className="text-lg text-gray-700 italic mb-4">
              "My 4-year-old plays with these every day! The quality is amazing and they've survived countless drops. 
              Great for developing problem-solving skills and keeping kids engaged without screens."
            </blockquote>
            <cite className="text-amber-700 font-medium">- Sarah M., Verified Amazon Purchase</cite>
          </div>
        </div>
      </section>
    </div>
  );
}