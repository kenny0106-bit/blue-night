import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import hammondOrganArt from '../assets/instruments/hammond-organ.svg?no-inline'
import electricGuitarArt from '../assets/instruments/electric-guitar.svg?no-inline'
import synthesizerArt from '../assets/instruments/synthesizer.svg?no-inline'
import microphoneArt from '../assets/instruments/microphone.svg?no-inline'
import './styles.css'
import './artwork.css'

const genres = {
  bluerock: { id: 'bluerock', number: '01', title: 'BLUE ROCK', instrument: 'HAMMOND ORGAN', subtitle: 'BLUE NOTE / HEAVY SOUL', description: '哈蒙德風琴以厚實、溫暖且帶有靈魂感的音色著稱。透過兩層鍵盤與拉桿控制音色，它能同時產生和聲、旋律與強烈的聲場。從藍調、搖滾到爵士，它都是極具辨識度的聲音。', tagline: 'WARM / SOULFUL / POWERFUL', color: '#d85720', shape: 'organ', track: 'Blue Rock — live signal', audioFile: 'bluerock.mp3' },
  funk: { id: 'funk', number: '02', title: 'FUNK', instrument: 'ELECTRIC GUITAR', subtitle: 'POCKET / GROOVE', description: '電吉他是 Funk 中節奏感的重要角色。不同於強調旋律的演奏方式，Funk 常透過短促、切分的吉他節奏製造律動，讓每一次刷弦都成為 Groove 的一部分。', tagline: 'GROOVE / RHYTHM / ATTITUDE', color: '#e9bb36', shape: 'guitar', track: 'Funk — live signal', audioFile: 'funk.mp3' },
  fusion: { id: 'fusion', number: '03', title: 'FUSION', instrument: 'SYNTHESIZER', subtitle: 'ODD TIME / OPEN FORM', description: '合成器能透過電子訊號創造出幾乎無限的聲音。從厚重低頻、空間感音色到實驗性的聲響，它讓 Fusion 能夠突破傳統樂器的限制，將爵士與電子聲響連結在一起。', tagline: 'TEXTURE / EXPERIMENT / FUTURE', color: '#7184bd', shape: 'synth', track: 'Fusion — live signal', audioFile: 'fusion.mp3' },
  rnb: { id: 'rnb', number: '04', title: 'R&B', instrument: 'MICROPHONE', subtitle: 'RHYTHM / BLUES', description: '麥克風不只是收音工具，更是 R&B 情感表達的入口。從細膩的氣音、柔和的旋律，到充滿力量的歌聲，聲音本身成為樂曲中最直接的情緒載體。', tagline: 'VOICE / SOUL / EMOTION', color: '#d6d0bd', shape: 'mic', track: 'R&B — live signal', audioFile: 'rnb.mp3' },
}

function Logo({ small = false }) { return <a className={`brand-logo ${small ? 'brand-logo-small' : ''}`} href="https://blue-night-homepage.vercel.app/#portal" aria-label="Blue Night Homepage"><img src="/blue-night-mark-white.png" alt="Blue Night symbol" /></a> }

function Vinyl() {
  return <div className="vinyl" aria-label="Blue Night record"><div className="record-label"><span>BLUE<br/>NIGHT</span><small>10 · 17 · 26</small></div><i className="record-shine" /></div>
}

function InstrumentArt({ genre }) {
  const label = genre.instrument
  return <div className={`instrument-art art-${genre.shape}`} aria-hidden="true">
    <div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/>
    {genre.shape === 'organ' && <div className="organ-art"><img className="instrument-svg" src={hammondOrganArt} alt="" draggable="false" /></div>}
    {genre.shape === 'guitar' && <div className="guitar-art"><img src={electricGuitarArt} alt="" draggable="false" style={{display:'block',width:'100%',height:'100%',objectFit:'contain',transform:'scale(1.72)'}} /></div>}
    {genre.shape === 'synth' && <div className="synth-art"><img className="instrument-svg" src={synthesizerArt} alt="" draggable="false" /></div>}
    {genre.shape === 'mic' && <div className="mic-art"><img className="instrument-svg" src={microphoneArt} alt="" draggable="false" /></div>}
    <span className="art-index">{genre.number} / OBJECT STUDY</span><span className="art-caption">{label}</span>
  </div>
}

