import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { buttonStyles } from '../lib/utils/buttonStyles';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="shell flex min-h-[60vh] flex-col justify-center py-24">
      <p className="font-mono text-micro uppercase text-ink-3">Hata 404</p>

      <h1 className="mt-5 text-h1 text-ink">Bu sayfa mevcut değil.</h1>

      <p className="measure mt-5 text-lead text-ink-2">
        Aradığınız içerik taşınmış ya da hiç var olmamış olabilir.
      </p>

      <div className="mt-10">
        <Link to="/" className={buttonStyles('primary', 'md')}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Ana sayfaya dön</span>
        </Link>
      </div>
    </div>
  );
};
