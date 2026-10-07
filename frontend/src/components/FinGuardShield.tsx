import {motion,useMotionValue,useSpring} from 'framer-motion';
import {ShieldCheck} from 'lucide-react';
import {PointerEvent} from 'react';
type Props={score:number;status:string;quiet:boolean;onExplore:()=>void;scanning?:boolean};
export default function FinGuardShield({score,status,quiet,onExplore,scanning=false}:Props){
  const x=useMotionValue(0),y=useMotionValue(0),rx=useSpring(x,{stiffness:90,damping:25}),ry=useSpring(y,{stiffness:90,damping:25});
  function move(event:PointerEvent<HTMLButtonElement>){if(quiet||event.pointerType!=='mouse')return;const r=event.currentTarget.getBoundingClientRect();x.set(-(event.clientY-r.top-r.height/2)/r.height*7);y.set((event.clientX-r.left-r.width/2)/r.width*9)}
  function settle(){x.set(0);y.set(0)}
  return <button className="shieldButton" onClick={onExplore} onPointerMove={move} onPointerLeave={settle} onBlur={settle} aria-label={`Explain financial safety score ${score} out of 100, ${status}`}>
    <motion.div className={`commandShield materialShield ${scanning?'shieldScanning':''}`} style={quiet?{}:{rotateX:rx,rotateY:ry}} animate={quiet?{y:0}:{y:[0,-4,0]}} transition={{duration:9,repeat:quiet?0:Infinity,ease:'easeInOut'}}>
      <i className="shieldMetalEdge" aria-hidden="true"/><i className="shieldGlassFace" aria-hidden="true"/><i className="shieldReflection" aria-hidden="true"/><i className="shieldScanBeam" aria-hidden="true"/>
      <div className="shieldData"><ShieldCheck aria-hidden="true"/><strong>{score}</strong><span className="shieldScale">/ 100</span><span className="shieldStatus">{status}</span></div>
    </motion.div>
  </button>;
}