function Waveform({ playing }) { return <div className={`waveform ${playing ? 'wave-active' : ''}`} aria-hidden="true">{Array.from({length:48},(_,i)=><i key={i} style={{'--h': `${18 + ((i*17 + i*i*3)%78)}%`, '--d': `${(i%8)*.08}s`}} />)}</div> }

function AudioPlayer({ genre, playing, setPlaying, onPlaybackStart, onPlaybackPause, stopSignal }) {
  const audio = useRef(null); const spinRef = useRef(null); const spinState = useRef({ angle: 0, speed: 0 }); const [duration,setDuration]=useState(0); const [time,setTime]=useState(0)
  useEffect(()=>{if(stopSignal)audio.current?.pause()},[stopSignal])
  useEffect(()=>{let frame=0,last=0;const motion=window.matchMedia('(prefers-reduced-motion: reduce)');if(motion.matches){if(spinRef.current)spinRef.current.style.transform='none';return}const tick=(now)=>{const state=spinState.current;const dt=last?Math.min(now-last,48):0;last=now;state.speed+=( (playing?36:0)-state.speed )*(1-Math.exp(-dt/650));state.angle=(state.angle+state.speed*dt/1000)%360;if(spinRef.current)spinRef.current.style.transform=`rotate(${state.angle}deg)`;if(playing||state.speed>.12)frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame)},[playing])
  const fmt=(n)=>`${Math.floor((n||0)/60)}:${String(Math.floor((n||0)%60)).padStart(2,'0')}`
  const seek=(e)=>{const a=audio.current;if(a?.duration){const rect=e.currentTarget.getBoundingClientRect();a.currentTime=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width))*a.duration}}
  const seekByKey=(e)=>{const a=audio.current;if(!a?.duration)return;const step=e.shiftKey?15:5;if(e.key==='ArrowRight'||e.key==='ArrowUp'){e.preventDefault();a.currentTime=Math.min(a.duration,a.currentTime+step)}else if(e.key==='ArrowLeft'||e.key==='ArrowDown'){e.preventDefault();a.currentTime=Math.max(0,a.currentTime-step)}else if(e.key==='Home'){e.preventDefault();a.currentTime=0}else if(e.key==='End'){e.preventDefault();a.currentTime=a.duration}}
  return <section className="player" aria-label={`${genre.title} audio player`}>
    <audio ref={audio} src={`/audio/${encodeURIComponent(genre.audioFile)}`} preload="metadata" playsInline onLoadedMetadata={e=>setDuration(e.target.duration)} onTimeUpdate={e=>setTime(e.target.currentTime)} onPlay={()=>{onPlaybackStart();setPlaying(true)}} onPause={()=>{if(playing)onPlaybackPause();setPlaying(false)}} onEnded={()=>{if(playing)onPlaybackPause();setPlaying(false)}} />
    <div className="player-top"><span>NOW PLAYING</span><span className="signal"><i/> SIGNAL {playing?'LIVE':'READY'}<b ref={spinRef} className="player-vinyl" aria-hidden="true"/></span></div>
    <div className="track-row"><button className="play-button" onClick={()=>{const player=audio.current;if(!player)return;if(player.paused)player.play().catch(()=>setPlaying(false));else player.pause()}} aria-label={playing?'Pause':'Play'}><span>{playing?'Ⅱ':'▶'}</span></button><div className="track-info"><strong>{genre.track}</strong><small>BLUE NIGHT · KAOHSIUNG</small></div><div className="track-time">{fmt(time)}<span> / {duration?fmt(duration):'—:—'}</span></div></div>
    <div className="seek" onPointerDown={seek} onKeyDown={seekByKey} role="slider" aria-label="Audio progress" aria-valuemin="0" aria-valuemax={duration||0} aria-valuenow={time} aria-valuetext={`${fmt(time)} of ${fmt(duration)}`} tabIndex="0"><i style={{width:`${duration?time/duration*100:0}%`}}/></div>
    <div className="wave-meta"><span>PLAY / PAUSE</span><Waveform playing={playing}/><span>{duration?fmt(duration):'AUDIO'}</span></div>
  </section>
}

