import { Link } from "react-router-dom";
import { Shield, Lock, Users, TrendingUp, Zap, Globe, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/hero-escrow.jpg";
import securityGraphic from "@/assets/security-graphic.png";
import collaborationGraphic from "@/assets/collaboration-graphic.png";
import fastPaymentGraphic from "@/assets/fast-payment-graphic.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-green-lighter/10 to-background overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-light/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-dark/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-green/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="border-b border-green-lighter/50 bg-background/95 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-green/5">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-green blur-lg opacity-50 rounded-full animate-pulse" />
              <Shield className="h-9 w-9 text-green relative" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-green via-green-dark to-green-darker bg-clip-text text-transparent">
              Emagn
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-green transition-all font-medium relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green transition-all group-hover:w-full" />
            </Link>
            <Link to="/features" className="text-foreground hover:text-green transition-all font-medium relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green transition-all group-hover:w-full" />
            </Link>
            <Link to="/pricing" className="text-foreground hover:text-green transition-all font-medium relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green transition-all group-hover:w-full" />
            </Link>
            <Link to="/api" className="text-foreground hover:text-green transition-all font-medium relative group">
              API
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green transition-all group-hover:w-full" />
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/signin">
              <Button variant="ghost" className="hover:bg-green-lighter/50 hover:text-green-darker">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-green via-green-dark to-green-darker hover:opacity-90 shadow-lg shadow-green/30 relative overflow-hidden group">
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-lighter to-green opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(22,163,74,0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 z-10">
              <div className="inline-block animate-fade-in">
                <span className="bg-gradient-to-r from-green-lighter to-green-light text-green-darker px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-green/20 border border-green-light/50">
                  ✨ Trusted by 10,000+ Businesses Worldwide
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-extrabold leading-[1.1] animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <span className="bg-gradient-to-r from-green via-green-dark to-green-darker bg-clip-text text-transparent drop-shadow-2xl">
                  Secure Escrow
                </span>
                <br />
                <span className="text-foreground">Made Simple</span>
              </h1>
              <p className="text-2xl text-muted-foreground max-w-xl leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Trust-based platform connecting buyers, sellers, and brokers with <span className="text-green-dark font-semibold">complete financial security</span> and transparency.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 pt-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Link to="/transaction/create">
                  <Button size="lg" className="bg-gradient-to-r from-green to-green-dark hover:from-green-dark hover:to-green-darker shadow-2xl shadow-green/40 text-lg px-10 py-7 group relative overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2 font-bold">
                      Start Transaction
                      <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-light to-green opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
                <Link to="/api">
                  <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2 border-green-dark hover:bg-green-lighter/50 hover:border-green font-bold group">
                    <span className="flex items-center gap-2">
                      Explore API
                      <Globe className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    </span>
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-8 pt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-green rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">No Setup Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-green rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">Bank-Level Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-green rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">24/7 Support</span>
                </div>
              </div>
            </div>
            <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="absolute -inset-4 bg-gradient-to-r from-green-light/40 via-green/40 to-green-dark/40 rounded-[2rem] blur-3xl animate-pulse" />
              <div className="absolute -inset-2 bg-gradient-to-br from-green/20 to-green-darker/20 rounded-[2rem] blur-2xl" />
              <img 
                src={heroImage} 
                alt="Secure escrow platform dashboard" 
                className="relative rounded-[2rem] shadow-2xl shadow-green/30 border-4 border-green-lighter/50 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-green to-green-dark text-white px-8 py-4 rounded-2xl shadow-2xl shadow-green/50 border border-green-light">
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-sm opacity-90">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="container mx-auto px-4 py-12 relative z-10">
        <div className="bg-gradient-to-r from-green-lighter/40 via-green-light/30 to-green-lighter/40 rounded-3xl p-12 border-2 border-green-light/50 shadow-2xl shadow-green/10 backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group hover:scale-110 transition-transform">
              <div className="text-5xl font-black bg-gradient-to-br from-green to-green-darker bg-clip-text text-transparent">$2.5B+</div>
              <div className="text-muted-foreground mt-3 font-semibold">Secured Volume</div>
            </div>
            <div className="group hover:scale-110 transition-transform">
              <div className="text-5xl font-black bg-gradient-to-br from-green to-green-darker bg-clip-text text-transparent">10K+</div>
              <div className="text-muted-foreground mt-3 font-semibold">Active Users</div>
            </div>
            <div className="group hover:scale-110 transition-transform">
              <div className="text-5xl font-black bg-gradient-to-br from-green to-green-darker bg-clip-text text-transparent">99.9%</div>
              <div className="text-muted-foreground mt-3 font-semibold">Uptime</div>
            </div>
            <div className="group hover:scale-110 transition-transform">
              <div className="text-5xl font-black bg-gradient-to-br from-green to-green-darker bg-clip-text text-transparent">24/7</div>
              <div className="text-muted-foreground mt-3 font-semibold">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-lighter/5 to-transparent" />
        <div className="text-center mb-20 relative z-10">
          <div className="inline-block mb-4">
            <span className="text-green font-bold text-sm tracking-wider uppercase">Features</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-green via-green-dark to-green-darker bg-clip-text text-transparent">
              Why Choose Emagn?
            </span>
          </h2>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Enterprise-grade security meets <span className="text-green-dark font-semibold">seamless user experience</span>
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10 relative z-10">
          <Card className="border-2 border-green-lighter hover:border-green transition-all duration-500 hover:shadow-2xl hover:shadow-green/20 group bg-gradient-to-br from-background via-green-lighter/10 to-background hover:-translate-y-2 backdrop-blur-sm">
            <CardContent className="pt-10 text-center space-y-6">
              <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="absolute inset-0 bg-green/20 rounded-3xl blur-xl group-hover:bg-green/30 transition-all" />
                <img src={securityGraphic} alt="Secure escrow" className="relative w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-3xl font-black text-green-darker">Secure Escrow</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Funds held safely until all conditions are met. Complete protection for both parties with <span className="text-green-dark font-semibold">bank-level encryption</span>.
              </p>
              <div className="pt-4">
                <div className="inline-flex items-center gap-2 text-green-dark font-semibold group-hover:gap-3 transition-all">
                  Learn more <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-lighter hover:border-green transition-all duration-500 hover:shadow-2xl hover:shadow-green/20 group bg-gradient-to-br from-background via-green-lighter/10 to-background hover:-translate-y-2 backdrop-blur-sm">
            <CardContent className="pt-10 text-center space-y-6">
              <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="absolute inset-0 bg-green/20 rounded-3xl blur-xl group-hover:bg-green/30 transition-all" />
                <img src={collaborationGraphic} alt="Multi-party support" className="relative w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-3xl font-black text-green-darker">Multi-Party Support</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Buyers, sellers, and brokers work seamlessly with <span className="text-green-dark font-semibold">automated commission handling</span> and transparent workflows.
              </p>
              <div className="pt-4">
                <div className="inline-flex items-center gap-2 text-green-dark font-semibold group-hover:gap-3 transition-all">
                  Learn more <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-lighter hover:border-green transition-all duration-500 hover:shadow-2xl hover:shadow-green/20 group bg-gradient-to-br from-background via-green-lighter/10 to-background hover:-translate-y-2 backdrop-blur-sm">
            <CardContent className="pt-10 text-center space-y-6">
              <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-green-light to-green-dark rounded-3xl blur-xl group-hover:scale-110 transition-transform" />
                <div className="relative w-full h-full bg-gradient-to-br from-green-light to-green-dark rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl">
                  <TrendingUp className="h-14 w-14 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-green-darker">Real-Time Tracking</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Monitor your transactions with <span className="text-green-dark font-semibold">live updates</span> and instant notifications. Stay informed every step.
              </p>
              <div className="pt-4">
                <div className="inline-flex items-center gap-2 text-green-dark font-semibold group-hover:gap-3 transition-all">
                  Learn more <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-lighter hover:border-green transition-all duration-500 hover:shadow-2xl hover:shadow-green/20 group bg-gradient-to-br from-background via-green-lighter/10 to-background hover:-translate-y-2 backdrop-blur-sm">
            <CardContent className="pt-10 text-center space-y-6">
              <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="absolute inset-0 bg-green/20 rounded-3xl blur-xl group-hover:bg-green/30 transition-all" />
                <img src={fastPaymentGraphic} alt="Fast settlement" className="relative w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-3xl font-black text-green-darker">Fast Settlement</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Quick release of funds once delivery is confirmed. <span className="text-green-dark font-semibold">No delays, no hassle</span>. Get paid faster.
              </p>
              <div className="pt-4">
                <div className="inline-flex items-center gap-2 text-green-dark font-semibold group-hover:gap-3 transition-all">
                  Learn more <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-lighter hover:border-green transition-all duration-500 hover:shadow-2xl hover:shadow-green/20 group bg-gradient-to-br from-background via-green-lighter/10 to-background hover:-translate-y-2 backdrop-blur-sm">
            <CardContent className="pt-10 text-center space-y-6">
              <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-green-light to-green-dark rounded-3xl blur-xl group-hover:scale-110 transition-transform" />
                <div className="relative w-full h-full bg-gradient-to-br from-green-light to-green-dark rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl">
                  <Globe className="h-14 w-14 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-green-darker">API Integration</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Seamlessly integrate escrow services into your platform with our <span className="text-green-dark font-semibold">robust and well-documented API</span>.
              </p>
              <div className="pt-4">
                <div className="inline-flex items-center gap-2 text-green-dark font-semibold group-hover:gap-3 transition-all">
                  Learn more <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-lighter hover:border-green transition-all duration-500 hover:shadow-2xl hover:shadow-green/20 group bg-gradient-to-br from-background via-green-lighter/10 to-background hover:-translate-y-2 backdrop-blur-sm">
            <CardContent className="pt-10 text-center space-y-6">
              <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-green-light to-green-dark rounded-3xl blur-xl group-hover:scale-110 transition-transform" />
                <div className="relative w-full h-full bg-gradient-to-br from-green-light to-green-dark rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl">
                  <Shield className="h-14 w-14 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-green-darker">Dispute Resolution</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Professional legal team ready to resolve conflicts <span className="text-green-dark font-semibold">fairly and efficiently</span> with proven track record.
              </p>
              <div className="pt-4">
                <div className="inline-flex items-center gap-2 text-green-dark font-semibold group-hover:gap-3 transition-all">
                  Learn more <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="relative overflow-hidden rounded-[2rem]">
          <div className="absolute inset-0 bg-gradient-to-r from-green via-green-dark to-green-darker" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          <Card className="bg-transparent border-0 shadow-2xl shadow-green-darker/50 relative">
            <CardContent className="pt-20 pb-20 text-center space-y-10">
              <h2 className="text-5xl md:text-7xl font-black text-primary-foreground leading-tight">
                Ready to Start Your<br />First Transaction?
              </h2>
              <p className="text-2xl text-primary-foreground/95 max-w-3xl mx-auto leading-relaxed font-medium">
                Join thousands of businesses who trust Emagn for secure escrow services.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center mt-10">
                <Link to="/signup">
                  <Button size="lg" className="text-xl px-12 py-8 bg-white hover:bg-white/95 text-green-darker font-black shadow-2xl hover:scale-105 transition-transform">
                    Create Free Account
                  </Button>
                </Link>
                <Link to="/api">
                  <Button size="lg" className="text-xl px-12 py-8 border-3 border-white text-white hover:bg-white/20 font-bold backdrop-blur-sm">
                    View Documentation
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap justify-center gap-8 pt-8 text-primary-foreground/90">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6" />
                  <span className="font-semibold">Free Forever Plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6" />
                  <span className="font-semibold">No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6" />
                  <span className="font-semibold">Setup in 2 Minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-lighter/50 bg-gradient-to-b from-background to-green-lighter/10 backdrop-blur-xl mt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-green blur-md opacity-50 rounded-full" />
                <Shield className="h-8 w-8 text-green relative" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-green via-green-dark to-green-darker bg-clip-text text-transparent">Emagn</span>
            </div>
            <p className="text-muted-foreground font-medium">
              © 2025 Emagn. All rights reserved. Secure escrow platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
