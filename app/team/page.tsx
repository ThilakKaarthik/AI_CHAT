export default function TeamPage() {
  // Team data - Array containing information about team members
  const team = [
    {
      name: "Jahnavi",
      role: "Associate IT Consultant",
      image: "/images/jahnavi.jpg", 
      description: "Leading innovation in AI-powered development solutions."
    },
    {
      name: "Thilak Kaarthik",
      role: "Associate IT Consultant",
      image: "/images/thilak.jpg",
      description: "Expert in AI architecture and system design."
    },
    {
      name: "Senthurvel",
      role: "Associate IT Consultant",
      image: "/images/senthuravel.jpg",
      description: "Specializing in AI model development and optimization."
    },
    {
      name: "Gowtham",
      role: "Associate IT Consultant",
      image: "/images/gowtham.jpg",
      description: "Machine learning expert and algorithm specialist."
    },
    {
      name: "Jeeva",
      role: "Associate IT Consultant",
      image: "/images/jeeva.jpg",
      description: "Driving product strategy and user experience."
    }
  ];

  // Main function to render the TeamPage component
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl font-bold mb-8 text-center">Our Team</h1>

        {/* Page Description */}
        <p className="text-xl text-muted-foreground text-center mb-12">
          Meet the experts behind ITC Code Assistant
        </p>
        
        {/* Grid layout for team members */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Map through team array and display each member's card */}
          {team.map((member) => (
            <div key={member.name} className="p-6 border rounded-lg bg-card hover:shadow-lg transition-shadow text-center">
              {/* Member Image */}
              <div className="flex justify-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>
              
              {/* Member Name */}
              <h2 className="text-xl font-semibold text-center mt-4">{member.name}</h2>
              
              {/* Member Role */}
              <p className="text-center text-muted-foreground mb-2">{member.role}</p>
              
              {/* Member Description */}
              <p className="text-muted-foreground text-center">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