function GenreNavigation({ current, onNavigate }) { return <nav className="genre-nav" aria-label="Explore other sounds">{Object.values(genres).map(g=><a className={g.id===current?'selected':''} href={`/sound/${g.id}`} onClick={e=>{if(onNavigate){if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();onNavigate(g.id)}else{try{sessionStorage.setItem('blue-night-internal-route',g.id)}catch{}}}} key={g.id}><span>{g.number}</span>{g.title}</a>)}</nav> }

function Masthead({ children }) { return <header className="masthead"><Logo/><div className="masthead-title">UNDERGROUND<br/>SOUND / 2026</div><div className="masthead-right">KAOHSIUNG, TAIWAN<br/>17 OCTOBER 2026</div>{children}</header> }

function Home() {
  return <main className="home-page home-enter"><Masthead/><div className="home-grid"><div className="home-copy"><p className="eyebrow"><i/> NFC SIGNAL RECEIVED · BEGIN HERE</p><h1>BLUE<br/><em>NIGHT</em></h1><div className="home-rule"/><p className="home-description">UNDERGROUND<br/>SOUND</p><p className="home-invite">Four signals. Four ways into the night.<br/>Choose a sound or tap an exhibition point.</p><GenreNavigation/></div><div className="home-record"><span className="record-note note-a">SIDE A<br/>LIVE FREQUENCIES</span><Vinyl/><span className="record-note note-b">33⅓ RPM<br/>KAOHSIUNG · 2026</span><div className="record-scribble">LISTEN<br/>CLOSER</div></div></div><footer className="site-footer"><span>BLUE NIGHT UNDERGROUND SPACE</span><span aria-label="Location: Kaohsiung Municipal Kaohsiung Vocational High School of Commerce (KSVCS / 雄商), No. 3, Wufu 2nd Road, Sinsing District, Kaohsiung City, Taiwan; latitude 22.6254, longitude 120.3091">22.6254°N 120.3091°E</span><span>NO. 01 — 04</span></footer></main>
}

function SignalTransition({ genre, kind, onDone }) { return <div className={`nfc-entry ${kind==='switch'?'signal-switch':''}`} onAnimationEnd={e=>{if(e.target===e.currentTarget&&e.animationName==='nfc-signal')onDone()}} aria-live="polite"><span className="nfc-detected">SIGNAL DETECTED</span><i className="nfc-down">↓</i><strong>{genre.number} / {genre.title}</strong><i className="nfc-scan"/><small>{genre.instrument}</small><i className="nfc-down nfc-down-last">↓</i></div> }

