import { useNavigate } from 'react-router-dom';
import useScrollReveal from '../../hooks/useScrollReveal.js';

const CtaBanner = ({ bgImage }) => {
  const navigate = useNavigate();
  const sectionRef = useScrollReveal(0.2);

  return (
    <section
      ref={sectionRef}
      className="py-24 relative overflow-hidden bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      <div className="absolute inset-0 bg-black/70" />

      <div className="absolute top-0 left-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
        <div className="reveal">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">
            Exclusive Offer
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Ready to Experience{' '}
            <span className="shimmer-text">Luxury?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-10 leading-relaxed">
            Book your stay today and enjoy exclusive benefits, personalized service, and
            unforgettable memories.
          </p>
          <button
            onClick={() => navigate('/rooms')}
            className="btn-amber-glow pulse-gold bg-amber-600 hover:bg-amber-500 text-white font-bold px-12 py-4 rounded-xl text-lg shadow-xl"
          >
            Book Your Stay
          </button>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
