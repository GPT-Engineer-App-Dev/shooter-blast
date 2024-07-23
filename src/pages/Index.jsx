import React, { useState, useEffect } from 'react';
import { Crosshair, Shield, Zap, Heart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const NeoNexusShooter = () => {
  const [health, setHealth] = useState(100);
  const [ammo, setAmmo] = useState(30);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setHealth((prevHealth) => Math.max(prevHealth - 5, 0));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleShoot = () => {
    if (ammo > 0) {
      setAmmo((prevAmmo) => prevAmmo - 1);
      setScore((prevScore) => prevScore + Math.floor(Math.random() * 100) + 50);
      setMessage('Target hit!');
    } else {
      setMessage('Out of ammo! Reload!');
    }
  };

  const handleReload = () => {
    setAmmo(30);
    setMessage('Reloaded!');
  };

  return (
    <div className="h-screen bg-gray-900 text-cyan-300 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 animate-pulse">NeoNexus: The Digital Frontier</h1>
      
      <div className="relative w-full max-w-3xl h-96 bg-gray-800 rounded-lg overflow-hidden mb-8">
        <img src="/placeholder.svg" alt="Game View" className="mx-auto object-cover w-full h-full" />
        <Crosshair className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500" size={32} />
      </div>

      <div className="w-full max-w-3xl grid grid-cols-2 gap-4 mb-8">
        <div className="flex items-center">
          <Heart className="mr-2" />
          <Progress value={health} className="flex-grow" />
        </div>
        <div className="flex items-center">
          <Zap className="mr-2" />
          <Progress value={(ammo / 30) * 100} className="flex-grow" />
        </div>
      </div>

      <div className="flex space-x-4 mb-8">
        <Button onClick={handleShoot} className="bg-red-600 hover:bg-red-700">Fire</Button>
        <Button onClick={handleReload} className="bg-blue-600 hover:bg-blue-700">Reload</Button>
      </div>

      <div className="text-2xl mb-4">Score: {score}</div>

      {message && (
        <Alert className="mb-4">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="fixed bottom-4 left-4 text-sm">
        <p>Connected players: 1,337</p>
        <p>Server: Neo-Tokyo-42</p>
      </div>

      <div className="fixed top-4 right-4 flex items-center">
        <Shield className="mr-2" />
        <span>Firewall Integrity: 98%</span>
      </div>
    </div>
  );
};

export default NeoNexusShooter;