function GenrePage({ genre, onNavigate, stopSignal }) {
  const [playing,setPlaying]=useState(false)
  const [settling,setSettling]=useState(false)
  const settleTimer=useRef(0)
  useEffect(()=>{setPlaying(false);window.scrollTo(0,0)},[genre.id])
  const clearSettling=()=>window.clearTimeout(settleTimer.current)
  const onPlaybackStart=()=>{clearSettling();document.querySelectorAll('.genre-page .organ-art,.genre-page .guitar-art,.genre-page .synth-art,.genre-page .mic-art').forEach(el=>el.style.removeProperty('--settle-scale'));setSettling(false)}
  const onPlaybackPause=()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;clearSettling();const instruments=[...document.querySelectorAll('.genre-page .organ-art,.genre-page .guitar-art,.genre-page .synth-art,.genre-page .mic-art')];instruments.forEach(el=>el.style.setProperty('--settle-scale',getComputedStyle(el).scale));setSettling(true);settleTimer.current=window.setTimeout(()=>{instruments.forEach(el=>el.style.removeProperty('--settle-scale'));setSettling(false)},1900)}
  useEffect(()=>()=>clearSettling(),[])
  return <main className={`genre-page style-${genre.shape} page-enter ${playing?'is-playing':''} ${settling?'is-settling':''}`} style={{'--accent':genre.color}}><Masthead><a className="back-home" href="/">← INDEX</a></Masthead><div className="genre-layout"><aside className="genre-side"><span className="side-number">{genre.number}</span><span className="side-label">NFC<br/>FREQUENCY</span><span className="side-line"/><span className="side-date">10—17—26</span></aside><section className="genre-main"><div className="genre-heading"><div className="genre-kicker"><span>{genre.subtitle}</span><span>FREQUENCY {genre.number}</span></div><h1>{genre.title}</h1><div className="genre-instrument"><span>REPRESENTATIVE INSTRUMENT</span></div></div><InstrumentArt genre={genre}/><div className="genre-lower"><div className="genre-description"><p>{genre.description}</p><p className="genre-tagline">{genre.tagline}</p></div><AudioPlayer genre={genre} playing={playing} setPlaying={setPlaying} onPlaybackStart={onPlaybackStart} onPlaybackPause={onPlaybackPause} stopSignal={stopSignal}/></div><GenreNavigation current={genre.id} onNavigate={onNavigate}/></section></div><footer className="site-footer"><span>BLUE NIGHT UNDERGROUND SPACE</span><span>KAOHSIUNG, TAIWAN</span><span>{genre.number} / 04</span></footer></main>
}

function routeGenre(){return window.location.pathname.toLowerCase().match(/^\/sound\/(bluerock|funk|fusion|rnb)\/?$/)?.[1]||null}
function App(){
  const [initial]=useState(()=>{const id=routeGenre();let signal=!!id;try{if(sessionStorage.getItem('blue-night-internal-route')===id)signal=false;sessionStorage.removeItem('blue-night-internal-route')}catch{}if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)signal=false;return{id,signal}})
  const [genreId,setGenreId]=useState(initial.id)
  const initialTransition=initial.signal?{genreId:initial.id,kind:'nfc',token:1}:null
  const [transition,setTransition]=useState(initialTransition)
  const activeId=useRef(initial.id)
  const transitionRef=useRef(initialTransition)
  const tokenRef=useRef(initialTransition?.token||1)
  const beginTransition=(id,kind='switch',push=true,retarget=false)=>{
    if(!genres[id])return
    if(transitionRef.current&&!retarget)return
    if(id===activeId.current){if(transitionRef.current){transitionRef.current=null;setTransition(null)}return}
    if(push)window.history.pushState({blueNightGenre:id},'',`/sound/${id}`)
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){activeId.current=id;setGenreId(id);transitionRef.current=null;setTransition(null);return}
    const next={genreId:id,kind,token:++tokenRef.current};transitionRef.current=next;setTransition(next)
  }
  const finishTransition=token=>{
    const pending=transitionRef.current
    if(!pending||pending.token!==token)return
    activeId.current=pending.genreId;setGenreId(pending.genreId);transitionRef.current=null;setTransition(null)
  }
  useEffect(()=>{const onPopState=()=>{const destination=routeGenre();if(!destination){activeId.current=null;transitionRef.current=null;setGenreId(null);setTransition(null);return}if(destination===activeId.current){transitionRef.current=null;setTransition(null);return}beginTransition(destination,'switch',false,true)};window.addEventListener('popstate',onPopState);return()=>window.removeEventListener('popstate',onPopState)},[])
  return <>{genreId?<GenrePage key={genreId} genre={genres[genreId]} onNavigate={id=>beginTransition(id)} stopSignal={transition?.token||0}/>:<Home/>}{transition&&<SignalTransition key={transition.token} genre={genres[transition.genreId]} kind={transition.kind} onDone={()=>finishTransition(transition.token)}/>}</>
}

createRoot(document.getElementById('root')).render(<App />)
