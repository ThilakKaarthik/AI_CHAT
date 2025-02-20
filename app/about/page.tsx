export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Page Title */}
        <h1 className="text-4xl font-bold mb-8">About ITC Code Assistant</h1>

        {/* Mission Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground mb-6">
            At ITC Code Assistant, we're revolutionizing the way developers write code. 
            Our mission is to empower developers with intelligent AI-driven solutions that 
            enhance productivity and code quality.
          </p>
        </section>

        {/* Unique Features Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">What Sets Us Apart</h2>
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Feature 1: Advanced AI Technology */}
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Advanced AI Technology</h3>
              <p className="text-muted-foreground">
                Our AI is trained on millions of code repositories, understanding context 
                and providing intelligent suggestions.
              </p>
            </div>

            {/* Feature 2: Real-Time Assistance */}
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Real-Time Assistance</h3>
              <p className="text-muted-foreground">
                Get instant help with coding questions, debugging, and best practices as you work.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <p className="text-lg text-muted-foreground mb-6">
            We're a team of passionate developers, AI researchers, and industry veterans 
            committed to creating the best coding assistant for developers worldwide.
          </p>
        </section>

      </div>
    </div>
  );
}
