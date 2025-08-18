import { Heart, Users, Zap, Award, Leaf, Shield, Baby, Brain, Lightbulb, MessageCircle, BookOpen, Gift } from 'lucide-react';

export default function About() {
  const stackingRocksBenefits = [
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "Cognitive Development",
      description: "Develops problem-solving, critical thinking, and logical reasoning skills that help in school and everyday life."
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-amber-600" />,
      title: "Ignites Creativity",
      description: "Children become mini architects, experimenting with shapes and sizes to create towers, bridges, and imaginative structures."
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-blue-600" />,
      title: "Communication Skills",
      description: "Encourages conversations, pattern discussions, and idea expression while playing with friends and family."
    },
    {
      icon: <Zap className="h-8 w-8 text-green-600" />,
      title: "Motor Skills Development",
      description: "Stacking and balancing rocks develops fine motor skills, hand-eye coordination, and spatial awareness."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
      title: "Storytelling & Imagination",
      description: "Each structure becomes a gateway to imaginary worlds filled with adventures and magical creatures."
    },
    {
      icon: <Users className="h-8 w-8 text-pink-600" />,
      title: "Family Bonding",
      description: "Perfect for all ages - siblings, parents, and grandparents can unite in creative play and storytelling."
    }
  ];

  const learningAspects = [
    {
      title: "Shapes & Colors",
      description: "Learn to identify and sort different shapes and colors while having fun",
      color: "bg-red-100 text-red-600"
    },
    {
      title: "Balance & Physics",
      description: "Understand weight distribution and balance through hands-on experimentation",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Pattern Recognition",
      description: "Develop pattern recognition skills through sorting and organizing activities",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Spatial Reasoning",
      description: "Enhance spatial awareness and 3D thinking through building challenges",
      color: "bg-purple-100 text-purple-600"
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
            <p className="text-2xl text-amber-700 font-semibold mb-4">
              Building young minds, one rock at a time.
            </p>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Ignite your child's imagination with our wooden sorting and stacking rocks! These toys are more than just fun – 
              they teach your child shapes and colors and develop their motor skills.
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

      {/* Cognitive Development Section */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Unleash Your Kids' <span className="text-purple-600">Cognitive Skills!</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Sorting and stacking rocks is not just a fun activity for children, but it also helps their brains grow smarter! 
              When they sort and stack rocks, they learn important thinking skills such as problem-solving, critical thinking, 
              and logical reasoning that will help them in school and in everyday life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningAspects.map((aspect, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
              >
                <div className={`w-12 h-12 ${aspect.color} rounded-lg flex items-center justify-center mb-4`}>
                  <span className="text-2xl font-bold">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{aspect.title}</h3>
                <p className="text-gray-600 text-sm">{aspect.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creativity Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="mt-8 lg:mt-0 order-2 lg:order-1">
              <img
                src="/images/endless-creativity.jpg"
                alt="Creative stacking structures"
                className="rounded-2xl shadow-xl w-full h-auto object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Ignite Their <span className="text-amber-600">Creativity!</span>
              </h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  Let your child's imagination run wild with our sorting and stacking rocks. With these toys, 
                  they can make tall towers, bridges, or even small homes. It's like being a mini architect!
                </p>
                <p>
                  They get to experiment with different shapes and sizes of rocks, figuring out how to balance 
                  them and make their creations solid. Every play session becomes an adventure in engineering 
                  and creative problem-solving.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Interaction Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Make Them a Center of <span className="text-blue-600">Joyful Interactions!</span>
              </h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  Motivate your child to sort and stack rocks with friends or family members. It's a fantastic way 
                  for them to engage in conversations, describe their actions, discuss patterns, and express their ideas.
                </p>
                <p>
                  They'll have a blast while enhancing their language and communication skills along the way! 
                  Watch as shy children become confident communicators through the joy of shared play.
                </p>
              </div>
            </div>
            <div className="mt-8 lg:mt-0">
              <img
                src="/images/kids-social-play.jpg"
                alt="Children playing together with stacking rocks"
                className="rounded-2xl shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Storytelling Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Rock Stacking and <span className="text-indigo-600">Storytelling</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Encourage your children to weave stories around their rock stacking creations. Each structure can become 
              a gateway to an imaginary world filled with adventures, magical creatures, and daring quests. By combining 
              storytelling with the art of rock stacking, kids will nurture their storytelling abilities, imagination, 
              and narrative skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Adventure Stories</h3>
              <p className="text-gray-600 text-sm">Transform towers into castles and bridges into pathways to magical lands</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Imagination Boost</h3>
              <p className="text-gray-600 text-sm">Every structure sparks new ideas and creative thinking</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Language Skills</h3>
              <p className="text-gray-600 text-sm">Develop vocabulary and narrative abilities through storytelling</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Stacking Rocks?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our wooden stacking rocks combine fun and learning in one beautiful, natural toy that grows with your child.
            </p>
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

      {/* Perfect Gift Section */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="h-10 w-10 text-amber-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            The Perfect Gift For Kids to Spark Creativity and Learning!
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Spark creativity and learning with the perfect gift for kids: rock stacking! It's fun, educational, 
            and fosters critical thinking and imaginative play. Build towers, bridges, and more while enhancing 
            communication and teamwork skills. Give the gift of endless fun and growth with rock stacking!
          </p>
        </div>
      </section>

      {/* Family Adventures Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Rock Stacking Adventures for <span className="text-green-600">3+ Ages</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-8">
              Who said rock stacking is just for kids? Embrace this enjoyable activity as a whole family! 
              Our stacking rocks are suitable for all ages, providing an excellent opportunity for siblings, 
              parents, and grandparents to come together and bond over shared experiences.
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Watch as generations unite in creative play and storytelling, creating cherished memories for years to come.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative group">
              <img
                src="/images/kids-building.jpg"
                alt="Multi-generational play with stacking rocks"
                className="rounded-2xl shadow-lg w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <p className="font-medium text-gray-900">Multi-Generational Fun</p>
                <p className="text-sm text-gray-600">Perfect for ages 3 to 103!</p>
              </div>
            </div>

            <div className="relative group">
              <img
                src="/images/focused-learning.jpg"
                alt="Family bonding through creative play"
                className="rounded-2xl shadow-lg w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <p className="font-medium text-gray-900">Creating Memories</p>
                <p className="text-sm text-gray-600">Bonding through shared creativity</p>
              </div>
            </div>
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
    </div>
  );
}