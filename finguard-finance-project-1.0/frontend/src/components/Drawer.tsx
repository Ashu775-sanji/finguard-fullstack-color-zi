import {AnimatePresence,motion,useReducedMotion} from 'framer-motion';
import {createPortal} from 'react-dom';
import {X} from 'lucide-react';
import {ReactNode,useEffect,useId,useRef} from 'react';
let modalStack:string[]=[];
let originalOverflow='',originalRootInert=false,originalAriaHidden:string|null=null;
function updateModalLayers(){document.querySelectorAll<HTMLElement>('.drawerLayer[data-drawer-id]').forEach(el=>{const active=el.dataset.drawerId===modalStack[modalStack.length-1];el.inert=!active;if(active)el.removeAttribute('aria-hidden');else el.setAttribute('aria-hidden','true')})}
export default function Drawer({open,title,subtitle,onClose,children,label=title,disableMotion=false}:{open:boolean;title:string;subtitle?:string;onClose:()=>void;children:ReactNode;label?:string;disableMotion?:boolean}){
  const panel=useRef<HTMLElement>(null),closeRef=useRef(onClose),id=useId();closeRef.current=onClose;
  const reducedMotion=!!useReducedMotion()||disableMotion;
  useEffect(()=>{
    if(!open)return;
    const previousFocus=document.activeElement as HTMLElement|null,root=document.getElementById('root');
    if(!modalStack.length){originalOverflow=document.body.style.overflow;originalRootInert=root?.inert||false;originalAriaHidden=root?.getAttribute('aria-hidden')??null;document.body.style.overflow='hidden';if(root){root.inert=true;root.setAttribute('aria-hidden','true')}}
    modalStack.push(id);updateModalLayers();
    const key=(event:KeyboardEvent)=>{
      if(modalStack[modalStack.length-1]!==id)return;
      if(event.key==='Escape'){event.preventDefault();event.stopPropagation();closeRef.current()}
      if(event.key==='Tab'&&panel.current){
        const controls=[...panel.current.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el=>el.getClientRects().length&&!el.closest('[inert]'));
        if(!controls.length){event.preventDefault();panel.current.focus();return}
        const first=controls[0],last=controls[controls.length-1];
        if(event.shiftKey&&(document.activeElement===first||!panel.current.contains(document.activeElement))){event.preventDefault();last.focus()}
        else if(!event.shiftKey&&(document.activeElement===last||!panel.current.contains(document.activeElement))){event.preventDefault();first.focus()}
      }
    };
    document.addEventListener('keydown',key);const frame=requestAnimationFrame(()=>{if(panel.current&&!panel.current.contains(document.activeElement))panel.current.querySelector<HTMLElement>('.drawerClose')?.focus()});
    return()=>{
      cancelAnimationFrame(frame);document.removeEventListener('keydown',key);modalStack=modalStack.filter(x=>x!==id);updateModalLayers();
      if(!modalStack.length){document.body.style.overflow=originalOverflow;if(root){root.inert=originalRootInert;if(originalAriaHidden===null)root.removeAttribute('aria-hidden');else root.setAttribute('aria-hidden',originalAriaHidden)}}
      if(previousFocus?.isConnected&&!previousFocus.closest('[inert]'))previousFocus.focus({preventScroll:true});
    };
  },[open,id]);
  return createPortal(<AnimatePresence>{open&&<div className="drawerLayer" data-drawer-id={id}>
    <motion.button className="drawerBackdrop" tabIndex={-1} aria-label="Close drawer" onClick={onClose} initial={reducedMotion?false:{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reducedMotion?0:.2}}/>
    <motion.aside ref={panel} className="appDrawer" tabIndex={-1} role="dialog" aria-modal="true" aria-label={label} initial={reducedMotion?false:{x:'100%'}} animate={{x:0}} exit={reducedMotion?{opacity:0}:{x:'100%'}} transition={{duration:reducedMotion?0:.24,ease:[.22,1,.36,1]}}>
      <header><div><span>FINGUARD</span><h2 id={`${id}-title`}>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div><button className="drawerClose" aria-label={`Close ${title}`} onClick={onClose}><X/></button></header>
      <div className="drawerBody">{children}</div>
    </motion.aside>
  </div>}</AnimatePresence>,document.body);
}
