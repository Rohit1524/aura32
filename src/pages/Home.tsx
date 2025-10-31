import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Brain,
  TrendingUp,
  Calculator,
  FileText,
  Calendar,
  Shield,
  Zap,
  BarChart3,
  Users,
  Globe,
  Briefcase,
  DollarSign,
} from "lucide-react";
import heroImage from "@/assets/hero-business.jpg";

const Home = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Business Assistant",
      description: "Get instant answers on business strategy, planning, and operations powered by advanced AI",
      link: "/assistant",
    },
    {
      icon: FileText,
      title: "Business Plans",
      description: "Create comprehensive business plans with interactive templates and expert guidance",
      link: "/tools?tab=business-plan",
    },
    {
      icon: TrendingUp,
      title: "Market Research",
      description: "Analyze markets, competitors, and trends with AI-powered insights",
      link: "/tools?tab=market-research",
    },
    {
      icon: Shield,
      title: "SWOT Analysis",
      description: "Identify strengths, weaknesses, opportunities, and threats systematically",
      link: "/tools?tab=swot",
    },
    {
      icon: Calculator,
      title: "Financial Tools",
      description: "Budgeting, forecasting, cost analysis, and financial calculators",
      link: "/tools?tab=financial",
    },
    {
      icon: BarChart3,
      title: "Market Data",
      description: "Real-time commodity prices, stock data, and market indicators",
      link: "/market-data",
    },
    {
      icon: Users,
      title: "HR Management",
      description: "Employee management, labor law guidance, and organizational tools",
      link: "/tools?tab=hr",
    },
    {
      icon: Calendar,
      title: "Smart Scheduler",
      description: "AI-powered meeting scheduling with automatic notifications",
      link: "/scheduler",
    },
    {
      icon: Globe,
      title: "Digital Marketing",
      description: "Branding strategies, social media planning, and campaign optimization",
      link: "/tools?tab=marketing",
    },
    {
      icon: Briefcase,
      title: "Supply Chain",
      description: "Inventory management, logistics optimization, and SCM tools",
      link: "/tools?tab=supply-chain",
    },
    {
      icon: Zap,
      title: "Automation",
      description: "Cloud computing solutions and business process automation",
      link: "/tools?tab=automation",
    },
    {
      icon: DollarSign,
      title: "Funding & Risk",
      description: "Business funding strategies and comprehensive risk management",
      link: "/tools?tab=funding",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
                Your Complete Business Solution
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Transform Your Business with{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                AI-Powered Intelligence
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From strategic planning to daily operations, get comprehensive business assistance powered by cutting-edge AI technology. Everything you need to succeed, in one platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/assistant">
                <Button size="lg" className="text-lg px-8 h-14 shadow-lg hover:shadow-xl transition-all">
                  Start with AI Assistant
                  <Brain className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/tools">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                  Explore Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">Complete Business Toolkit</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to plan, manage, and grow your business efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link}>
                <Card className="p-6 h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="p-12 bg-gradient-to-br from-primary via-primary/90 to-accent text-white">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-4xl font-bold">
                Ready to Elevate Your Business?
              </h2>
              <p className="text-xl opacity-90">
                Join thousands of businesses using AI-powered tools to make smarter decisions and achieve faster growth.
              </p>
              <Link to="/assistant">
                <Button size="lg" variant="secondary" className="text-lg px-8 h-14 shadow-xl">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
