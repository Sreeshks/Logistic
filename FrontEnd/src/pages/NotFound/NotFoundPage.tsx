import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-24 bg-slate-50 min-h-[70vh] flex items-center justify-center">
      <Container className="text-center max-w-lg">
        <span className="text-8xl font-black text-slate-300 block mb-4">404</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Page Not Found</h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          The logistics page or resource you requested could not be located. It may have been moved, renamed, or deleted.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link to="/">
            <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
          <button onClick={() => window.history.back()}>
            <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Previous Page
            </Button>
          </button>
        </div>
      </Container>
    </div>
  );
};
