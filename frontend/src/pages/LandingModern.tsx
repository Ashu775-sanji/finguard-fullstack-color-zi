import {motion} from 'framer-motion';
import {ArrowRight,Check,ChevronRight,FileText,Menu,MessageSquareWarning,ShieldCheck,TrendingDown,WalletCards} from 'lucide-react';
import {Link} from 'react-router-dom';

const features=[
  ['01','Analyze suspicious content','Messages, links and payment requests explained in clear language.'],
  ['02','Understand financial risk','See why a transaction or pattern deserves attention.'],
  ['03','Respond with confidence','Document evidence and follow calm, legitimate next steps.'],
];

export default function LandingModern(){
  return <div className="modernLanding">
    <header className="landingNav">
      <Link to="/" className="landingLogo"><span><ShieldCheck/></span><b>FinGuard</b></Link>
      <nav><a href="#platform">Platform</a><a href="#how">How it works</a><a href="#trust">Security</a><a href="#education">Education</a></nav>
      <div><Link to="/login" className="textLink">Sign in</Link><Link to="/login" className="landingCta">Analyze a scam <ArrowRight/></Link></div>
      <button aria-label="Open menu"><Menu/></button>
    </header>

    <main>
      <section className="modernHero">
        <div className="heroGrid"/>
        <motion.div className="heroCopy" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.55}}>
          <span><i/>AI-POWERED FINANCIAL SAFETY</span>
          <h1>Your financial safety layer <em>against scams.</em></h1>
          <p>Detect suspicious activity, understand financial risks and know what to do next — powered by explainable AI.</p>
          <div><Link to="/login" className="landingCta">Analyze a scam <ArrowRight/></Link><a href="#platform" className="secondaryLanding">Explore FinGuard <ChevronRight/></a></div>
          <small><ShieldCheck/>No bank credentials required <i/> Explainable risk signals <i/> Calm incident guidance</small>
        </motion.div>
        <motion.div className="floatingCommand" initial={{opacity:0,x:28,rotateY:-4}} animate={{opacity:1,x:0,rotateY:0}} transition={{duration:.65,delay:.1}}>
          <div className="commandTop"><span><ShieldCheck/>FINANCIAL SECURITY</span><em><i/>LIVE MONITORING</em></div>
          <div className="commandRisk">
            <div className="landingRisk"><b>18</b><span>LOW RISK</span></div>
            <div><small>FINANCIAL RISK SCORE</small><h3>Your activity looks stable.</h3><p>Risk decreased 12% this week.</p><span><TrendingDown/>Healthy trend</span></div>
          </div>
          <div className="commandCards">
            <article><span><MessageSquareWarning/>SCAM ALERT</span><strong>High risk message</strong><p>Urgency · Impersonation · Link</p></article>
            <article><span><WalletCards/>TRANSACTION RISK</span><strong>₹48,500</strong><p>Unknown recipient · 87%</p></article>
          </div>
          <div className="aiStrip"><span><i/><i/><i/></span><p><b>AI ANALYSIS</b> Three signals need your attention.</p><button>Review</button></div>
        </motion.div>
        <div className="dataParticles">{Array.from({length:12},(_,i)=><i key={i} style={{'--x':`${(i*19)%95}%`,'--y':`${(i*37)%90}%`,'--d':`${2+i%4}s`} as React.CSSProperties}/>)}</div>
      </section>

      <section className="trustBar"><span>BUILT FOR CLARITY</span><p><Check/>Explainable analysis</p><p><Check/>Official-channel guidance</p><p><Check/>No false recovery claims</p><p><Check/>Privacy-conscious by design</p></section>

      <section className="platformSection" id="platform">
        <div className="landingSectionTitle"><span>THE PLATFORM</span><h2>Security intelligence,<br/>without the panic.</h2><p>FinGuard turns complex signals into clear decisions you can act on.</p></div>
        <div className="featureRail">{features.map((x,i)=><motion.article whileHover={{y:-4}} key={x[0]}><span>{x[0]}</span><div className={`featureVisual v${i+1}`}>{i===0?<MessageSquareWarning/>:i===1?<ShieldCheck/>:<FileText/>}</div><h3>{x[1]}</h3><p>{x[2]}</p><Link to="/login">Explore feature <ArrowRight/></Link></motion.article>)}</div>
      </section>

      <section className="howSection" id="how">
        <div><span>HOW IT WORKS</span><h2>Signal to action<br/>in three calm steps.</h2></div>
        <ol><li><i>01</i><div><b>Bring the concern.</b><p>Paste suspicious content or import anonymized transaction data.</p></div></li><li><i>02</i><div><b>Understand the signals.</b><p>FinGuard explains urgency, impersonation, anomalies and link risk.</p></div></li><li><i>03</i><div><b>Take the next safe step.</b><p>Document evidence and use appropriate official reporting channels.</p></div></li></ol>
      </section>

      <section className="trustSection" id="trust">
        <div className="trustOrb"><ShieldCheck/><i/><i/></div>
        <div><span>TRUST BY DESIGN</span><h2>Guidance, not fear.</h2><p>FinGuard does not impersonate banks or authorities, never asks for secret banking credentials and never claims it can directly recover stolen funds.</p><Link to="/login">Enter your secure workspace <ArrowRight/></Link></div>
      </section>
    </main>
    <footer className="modernFooter"><div className="landingLogo"><span><ShieldCheck/></span><b>FinGuard</b></div><p>Detect scams. Protect your money. Know what to do next.</p><div><a href="#platform">Platform</a><a href="#trust">Security</a><Link to="/login">Sign in</Link></div><small>© 2026 FinGuard · Built by VOID Developer Team</small></footer>
  </div>
}