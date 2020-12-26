import { useEffect, useRef, useState } from 'react'

import Head from 'next/head'
import styles from '../styles/home.module.sass'

import {createGame,Game} from '../lib/game'

export default function Home() {
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [playing, setPlaying] = useState<boolean>(false)
  const [game, setGame] = useState<Game>(null)
  
  useEffect(() => {
    setGame(createGame(canvasRef.current))
  }, [])
  
  function startGame(){
    game.startGame()
    setPlaying(true)
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Tetris</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <canvas ref={canvasRef} width="200" height="400"></canvas>
      
      <div className={styles.menu} style={{display: (playing)?'none':'flex'}}>
        <button onClick={startGame} className={styles.start_button}>Start Game</button>
      </div>
    </>
  )
}
