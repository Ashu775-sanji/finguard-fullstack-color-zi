import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Check,
  Menu,
  ShieldCheck,
  Target,
  TrendingUp,
  WalletCards,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
export default function Landing() {
  const [detail, setDetail] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const nodes = [
      ...document.querySelectorAll(
        ".landing section,.reviewGrid article,.voidValues div,.featureGrid article",
      ),
    ];
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => e.isIntersecting && e.target.classList.add("inView")),
      { threshold: 0.12 },
    );
    nodes.forEach((n) => {
      n.classList.add("motionReveal");
      io.observe(n);
    });
    const hero = document.querySelector(".landHero") as HTMLElement | null;
    const move = (e: PointerEvent) => {
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      hero.style.setProperty(
        "--px",
        String((e.clientX - r.left) / r.width - 0.5),
      );
      hero.style.setProperty(
        "--py",
        String((e.clientY - r.top) / r.height - 0.5),
      );
    };
    hero?.addEventListener("pointermove", move);
    return () => {
      io.disconnect();
      hero?.removeEventListener("pointermove", move);
    };
  }, []);
  const info: any = {
    score: {
      kicker: "YOUR GUARD SCORE",
      title: "87 — Strong financial health",
      text: "Your score combines savings behavior, budget adherence, spending stability, emergency-fund strength and anomaly frequency.",
      stats: [
        ["Savings behavior", "92/100"],
        ["Budget adherence", "84/100"],
        ["Spending stability", "86/100"],
      ],
    },
    analytics: {
      kicker: "SEE EVERY MOVE",
      title: "Financial analytics without the clutter",
      text: "Follow income, expenses, savings rate, category trends, top merchants, recurring payments and daily cash flow in one focused view.",
      stats: [
        ["Live metrics", "12"],
        ["Time filters", "4"],
        ["Currency aware", "Yes"],
      ],
    },
    protection: {
      kicker: "PROTECT WHAT YOU EARN",
      title: "Unusual spending, explained clearly",
      text: "FinGuard combines statistical scoring, Isolation Forest and Local Outlier Factor to rank suspicious transactions and explain why they stand out.",
      stats: [
        ["Detection models", "3"],
        ["Risk levels", "Low–High"],
        ["Review actions", "Resolve / Safe"],
      ],
    },
    goals: {
      kicker: "BUILD WHAT COMES NEXT",
      title: "Goals that show the real path",
      text: "Set a target, record what you have saved and see progress, remaining amount and estimated completion time update instantly.",
      stats: [
        ["Current progress", "52%"],
        ["Saved", "₹42,000"],
        ["Time remaining", "4.2 months"],
      ],
    },
  };
  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div className="landing">
      <div className="landTop">
        <span>FINANCIAL SAFETY, BUILT FOR REAL LIFE.</span>
        <span>INDIA · INR</span>
      </div>
      <nav className="landNav">
        <Link className="landLogo" to="/">
          <span>
            <ShieldCheck />
          </span>
          FINGUARD
        </Link>
        <div className={`landLinks ${menuOpen ? "open" : ""}`}>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("platform");
            }}
          >
            Platform
          </a>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("stories");
            }}
          >
            Why FinGuard
          </a>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("control");
            }}
          >
            Money moves
          </a>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("about");
            }}
          >
            About
          </a>
        </div>
        <div className="landActions">
          <Link to="/login">Sign in</Link>
          <Link className="landJoin" to="/login">
            Join now <ArrowRight />
          </Link>
          <button>
            <Menu />
          </button>
        </div>
      </nav>
      <main className="landMain">
        <section className="landHero">
          <img
            src={import.meta.env.BASE_URL + "finguard-editorial.jpg"}
            alt="A confident professional moving through a modern city"
          />
          <div className="heroShade" />
          <div className="landHeroCopy">
            <span>DETECT SCAMS. PROTECT YOUR MONEY.</span>
            <h1>
              YOUR FINANCIAL
              <br />
              SAFETY LAYER.
            </h1>
            <p>
              FinGuard analyzes suspicious messages, URLs and financial activity—then helps you understand the risk and take the right next step.
            </p>
            <div>
              <Link className="blackCta" to="/login">
                Analyze a scam <ArrowRight />
              </Link>
              <a
                className="textCta"
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("platform");
                }}
              >
                Explore FinGuard <ArrowDown />
              </a>
            </div>
          </div>
          <button
            className="heroStamp"
            onClick={() => setDetail("score")}
            aria-label="Open Guard Score details"
          >
            <b>87</b>
            <span>
              GUARD
              <br />
              SCORE
            </span>
          </button>
        </section>
        <div className="ticker">
          <div>
            DETECT SCAMS <i /> EXPLAIN THE RISK <i /> PRESERVE EVIDENCE <i />{" "}
            KNOW WHAT TO DO NEXT <i /> PROTECT YOUR MONEY
          </div>
        </div>
        <section id="platform" className="editorialIntro">
          <span>THE FINGUARD PLATFORM</span>
          <h2>
            Detect the signal.
            <br />
            <em>Respond with clarity.</em>
          </h2>
          <p>
            An AI-powered financial safety platform for scam analysis,
            transaction monitoring, incident documentation and guided response.
          </p>
        </section>
        <section className="featureGrid">
          <article
            className="featureBlue clickableStory"
            role="button"
            tabIndex={0}
            onClick={() => setDetail("analytics")}
            onKeyDown={(e) => e.key === "Enter" && setDetail("analytics")}
          >
            <div className="featureIcon">
              <BarChart3 />
            </div>
            <span>01 / SEE IT</span>
            <h3>
              Suspicious message?
              <br />
              See every signal.
            </h3>
            <p>
              Analyze urgency, impersonation, sensitive requests and suspicious
              links with human-readable explanations.
            </p>
            <button
              className="cardLink"
              onClick={(e) => {
                e.stopPropagation();
                setDetail("analytics");
              }}
            >
              Analyze scam signals <ArrowRight />
            </button>
          </article>
          <article
            className="featureImage clickableStory"
            role="button"
            tabIndex={0}
            onClick={() => setDetail("analytics")}
          >
            <div className="miniDashboard">
              <div>
                <span>SEPTEMBER</span>
                <b>₹85,420</b>
                <small>AVAILABLE BALANCE</small>
              </div>
              <svg viewBox="0 0 360 140">
                <path d="M0 112 C48 105 57 68 107 76 S170 106 209 59 S286 68 360 20" />
                <path
                  className="fill"
                  d="M0 112 C48 105 57 68 107 76 S170 106 209 59 S286 68 360 20 L360 140 L0 140Z"
                />
              </svg>
              <div className="miniStats">
                <span>
                  <b>₹62K</b>INCOME
                </span>
                <span>
                  <b>₹38.4K</b>SPEND
                </span>
                <span>
                  <b>38%</b>SAVED
                </span>
              </div>
            </div>
          </article>
          <article
            className="featureCoral clickableStory"
            role="button"
            tabIndex={0}
            onClick={() => setDetail("protection")}
          >
            <div className="featureIcon">
              <ShieldCheck />
            </div>
            <span>02 / PROTECT IT</span>
            <h3>
              Document the incident.
              <br />
              Know what comes next.
            </h3>
            <p>
              Create an evidence timeline and follow prioritized steps for
              legitimate reporting and account protection.
            </p>
            <button
              className="cardLink"
              onClick={(e) => {
                e.stopPropagation();
                setDetail("protection");
              }}
            >
              Open incident response <ArrowRight />
            </button>
          </article>
        </section>
        <section
          className="platformRail"
          aria-label="FinGuard platform capabilities"
        >
          <div>
            <small>ONE SYSTEM</small>
            <b>Four ways to stay ahead.</b>
          </div>
          <Link to="/login">
            <BarChart3 />
            <span>
              <b>Live analytics</b>
              <small>Cash flow, categories and merchants in one view.</small>
            </span>
            <ArrowRight />
          </Link>
          <Link to="/login">
            <ShieldCheck />
            <span>
              <b>Anomaly intelligence</b>
              <small>Understand what looks unusual and why.</small>
            </span>
            <ArrowRight />
          </Link>
          <Link to="/login">
            <TrendingUp />
            <span>
              <b>Future forecast</b>
              <small>See the next three months before they arrive.</small>
            </span>
            <ArrowRight />
          </Link>
          <Link to="/login">
            <WalletCards />
            <span>
              <b>Smart planning</b>
              <small>Budgets and goals that adapt to your pace.</small>
            </span>
            <ArrowRight />
          </Link>
        </section>
        <section id="stories" className="statement">
          <div>
            <span>BUILT DIFFERENT</span>
            <h2>
              LESS PANIC.
              <br />
              MORE CLARITY.
            </h2>
          </div>
          <div className="statementList">
            <p>
              <b>01</b>
              <span>Fast answers</span>
              <small>
                See the number that matters without a finance degree.
              </small>
            </p>
            <p>
              <b>02</b>
              <span>Useful predictions</span>
              <small>Prepare for next month before it gets here.</small>
            </p>
            <p>
              <b>03</b>
              <span>Goals with momentum</span>
              <small>Know exactly how far you've come and what remains.</small>
            </p>
          </div>
          <div className="whyProof">
            <div>
              <strong>2,481</strong>
              <span>signals translated into a calm daily view</span>
            </div>
            <div>
              <strong>3 models</strong>
              <span>working together to explain unusual spending</span>
            </div>
            <div>
              <strong>0 jargon</strong>
              <span>just direct answers and one useful next move</span>
            </div>
          </div>
        </section>
        <section id="control" className="control">
          <div className="controlCopy">
            <span>OWN THE NEXT MOVE</span>
            <h2>
              Set a goal.
              <br />
              Build the habit.
              <br />
              <em>Get there.</em>
            </h2>
            <p>
              Turn ambition into a plan with intelligent milestones and honest
              progress.
            </p>
            <Link className="whiteCta" to="/login">
              Create your first goal <ArrowRight />
            </Link>
          </div>
          <div
            className="goalPoster clickableStory"
            role="button"
            tabIndex={0}
            onClick={() => setDetail("goals")}
          >
            <div className="goalCard">
              <Target />
              <span>NEW LAPTOP</span>
              <b>₹42,000</b>
              <small>OF ₹80,000 SAVED</small>
              <div>
                <i />
              </div>
              <p>
                <Check />
                On track · 4.2 months left
              </p>
            </div>
            <div className="goalCircle">52%</div>
          </div>
        </section>
        <section className="moveSteps" aria-label="How FinGuard works">
          <header>
            <span>MONEY MOVES</span>
            <h2>
              FROM TRANSACTION
              <br />
              TO DECISION.
            </h2>
          </header>
          <div>
            <article>
              <b>01</b>
              <h3>Bring it in.</h3>
              <p>
                Add a transaction or drop a bank statement. FinGuard cleans and
                organises the movement.
              </p>
            </article>
            <article>
              <b>02</b>
              <h3>Read the pattern.</h3>
              <p>
                Analytics and anomaly models compare the move with your real
                financial behaviour.
              </p>
            </article>
            <article>
              <b>03</b>
              <h3>Make one move.</h3>
              <p>
                Get a clear action: review a payment, protect a budget or
                accelerate a goal.
              </p>
            </article>
          </div>
          <Link to="/login">
            Try the full money flow <ArrowRight />
          </Link>
        </section>
        <section id="about" className="voidSection">
          <div className="voidLabel">
            <span>MADE BY PEOPLE WHO CARE</span>
            <b>VOID</b>
            <small>DEVELOPER TEAM</small>
          </div>
          <div className="voidStory">
            <span>ABOUT THE BUILD</span>
            <h2>
              CODE WITH
              <br />A POINT OF VIEW.
            </h2>
            <p>
              FinGuard was designed and developed by <b>VOID Developer Team</b>
              —a small product crew focused on making financial tools feel
              direct, useful and human.
            </p>
            <div className="voidValues">
              <div>
                <b>01</b>
                <span>Clarity first</span>
              </div>
              <div>
                <b>02</b>
                <span>Security always</span>
              </div>
              <div>
                <b>03</b>
                <span>Built to move</span>
              </div>
            </div>
            <div className="teamProof">
              <div>
                <strong>01</strong>
                <p>
                  <b>Product thinking</b>
                  <span>Every screen begins with one real user decision.</span>
                </p>
              </div>
              <div>
                <strong>02</strong>
                <p>
                  <b>Responsible intelligence</b>
                  <span>AI supports judgement; it never hides the reason.</span>
                </p>
              </div>
              <div>
                <strong>03</strong>
                <p>
                  <b>Built in India</b>
                  <span>
                    Currency-aware, multilingual-ready and designed for real
                    life.
                  </span>
                </p>
              </div>
              <footer>
                <span>DESIGN · ENGINEERING · FINANCIAL INTELLIGENCE</span>
                <b>VOID / 2026</b>
              </footer>
            </div>
          </div>
        </section>
        <section className="reviews">
          <div className="reviewsHead">
            <span>REAL WORDS. REAL PROGRESS.</span>
            <h2>
              WHAT PEOPLE
              <br />
              ARE SAYING.
            </h2>
          </div>
          <div className="reviewGrid">
            <article>
              <div>★★★★★</div>
              <p>
                “For the first time, I can see where my money is actually going
                without fighting a spreadsheet.”
              </p>
              <footer>
                <b>ARJUN M.</b>
                <span>STUDENT · DELHI</span>
              </footer>
            </article>
            <article className="reviewBlue">
              <div>★★★★★</div>
              <p>
                “The goal tracker made saving for my laptop feel possible. It
                shows the path, not just the number.”
              </p>
              <footer>
                <b>NEHA S.</b>
                <span>DESIGNER · PUNE</span>
              </footer>
            </article>
            <article className="reviewCoral">
              <div>★★★★★</div>
              <p>
                “FinGuard caught a payment I didn't recognise. Simple, fast and
                genuinely useful.”
              </p>
              <footer>
                <b>ROHAN K.</b>
                <span>DEVELOPER · BENGALURU</span>
              </footer>
            </article>
          </div>
        </section>
        <section className="lastCall">
          <span>NO MORE GUESSING.</span>
          <h2>
            SAFER MONEY
            <br />
            STARTS HERE.
          </h2>
          <Link to="/login">
            Get FinGuard <ArrowRight />
          </Link>
        </section>
      </main>
      <footer className="landFooter">
        <b>FINGUARD</b>
        <div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("platform");
            }}
          >
            Platform
          </a>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("stories");
            }}
          >
            Why FinGuard
          </a>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("control");
            }}
          >
            Money moves
          </a>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("about");
            }}
          >
            About
          </a>
          <Link to="/login">Sign in</Link>
        </div>
        <small>© 2026 FinGuard. Built for better money moves.</small>
      </footer>
      {detail && (
        <div
          className="storyModal"
          role="dialog"
          aria-modal="true"
          onClick={() => setDetail(null)}
        >
          <div className="storySheet" onClick={(e) => e.stopPropagation()}>
            <button
              className="storyClose"
              onClick={() => setDetail(null)}
              aria-label="Close details"
            >
              <X />
            </button>
            <span>{info[detail].kicker}</span>
            <h2>{info[detail].title}</h2>
            <p>{info[detail].text}</p>
            <div className="storyStats">
              {info[detail].stats.map((x: string[]) => (
                <div key={x[0]}>
                  <small>{x[0]}</small>
                  <b>{x[1]}</b>
                </div>
              ))}
            </div>
            <div className="storyActions">
              <Link to="/login">
                Open FinGuard <ArrowRight />
              </Link>
              <button onClick={() => setDetail(null)}>Keep exploring</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
