import {AnimatePresence,motion,useReducedMotion} from 'framer-motion';
import {X} from 'lucide-react';
import {ReactNode,useEffect,useRef} from 'react';

export default function Drawer({open,title,subtitle,onClose,children,label=title,disableMotion=false}:{open:boolean;title:string;subtitle?:string;onClose:()=>void;children:ReactNode;label?:string;disableMotion?:boolean}){
  const panel=useRef<HTMLElement>(null);
  const systemReducedMotion=useReducedMotion();
  const reducedMotion=!!systemReducedMotion||disableMotion;
  useEffect(()=>{
    if(!open)return;
    const previousFocus=document.activeElement as HTMLElement|null;
    const key=(event:KeyboardEvent)=>{
      if(event.key==='Escape')onClose();
      if(event.key==='Tab'&&panel.current){
        const controls=[...panel.current.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')];
        if(!controls.length)return;
        const first=controls[0],last=controls[controls.length-1];
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
      }
    };
    document.addEventListener('keydown',key);
    const previous=document.body.style.overflow;document.body.style.overflow='hidden';
    requestAnimationFrame(()=>panel.current?.querySelector<HTMLElement>('.drawerClose')?.focus());
    return()=>{document.removeEventListener('keydown',key);document.body.style.overflow=previous;previousFocus?.focus()};
  },[open,onClose]);
  return <AnimatePresence>{open&&<div className="drawerLayer">
    <motion.button className="drawerBackdrop" aria-label="Close drawer" onClick={onClose} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}/>
    <motion.aside ref={panel} className="appDrawer" role="dialog" aria-modal="true" aria-label={label} initial={reducedMotion?false:{x:'100%'}} animate={{x:0}} exit={reducedMotion?{opacity:0}:{x:'100%'}} transition={{duration:reducedMotion?0:.24,ease:[.22,1,.36,1]}}>
      <header><div><span>FINGUARD</span><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div><button className="drawerClose" aria-label={`Close ${title}`} onClick={onClose}><X/></button></header>
      <div className="drawerBody">{children}</div>
    </motion.aside>
  </div>}</AnimatePresence>
}