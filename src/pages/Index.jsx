import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 20;
const INVADER_WIDTH = 40;
const INVADER_HEIGHT = 30;
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 10;

const CyberDefenders = () => {
  const [gameState, setGameState] = useState('start');
  const [player, setPlayer] = useState({ x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2, y: GAME_HEIGHT - PLAYER_HEIGHT - 10 });
  const [invaders, setInvaders] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const initializeInvaders = () => {
    const newInvaders = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 8; j++) {
        newInvaders.push({
          x: j * (INVADER_WIDTH + 20) + 50,
          y: i * (INVADER_HEIGHT + 20) + 50,
        });
      }
    }
    setInvaders(newInvaders);
  };

  const movePlayer = useCallback((e) => {
    if (gameState !== 'playing') return;
    const newX = e.clientX - PLAYER_WIDTH / 2;
    setPlayer(prev => ({ ...prev, x: Math.max(0, Math.min(newX, GAME_WIDTH - PLAYER_WIDTH)) }));
  }, [gameState]);

  const shoot = useCallback(() => {
    if (gameState !== 'playing') return;
    setBullets(prev => [...prev, { x: player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2, y: player.y }]);
  }, [gameState, player]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    initializeInvaders();
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      // Move invaders
      setInvaders(prev => prev.map(invader => ({ ...invader, y: invader.y + 1 })));

      // Move bullets
      setBullets(prev => prev.map(bullet => ({ ...bullet, y: bullet.y - 5 })).filter(bullet => bullet.y > 0));

      // Check collisions
      setBullets(prev => {
        const newBullets = [...prev];
        setInvaders(prevInvaders => {
          const newInvaders = prevInvaders.filter(invader => {
            const hitByBullet = newBullets.some(bullet => 
              bullet.x < invader.x + INVADER_WIDTH &&
              bullet.x + BULLET_WIDTH > invader.x &&
              bullet.y < invader.y + INVADER_HEIGHT &&
              bullet.y + BULLET_HEIGHT > invader.y
            );
            if (hitByBullet) {
              setScore(s => s + 10);
            }
            return !hitByBullet;
          });
          return newInvaders;
        });
        return newBullets.filter(bullet => 
          !invaders.some(invader => 
            bullet.x < invader.x + INVADER_WIDTH &&
            bullet.x + BULLET_WIDTH > invader.x &&
            bullet.y < invader.y + INVADER_HEIGHT &&
            bullet.y + BULLET_HEIGHT > invader.y
          )
        );
      });

      // Check game over conditions
      if (invaders.some(invader => invader.y + INVADER_HEIGHT >= player.y)) {
        setLives(prev => prev - 1);
        if (lives <= 1) {
          setGameState('gameover');
        } else {
          initializeInvaders();
        }
      }
      if (invaders.length === 0) {
        setGameState('win');
      }
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameState, invaders, bullets, player.y, lives]);

  useEffect(() => {
    window.addEventListener('mousemove', movePlayer);
    window.addEventListener('click', shoot);
    return () => {
      window.removeEventListener('mousemove', movePlayer);
      window.removeEventListener('click', shoot);
    };
  }, [movePlayer, shoot]);

  return (
    <div className="h-screen bg-gray-900 text-cyan-300 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 animate-pulse">Cyber Defenders: Neon Invasion</h1>
      
      <div className="relative w-[800px] h-[600px] bg-gray-800 rounded-lg overflow-hidden mb-8">
        {gameState === 'start' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-3xl mb-4">Ready to defend the cyberspace?</h2>
            <Button onClick={startGame} className="bg-cyan-600 hover:bg-cyan-700">Start Game</Button>
          </div>
        )}
        {gameState === 'playing' && (
          <>
            <div className="absolute" style={{ left: player.x, top: player.y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT, backgroundColor: 'cyan' }} />
            {invaders.map((invader, index) => (
              <div key={index} className="absolute bg-red-500" style={{ left: invader.x, top: invader.y, width: INVADER_WIDTH, height: INVADER_HEIGHT }} />
            ))}
            {bullets.map((bullet, index) => (
              <div key={index} className="absolute bg-yellow-300" style={{ left: bullet.x, top: bullet.y, width: BULLET_WIDTH, height: BULLET_HEIGHT }} />
            ))}
          </>
        )}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-3xl mb-4">Game Over</h2>
            <p className="mb-4">Final Score: {score}</p>
            <Button onClick={startGame} className="bg-cyan-600 hover:bg-cyan-700">Play Again</Button>
          </div>
        )}
        {gameState === 'win' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-3xl mb-4">You Saved the Cyberspace!</h2>
            <p className="mb-4">Final Score: {score}</p>
            <Button onClick={startGame} className="bg-cyan-600 hover:bg-cyan-700">Play Again</Button>
          </div>
        )}
      </div>

      <div className="w-[800px] flex justify-between mb-4">
        <div className="flex items-center">
          <Shield className="mr-2" />
          <span>Lives: {lives}</span>
        </div>
        <div className="text-2xl">Score: {score}</div>
        <div className="flex items-center">
          <Zap className="mr-2" />
          <span>Firewall Integrity: 100%</span>
        </div>
      </div>

      <Alert className="w-[800px]">
        <AlertDescription>
          Move your mouse to control the defender. Click to shoot. Protect the cyberspace from the neon invaders!
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default CyberDefenders;