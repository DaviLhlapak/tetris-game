import { useEffect, useRef, useState } from 'react'

import Head from 'next/head'
import styles from '../styles/home.module.sass'

import {createGame,Game} from '../lib/game'

export default function Home() {
  
  const mainRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  
  const [playing, setPlaying] = useState<boolean>(false)
  const [points, setPoints] = useState<number>(0);
  const [game, setGame] = useState<Game>(null)
  
  useEffect(() => {
    setGame(createGame(mainRef.current, previewRef.current, setPoints))
  }, [])
  
  function startGame(){
    game.startGame()
    setPlaying(true)
  }

  return (
    <div className={styles.wrapper}>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Tetris</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <canvas id="main" ref={mainRef} width="200" height="400"></canvas>

      <aside className={styles.info}>
        <canvas className={styles.preview} ref={previewRef} width="100" height="120"></canvas>
        <p>Pontos: {points}</p>
      </aside>
      
      <div className={styles.menu} style={{display: (playing)?'none':'flex'}}>
        <button onClick={startGame} className={styles.start_button}>Start Game</button>
      </div>
    </div>
  )
}
