import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Globe, Users, Target, Award, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            About Our Mission
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Empowering Change Through Collective Action
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            We're building a platform that connects passionate changemakers with impactful projects, 
            aligned with the United Nations Sustainable Development Goals to create a better world for all.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/projects">Explore Projects</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/create">Start a Campaign</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We believe in the power of collective action to address the world's most pressing challenges
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Compassion</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Every project on our platform is driven by genuine care for making a positive impact in the world.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Global Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We align with UN SDGs to ensure every contribution supports meaningful, measurable global progress.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Building strong communities of supporters, creators, and beneficiaries working together for change.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Purpose-Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Every feature and decision is made with the goal of maximizing positive impact and accessibility.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Clear reporting, open communication, and honest progress updates on every funded project.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Leveraging technology to make fundraising more effective, accessible, and impactful than ever.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SDG Alignment */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Aligned with UN Sustainable Development Goals</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our platform is designed to support all 17 UN SDGs, ensuring that every project contributes 
            to the global agenda for sustainable development by 2030.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {Array.from({ length: 17 }, (_, i) => (
              <div key={i + 1} className="aspect-square">
                <img
                  src={`/sdg-icons/sdg-${String(i + 1).padStart(2, '0')}.jpg`}
                  alt={`SDG ${i + 1}`}
                  className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
          <Button asChild>
            <Link to="/projects">Explore Projects</Link>
          </Button>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of changemakers who are already making an impact through our platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/create">Start Your Campaign</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/projects">Support Projects</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;