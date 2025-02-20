"use client";

import { Button } from "@/components/button";
import { ArrowRight, Code2, Brain, Zap, Star } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/carousel";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const isLoggedIn = true;
  const [isVisible, setIsVisible] = useState(false);
  const featuresRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Code2 className="h-6 w-6" />,
      title: "Smart Code Generation",
      description:
        "Generate production-ready code with advanced AI understanding",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Context Awareness",
      description:
        "AI that understands your entire codebase and development context",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Solutions",
      description: "Get immediate answers to your programming questions",
    },
  ];

  const reviews = [
    {
      name: "Sunil Kumar",
      role: "Senior Developer",
      content:
        "This tool has revolutionized my development workflow. The code suggestions are incredibly accurate.",
      avatar: "./images/sunil.jpg",
      rating: 5,
    },
    {
      name: "Madhavan",
      role: "Full Stack Engineer",
      content:
        "The AI understanding is remarkable. It's like having a senior developer always by your side.",
      avatar: "./images/madhavan.jpg",
      rating: 5,
    },
    {
      name: "Pavithran",
      role: "Tech Lead",
      content:
        "We've integrated this into our team's workflow and seen massive productivity gains.",
      avatar: "./images/pavithran.jpg",
      rating: 5,
    },
    {
      name: "Bhanuprakash",
      role: "Software Architect",
      content:
        "The context-aware suggestions have helped us maintain consistent code quality across our entire team.",
      avatar: "./images/bhanuprakash.jpg",
      rating: 5,
    },
    {
      name: "Patmesh",
      role: "Frontend Developer",
      content:
        "The real-time pair programming experience with AI is simply amazing. It's transformed how I write code.",
      avatar: "./images/patmesh.jpg",
      rating: 5,
    },
  ];

  const capabilities = [
    {
      title: "Multi-Language Support",
      description: "Support for all major programming languages and frameworks",
    },
    {
      title: "Real-time Collaboration",
      description: "Work seamlessly with AI in your development environment",
    },
    {
      title: "Code Review Assistant",
      description: "Get instant feedback on your code quality and suggestions",
    },
    {
      title: "Documentation Generator",
      description: "Automatically generate comprehensive documentation",
    },
    {
      title: "Test Case Generation",
      description: "Create test cases with AI-powered assistance",
    },
  ];

  const ProgressBar = () => {
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
    
    return (
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ProgressBar />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-20 relative overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-yellow-600"
            >
              Your AI Programming Assistant
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-xl text-muted-foreground mb-8"
            >
              Write better code faster with AI-powered suggestions and solutions
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex gap-4 justify-center"
            >
              {!isLoggedIn && (
                <div className="flex gap-4 justify-center">
                  <Link href="/register">
                    <Button size="lg" className="gap-2">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Capabilities Carousel */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-white dark:bg-gray-900"
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-600 gradient-text"
          >
            What We Offer
          </motion.h2>
          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              {capabilities.map((capability, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)"
                    }}
                    viewport={{ once: true }}
                    className="p-6 rounded-lg border bg-card h-full transform transition-all duration-300"
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      {capability.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {capability.description}
                    </p>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        ref={featuresRef}
        className="py-20 bg-gray-50 dark:bg-gray-800"
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-600 gradient-text"
          >
            Powerful Features
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)"
                }}
                className="p-6 rounded-lg border bg-card relative overflow-hidden"
              >
                <div className="mb-4 text-primary glow-effect">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Reviews Carousel */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-white dark:bg-gray-900"
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-600 gradient-text"
          >
            What Developers Say
          </motion.h2>
          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              {reviews.map((review, index) => (
                <CarouselItem key={index} className="md:basis-1/2">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-lg border bg-card h-full"
                  >
                    <div className="flex items-center mb-4">
                      <motion.img
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        src={review.avatar}
                        alt={review.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-semibold">{review.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {review.role}
                        </p>
                      </div>
                    </div>
                    <p className="mb-4">{review.content}</p>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                        >
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </motion.section>
    </div>
  );
}