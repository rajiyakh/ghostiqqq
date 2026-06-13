import React from 'react';
import { Ghost, ghosts, DoodleStar, DoodleHeart, Squiggle, DoodleGhost } from './MonsterSVG';

interface HomePageProps {
  onEnter: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onEnter }) => {
  const ghostPositions = [
    { top: '5%', left: '5%', float: 'monster-float-1', size: 80, rotate: -10 },
    { top: '8%', left: '75%', float: 'monster-float-2', size: 90, rotate: 15 },
    { top: '25%', left: '15%', float: 'monster-float-3', size: 70, rotate: -5 },
    { top: '20%', left: '85%', float: 'monster-float-1', size: 65, rotate: 20 },
    { top: '45%', left: '3%', float: 'monster-float-2', size: 85, rotate: -15 },
    { top: '50%', left: '90%', float: 'monster-float-3', size: 75, rotate: 10 },
    { top: '70%', left: '8%', float: 'monster-float-1', size: 60, rotate: -20 },
    { top: '65%', left: '80%', float: 'monster-float-2', size: 70, rotate: 5 },
    { top: '85%', left: '20%', float: 'monster-float-3', size: 55, rotate: -8 },
    { top: '88%', left: '65%', float: 'monster-float-1', size: 65, rotate: 12 },
    { top: '35%', left: '50%', float: 'monster-float-2', size: 50, rotate: -3 },
    { top: '60%', left: '45%', float: 'monster-float-3', size: 45, rotate: 7 },
  ];

  return (
    <div className="relative min-h-screen bg-cream overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, #2D2D2D 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }} />
      </div>

      {/* Scattered ghosts */}
      {ghostPositions.map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos.float} pointer-events-none`}
          style={{
            top: pos.top,
            left: pos.left,
            transform: `rotate(${pos.rotate}deg)`,
          }}
        >
          <Ghost
            color={ghosts[i].color}
            expression={ghosts[i].expression}
            size={pos.size}
          />
        </div>
      ))}

      {/* Decorative elements */}
      <DoodleStar className="absolute top-[12%] left-[30%] animate-float" size={30} />
      <DoodleStar className="absolute top-[40%] left-[10%] animate-bounce-slow" size={20} />
      <DoodleStar className="absolute bottom-[20%] right-[15%] animate-float" size={25} />
      <DoodleHeart className="absolute top-[18%] right-[25%] animate-bounce-slow" size={22} />
      <DoodleHeart className="absolute bottom-[30%] left-[25%] animate-float" size={18} />
      <DoodleHeart className="absolute top-[55%] right-[8%] animate-bounce-slow" size={28} />
      <DoodleGhost className="absolute top-[42%] left-[65%] animate-float opacity-30" size={20} color="#4ECDC4" />
      <DoodleGhost className="absolute top-[15%] left-[55%] animate-bounce-slow opacity-25" size={14} color="#FF8C42" />

      <Squiggle className="absolute top-[30%] left-[40%] opacity-20" />
      <Squiggle className="absolute bottom-[15%] left-[35%] opacity-15 rotate-12" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Title */}
        <div className="text-center mb-8 animate-sketch-in">
          <h1 className="font-cartoon text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-sketch tracking-wider mb-2"
            style={{ textShadow: '3px 3px 0px rgba(45,45,45,0.2)' }}>
            GHOSTIQ
          </h1>
          <div className="flex items-center justify-center gap-3">
            <DoodleGhost size={28} color="#A78BFA" />
            <h2 className="font-hand text-2xl sm:text-3xl md:text-4xl text-sketch-light tracking-wide">
              World
            </h2>
            <DoodleGhost size={28} color="#4ECDC4" />
          </div>
        </div>

        {/* Subtitle */}
        <p className="font-hand text-lg sm:text-xl text-sketch-light mb-10 animate-slide-up text-center max-w-md">
          Complete quests, earn rewards, and join the GHOSTIQ community!
        </p>

        {/* Enter button */}
        <button
          onClick={onEnter}
          className="btn-gloob px-10 py-5 sm:px-14 sm:py-6 text-2xl sm:text-3xl md:text-4xl text-sketch
                     hover:bg-gloob-yellow/90 animate-pop cursor-pointer
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#2D2D2D]"
        >
          Enter GHOSTIQ World
        </button>

        {/* Bottom doodle ghosts */}
        <div className="absolute bottom-6 flex gap-4 opacity-40">
          {ghosts.slice(0, 5).map((g, i) => (
            <Ghost
              key={i}
              color={g.color}
              expression={g.expression}
              size={35}
              className={i % 2 === 0 ? 'monster-float-1' : 'monster-float-2'}
            />
          ))}
        </div>

        {/* Admin link */}
        <a
          href="#admin"
          className="absolute bottom-3 right-3 font-hand text-xs text-sketch/20 hover:text-sketch/50 transition-colors"
        >
          admin
        </a>
      </div>
    </div>
  );
};

export default HomePage;
