import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { io, Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Paper, Typography, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import LogoutIcon from '@mui/icons-material/Logout';
import InfoIcon from '@mui/icons-material/Info';

interface Player {
  id: string;
  username: string;
  color: string;
  position: { x: number; y: number };
}

interface GameScene extends Phaser.Scene {
  players: Map<string, Phaser.GameObjects.Sprite>;
  player: Phaser.GameObjects.Sprite;
  socket: Socket;
  username: string;
  color: string;
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

function preload(this: Phaser.Scene) {
  // Load game assets
  this.load.image('ground', 'assets/platform.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('player_red', 'assets/player_red.png');
  this.load.image('player_blue', 'assets/player_blue.png');
  this.load.image('player_green', 'assets/player_green.png');
  this.load.image('player_yellow', 'assets/player_yellow.png');
}

function create(this: GameScene) {
  // Initialize players map
  this.players = new Map();

  // Add platforms
  const platforms = this.add.group();
  const ground = this.add.rectangle(400, 580, 800, 40, 0x00ff00);
  platforms.add(ground);

  // Add walls
  const leftWall = this.add.rectangle(0, 300, 40, 600, 0x00ff00);
  const rightWall = this.add.rectangle(760, 300, 40, 600, 0x00ff00);
  platforms.add(leftWall);
  platforms.add(rightWall);

  // Add local player
  const player = this.add.sprite(400, 300, `player_${this.color}`);
  this.physics.add.existing(player);
  if (player.body instanceof Phaser.Physics.Arcade.Body) {
    player.body.setCollideWorldBounds(true);
    player.body.setBounce(0.2);
    player.body.setSize(32, 32);
  }

  // Add collision between player and platforms
  this.physics.add.collider(player, platforms);

  // Store player reference
  this.player = player;

  // Setup camera to follow player
  this.cameras.main.startFollow(player);
  this.cameras.main.setBounds(0, 0, 800, 600);

  // Setup socket connection
  const socket = io('http://localhost:5000');
  this.socket = socket;

  // Join the game
  socket.emit('playerJoin', {
    username: this.username,
    color: this.color
  });

  // Handle other players joining
  socket.on('playerJoined', (data: Player) => {
    if (data.id !== socket.id) {
      const otherPlayer = this.add.sprite(data.position.x, data.position.y, `player_${data.color}`);
      this.physics.add.existing(otherPlayer);
      if (otherPlayer.body instanceof Phaser.Physics.Arcade.Body) {
        otherPlayer.body.setCollideWorldBounds(true);
        otherPlayer.body.setBounce(0.2);
        otherPlayer.body.setSize(32, 32);
      }
      this.players.set(data.id, otherPlayer);
    }
  });

  // Handle other players moving
  socket.on('playerMoved', (data: { id: string; position: { x: number; y: number } }) => {
    if (data.id !== socket.id) {
      const otherPlayer = this.players.get(data.id);
      if (otherPlayer) {
        otherPlayer.x = data.position.x;
        otherPlayer.y = data.position.y;
      }
    }
  });

  // Handle player disconnection
  socket.on('playerDisconnected', (playerId: string) => {
    const disconnectedPlayer = this.players.get(playerId);
    if (disconnectedPlayer) {
      disconnectedPlayer.destroy();
      this.players.delete(playerId);
    }
  });
}

function update(this: GameScene) {
  const player = this.player;
  const cursors = this.input.keyboard?.createCursorKeys();
  if (!cursors || !(player.body instanceof Phaser.Physics.Arcade.Body)) return;

  // Player movement
  if (cursors.left.isDown) {
    player.body.setVelocityX(-160);
    player.setFlipX(true);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(160);
    player.setFlipX(false);
  } else {
    player.body.setVelocityX(0);
  }

  if (cursors.up.isDown) {
    player.body.setVelocityY(-160);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(160);
  } else {
    player.body.setVelocityY(0);
  }

  // Emit player position to server
  if (this.socket) {
    this.socket.emit('playerMove', {
      position: {
        x: player.x,
        y: player.y
      }
    });
  }
}

export function GameScene() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const navigate = useNavigate();
  const [showControls, setShowControls] = useState(false);
  const [username] = useState(() => `Player${Math.floor(Math.random() * 1000)}`);
  const [color] = useState(() => {
    const colors = ['red', 'blue', 'green', 'yellow'];
    return colors[Math.floor(Math.random() * colors.length)];
  });

  useEffect(() => {
    if (!gameRef.current) {
      // Extend the config with player info
      const gameConfig = {
        ...config,
        scene: {
          ...config.scene,
          username,
          color
        }
      };
      gameRef.current = new Phaser.Game(gameConfig);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [username, color]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <div 
        id="game-container" 
        style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }} 
      />
      
      {/* Game UI Overlay */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        pointerEvents: 'none',
        zIndex: 1000
      }}>
        {/* Top Bar */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2,
          pointerEvents: 'auto'
        }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper 
              elevation={3} 
              sx={{ 
                p: 1, 
                display: 'flex', 
                alignItems: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <IconButton 
                color="primary" 
                onClick={() => setShowControls(!showControls)}
                size="small"
              >
                <InfoIcon />
              </IconButton>
              <Typography variant="body2" sx={{ ml: 1 }}>
                {username} ({color})
              </Typography>
            </Paper>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: 2,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
              }}
            >
              Logout
            </Button>
          </motion.div>
        </Box>

        {/* Controls Info */}
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Paper 
              elevation={3} 
              sx={{ 
                p: 2, 
                maxWidth: 300,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography variant="h6" gutterBottom>
                Controls
              </Typography>
              <Typography variant="body2" paragraph>
                Use arrow keys to move your character
              </Typography>
              <Typography variant="body2">
                Interact with other players in real-time
              </Typography>
            </Paper>
          </motion.div>
        )}
      </Box>
    </Box>
  );
} 