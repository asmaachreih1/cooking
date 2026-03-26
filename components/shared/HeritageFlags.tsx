"use client";

import { motion } from 'framer-motion';

const HeritageFlags = () => {
    // Generate a few instances of each flag with different positions and animations
    const flags = [
        { type: 'palestine', top: '10%', left: '5%', scale: 0.4, delay: 0 },
        { type: 'lebanon', top: '15%', left: '80%', scale: 0.35, delay: 2 },
        { type: 'palestine', top: '70%', left: '10%', scale: 0.3, delay: 4 },
        { type: 'lebanon', top: '80%', left: '70%', scale: 0.45, delay: 1 },
        { type: 'palestine', top: '40%', left: '15%', scale: 0.35, delay: 3 },
        { type: 'lebanon', top: '60%', left: '85%', scale: 0.3, delay: 5 },
        { type: 'palestine', top: '20%', left: '40%', scale: 0.25, delay: 6 },
        { type: 'lebanon', top: '50%', left: '30%', scale: 0.3, delay: 7 },
        { type: 'palestine', top: '85%', left: '50%', scale: 0.4, delay: 8 },
        { type: 'lebanon', top: '5%', left: '60%', scale: 0.35, delay: 9 },
        { type: 'palestine', top: '30%', left: '70%', scale: 0.3, delay: 10 },
        { type: 'lebanon', top: '90%', left: '20%', scale: 0.25, delay: 11 },
    ];

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {flags.map((flag, index) => (
                <motion.div
                    key={index}
                    initial={{ 
                        opacity: 0, 
                        y: flag.type === 'palestine' ? 100 : -100,
                        x: flag.type === 'palestine' ? -50 : 50 
                    }}
                    animate={{ 
                        opacity: 0.08, 
                        y: [0, -20, 0],
                        x: [0, 15, 0],
                    }}
                    transition={{ 
                        opacity: { duration: 1.5, delay: flag.delay },
                        y: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: flag.delay },
                        x: { duration: 12, repeat: Infinity, ease: "easeInOut", delay: flag.delay }
                    }}
                    style={{ 
                        top: flag.top, 
                        left: flag.left,
                        scale: flag.scale 
                    }}
                    className="absolute w-48 h-32"
                >
                    {flag.type === 'palestine' ? (
                        <div className="relative w-full h-full flex flex-col shadow-xl rounded-lg overflow-hidden opacity-90 rotate-[-10deg] border border-dark-brown/5">
                            <div className="bg-black h-1/3" />
                            <div className="bg-white h-1/3" />
                            <div className="bg-[#007A3D] h-1/3" />
                            <div 
                                className="absolute inset-y-0 left-0 w-1/2 bg-deep-red"
                                style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
                            />
                        </div>
                    ) : (
                        <div className="relative w-full h-full flex flex-col bg-white shadow-xl rounded-lg overflow-hidden border border-deep-red/10 rotate-[10deg]">
                            <div className="bg-deep-red h-[30%]" />
                            <div className="flex-1 flex items-center justify-center p-2 bg-white">
                                <svg viewBox="0 0 100 100" className="w-16 h-16 text-deep-green fill-current">
                                    <path d="M50 15 L62 30 L38 30 Z" />
                                    <path d="M50 25 L68 45 L32 45 Z" />
                                    <path d="M50 40 L75 65 L25 65 Z" />
                                    <path d="M50 60 L85 85 L15 85 Z" />
                                    <rect x="46" y="85" width="8" height="8" />
                                </svg>
                            </div>
                            <div className="bg-deep-red h-[30%]" />
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
};

export default HeritageFlags;
