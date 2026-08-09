import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PhoneCall } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';

interface CTASectionProps {
  title?: string;
  subtitle?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  title = 'Ready to Move Your Logistics Operations Forward?',
  subtitle = "Contact our global freight specialists today for customized supply chain solutions, real-time rates, and reliable shipping.",
}) => {
  return (
    <section className="relative py-16 lg:py-20 bg-slate-900 text-white overflow-hidden border-t border-slate-800">
      {/* Background Subtle Gradient Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

      <Container className="relative z-10 text-center max-w-4xl">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 mb-4">
          Get Started Today
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          {title}
        </h2>
        <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/contact">
            <Button variant="accent" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Get a Free Quote
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-900" leftIcon={<PhoneCall className="w-5 h-5" />}>
              Speak to an Expert
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};
