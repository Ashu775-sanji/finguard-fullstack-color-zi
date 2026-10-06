import {AnimatePresence,motion} from 'framer-motion';
import {X} from 'lucide-react';
import {ReactNode,useEffect} from 'react';

export default function Drawer({open,title,subtitle,onClose,children,label=title}:{open:boolean;title:string;subtitle?:string;onClose:()=>void;children:ReactNode;label?:string}){
  useEffect(()=>{
    if(!open)return;
    const key=(event:KeyboardEvent)=>{if(event.key==='Escape')onClose()};
    document.addEventListener('keydown',key);
    const previous=document.body.style.overflow;document.body.style.overflow='hidden';
    return()=>{document.removeEventListener('keydown',key);document.body.style.overflow=previous};
  },[open,onClose]);
  return <AnimatePresence>{open&&<div className="drawerLayer">
    <motion.button className="drawerBackdrop" aria-label="Close drawer" onClick={onClose} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}/>
    <motion.aside className="appDrawer" role="dialog" aria-modal="true" aria-label={label} initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{duration:.24,ease:[.22,1,.36,1]}}>
      <header><div><span>FINGUARD</span><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div><button className="drawerClose" aria-label={`Close ${title}`} onClick={onClose}><X/></button></header>
      <div className="drawerBody">{children}</div>
    </motion.aside>
  </div>}</AnimatePresence>
}