import {motion,useReducedMotion,useScroll,useTransform} from 'framer-motion';
import {Activity,AlertTriangle,ArrowRight,BrainCircuit,Check,ChevronRight,FileText,Menu,MessageSquareWarning,ShieldCheck,Sparkles,WalletCards} from 'lucide-react';
import {useRef,useState} from 'react';
import {Link} from 'react-router-dom';

const features=[
  ['01','Analyze suspicious content','Messages, links and payment requests explained in clear language.'],
  ['02','Understand financial risk','See why a transaction or pattern deserves attention.'],
  ['03','Respond with confidence','Document evidence and follow calm, legitimate next steps.'],
];

export default function LandingModern(){
  const hero=useRef<HTMLElement>(null);
  const [menuOpen,setMenuOpen]=useState(false);
  const reduceMotion=useReducedMotion();
  const {scrollYProgress}=useScroll({target:hero,offset:['start start','end start']});
  const shieldY=useTransform(scrollYProgress,[0,1],[0,110]);
  const shieldRotate=useTransform(scrollYProgress,[0,1],[-8,12]);
  return <div className="modernLanding">
    <header className={`landingNav ${menuOpen?'menuOpen':''}`}>
      <Link to="/" className="landingLogo"><span><ShieldCheck/></span><b>FinGuard</b></Link>
      <nav><a href="#platform" onClick={()=>setMenuOpen(false)}>Platform</a><a href="#how" onClick={()=>setMenuOpen(false)}>How it works</a><a href="#trust" onClick={()=>setMenuOpen(false)}>Security</a><Link to="/login">Education</Link><Link className="mobileNavAction" to="/login">Analyze a scam</Link></nav>
      <div><Link to="/login" className="textLink">Sign in</Link><Link to="/login" className="landingCta">Analyze a scam <ArrowRight/></Link></div>
      <button aria-label={menuOpen?'Close menu':'Open menu'} aria-expanded={menuOpen} onClick={()=>setMenuOpen(x=>!x)}><Menu/></button>
    </header>

    <main>
      <section className="modernHero cinematicHero" ref={hero}>
        <div className="heroGrid"/>
        <motion.div className="heroCopy" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.55}}>
          <span><i/>AI-POWERED FINANCIAL SAFETY</span>
          <h1>Your money deserves <em>intelligent protection.</em></h1>
          <p>FinGuard uses AI-powered financial intelligence to detect suspicious activity, understand your spending, and help you respond safely.</p>
          <div><Link to="/login" className="landingCta">Get started <ArrowRight/></Link><a href="#story" className="secondaryLanding">Explore FinGuard <ChevronRight/></a></div>
          <small><ShieldCheck/>No bank credentials required <i/> Explainable risk signals <i/> Calm incident guidance</small>
        </motion.div>
        <motion.div className="cinematicShieldScene" initial={{opacity:0,scale:.94}} animate={{opacity:1,scale:1}} transition={{duration:.8,delay:.08}} style={{y:reduceMotion?0:shieldY,rotateY:reduceMotion?0:shieldRotate}}>
          <div className="shieldHalo h1"/><div className="shieldHalo h2"/>
          <div className="shieldOrbit o1"><i/><i/><i/></div><div className="shieldOrbit o2"><i/><i/></div>
          <div className="shieldCore"><div className="shieldFacet"/><ShieldCheck/><span>FIN GUARD</span></div>
          <div className="shieldSignal s1"><span>₹2,499</span><i>SAFE</i></div>
          <div className="shieldSignal s2"><span>₹14,500</span><i>REVIEW</i></div>
          <div className="shieldSignal s3"><span>₹680</span><i>SAFE</i></div>
          <div className="shieldReadout"><Activity/><div><b>Signal intelligence ready</b><span>Analysis only · no bank connection</span></div></div>
        </motion.div>
        <div className="dataParticles">{Array.from({length:12},(_,i)=><i key={i} style={{'--x':`${(i*19)%95}%`,'--y':`${(i*37)%90}%`,'--d':`${2+i%4}s`} as React.CSSProperties}/>)}</div>
      </section>

      <section className="trustBar"><span>BUILT FOR CLARITY</span><p><Check/>Explainable analysis</p><p><Check/>Official-channel guidance</p><p><Check/>No false recovery claims</p><p><Check/>Privacy-conscious by design</p></section>

      <section className="storySequence" id="story">
        <header><span>HOW FINGUARD THINKS</span><h2>From movement<br/>to meaning.</h2><p>A visual explanation of the analysis flow—not a claim that FinGuard can block bank transactions.</p></header>
        <div className="storyChapters">
          <motion.article initial={{opacity:1,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.3}}>
            <div className="storyCopy"><small>01 · MONEY MOVES</small><h3>Every transaction tells a story.</h3><p>FinGuard looks beyond individual payments to identify patterns that deserve attention.</p></div>
            <div className="transactionNetwork" aria-label="Illustration of transaction signals moving through an analysis network">
              {[['₹2,499','safe'],['₹680','safe'],['₹14,500','risk'],['₹649','safe'],['₹2,840','safe']].map(([amount,tone],i)=><span className={tone} style={{'--i':i} as React.CSSProperties} key={amount}>{amount}</span>)}
              <i className="networkLine n1"/><i className="networkLine n2"/><i className="networkLine n3"/>
            </div>
          </motion.article>
          <motion.article initial={{opacity:1,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.3}}>
            <div className="analysisCore" aria-label="FinGuard analysis checks amount, merchant, timing, frequency, pattern and context">
              <div className="coreOrb"><BrainCircuit/><i/></div>
              {['Amount','Merchant','Timing','Frequency','Pattern','Context'].map((x,i)=><span style={{'--i':i} as React.CSSProperties} key={x}>{x}</span>)}
            </div>
            <div className="storyCopy"><small>02 · AI DETECTS</small><h3>Signals become understandable.</h3><p>Amount, merchant, timing and behavior patterns are evaluated together. Results remain informational, not definitive proof.</p></div>
          </motion.article>
          <motion.article initial={{opacity:1,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.3}}>
            <div className="storyCopy"><small>03 · THREAT IDENTIFIED</small><h3>Know before it becomes costly.</h3><p>The system isolates the strongest risk indicators and explains why the activity deserves review.</p></div>
            <div className="threatCard"><span>UNKNOWN MERCHANT</span><strong>₹14,500</strong><div><b>87 / 100</b><em><AlertTriangle/>HIGH RISK</em></div><ul><li>Unusual amount</li><li>Unknown merchant</li><li>Unusual timing</li><li>Pattern deviation</li></ul></div>
          </motion.article>
          <motion.article initial={{opacity:1,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.3}}>
            <div className="awarenessShield"><ShieldCheck/><span>THREAT IDENTIFIED</span><b>Action recommended</b></div>
            <div className="storyCopy"><small>04 · FINGUARD GUIDES</small><h3>Protection starts with awareness.</h3><p>FinGuard recommends a calm next step. It does not claim to freeze payments or replace your bank.</p></div>
          </motion.article>
        </div>
      </section>

      <section className="platformSection" id="platform">
        <div className="landingSectionTitle"><span>THE PLATFORM</span><h2>Security intelligence,<br/>without the panic.</h2><p>FinGuard turns complex signals into clear decisions you can act on.</p></div>
        <div className="featureRail">{features.map((x,i)=><motion.article whileHover={{y:-4}} key={x[0]}><span>{x[0]}</span><div className={`featureVisual v${i+1}`}>{i===0?<MessageSquareWarning/>:i===1?<ShieldCheck/>:<FileText/>}</div><h3>{x[1]}</h3><p>{x[2]}</p><Link to="/login">Explore feature <ArrowRight/></Link></motion.article>)}</div>
      </section>

      <section className="scamCinema">
        <div className="phoneStage" aria-label="Example suspicious message analyzed for urgency, payment pressure, impersonation and link risk">
          <div className="phoneFrame"><i/><small>NEW MESSAGE</small><p>Your bank account will be blocked today. Pay ₹2,000 immediately…</p><div><span>Urgency</span><span>Payment request</span><span>Impersonation</span><span>Suspicious link</span></div></div>
          <div className="scanBeam"/><div className="phoneScore"><span>FIN GUARD ANALYSIS</span><strong>87</strong><small>/ 100 · HIGH RISK</small></div>
        </div>
        <div><span>SCAM INTELLIGENCE</span><h2>Don't just read the message.<br/>Understand the risk.</h2><p>FinGuard highlights potential scam indicators and recommends safe verification steps without declaring certainty.</p><Link to="/login" className="landingCta">Analyze a scam <ArrowRight/></Link></div>
      </section>

      <section className="expenseCinema">
        <div><span>EXPENSE INTELLIGENCE</span><h2>Understand where your money goes.</h2><p>Spending categories organize into a clear view of monthly activity, trends and savings.</p><Link to="/login">Explore your dashboard <ArrowRight/></Link></div>
        <div className="categoryWorld" aria-label="Example expense categories totaling ₹18,420">
          {[['Food','₹2,680'],['Travel','₹1,252'],['Shopping','₹2,499'],['Bills','₹2,840'],['Subscriptions','₹649'],['Transfer','₹8,500']].map(([name,value],i)=><div style={{'--i':i} as React.CSSProperties} key={name}><span>{name}</span><b>{value}</b></div>)}
          <strong>₹18,420<small>MONTHLY SPENDING · DEMO DATA</small></strong>
        </div>
      </section>

      <section className="recoveryCinema">
        <div><span>SCAM RECOVERY</span><h2>If something goes wrong,<br/>know what to do next.</h2><p>Organize evidence and follow verified, official-channel guidance. FinGuard cannot guarantee recovery of funds.</p><Link to="/login">Open Recovery Center <ArrowRight/></Link></div>
        <ol>{['Threat','Evidence','Bank','Report','Monitor','Recovery'].map((x,i)=><li key={x}><i>{String(i+1).padStart(2,'0')}</i><span>{x}</span>{i<5&&<ChevronRight/>}</li>)}</ol>
      </section>

      <section className="howSection" id="how">
        <div><span>HOW IT WORKS</span><h2>Signal to action<br/>in three calm steps.</h2></div>
        <ol><li><i>01</i><div><b>Bring the concern.</b><p>Paste suspicious content or import anonymized transaction data.</p></div></li><li><i>02</i><div><b>Understand the signals.</b><p>FinGuard explains urgency, impersonation, anomalies and link risk.</p></div></li><li><i>03</i><div><b>Take the next safe step.</b><p>Document evidence and use appropriate official reporting channels.</p></div></li></ol>
      </section>

      <section className="finAiCinema">
        <div><span>FIN AI</span><h2>Your financial data.<br/>Explained.</h2><p>Ask questions about authenticated records and see the sources used in each answer.</p><Link to="/login">Open Fin AI <ArrowRight/></Link></div>
        <div className="aiPreview"><header><BrainCircuit/><b>Fin AI</b><em>Grounded answer</em></header><p>Why did my spending increase?</p><blockquote><Sparkles/>Your recorded spending increased this month. Food delivery contributed the largest increase. Review the underlying transactions before acting.<small>Sources · category totals · transaction summary</small></blockquote></div>
      </section>

      <section className="trustSection" id="trust">
        <div className="trustOrb"><ShieldCheck/><i/><i/></div>
        <div><span>TRUST BY DESIGN</span><h2>Guidance, not fear.</h2><p>FinGuard does not impersonate banks or authorities, never asks for secret banking credentials and never claims it can directly recover stolen funds.</p><Link to="/login">Enter your secure workspace <ArrowRight/></Link></div>
      </section>

      <section className="finalShieldCta">
        <div className="miniShield"><ShieldCheck/></div>
        <span>FINANCIAL SAFETY, EXPLAINED</span><h2>Know your money.<br/>Protect your future.</h2><p>FinGuard gives you the intelligence to detect risks, understand your spending, and respond with confidence.</p><div><Link to="/login" className="landingCta">Get started <ArrowRight/></Link><Link to="/login" className="secondaryLanding">Try Scam Analyzer <ChevronRight/></Link></div>
      </section>
    </main>
    <footer className="modernFooter"><div className="landingLogo"><span><ShieldCheck/></span><b>FinGuard</b></div><p>Detect scams. Understand your spending. Protect your money.</p><div><a href="#platform">Platform</a><a href="#trust">Security</a><Link to="/login">Sign in</Link></div><small>© 2026 FinGuard · Built by VOID Developer Team</small></footer>
  </div>
}