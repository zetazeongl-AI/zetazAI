/* eslint-disable @next/next/no-img-element */
"use client";
import {CSSProperties,useEffect,useRef,useState} from "react";
import {Brand} from "../brand";
import {ChatAssistant} from "../chat-assistant";
import {TrialStudio} from "../trial-studio";

const features=[
  {icon:"▦",title:"Project workspaces",text:"Create focused projects, save progress, attach documents, and keep every AI output organized.",details:["Create separate workspaces for every client or goal","Attach source files and keep outputs in one place","Save progress and reopen the project from your dashboard"]},
  {icon:"✣",title:"24+ AI models",text:"Choose specialized models for research, code, writing, vision, audio, and complex agentic tasks.",details:["Compare leading text, reasoning, vision, and audio models","Select the right model for each task and budget","Switch models without leaving your active project"]},
  {icon:"⚙",title:"Custom AI agents",text:"Build three task-specific agents with the starter plan. Upgrade whenever your agent team grows.",details:["Give every agent a role, instructions, tools, and knowledge","Reuse agents for research, content, analysis, and support","Create up to three agents on the starter plan"]},
  {icon:"⌕",title:"Knowledge intelligence",text:"Ground answers in trusted documents and 24 expandable expert knowledge collections.",details:["Search and cite your uploaded knowledge sources","Explore 24 expandable expert knowledge collections","Keep project answers grounded in approved information"]},
  {icon:"↗",title:"AI project tools",text:"Summarize, analyze, extract, compare, translate, plan, generate, and automate inside each project.",details:["Turn documents into summaries, plans, slides, and posts","Analyze, compare, translate, extract, and generate","Keep tool results attached to the active project"]},
  {icon:"৳",title:"Local payments",text:"Subscribe from Bangladesh using bKash, Nagad, Rocket, cards, or local bank transfer.",details:["SaaS plans begin at ৳300 per month","Choose bKash, Nagad, Rocket, card, or bank payment","View plan usage and billing status from your dashboard"]}
];
const voices=[
  {image:"/testimonials/founder.webp",name:"Rafi Hasan",role:"AI SaaS Founder · Representative profile",quote:"ZetaZAI brings models, documents, agents, and project execution into one focused system. The local-payment direction makes it especially relevant for Bangladesh."},
  {image:"/testimonials/designer.webp",name:"Maya Rahman",role:"AI Product Designer · Representative profile",quote:"The workspace feels structured without hiding advanced controls. Projects and reusable knowledge make complex AI work much easier to manage."},
  {image:"/testimonials/engineer.webp",name:"Jordan Ellis",role:"Machine Learning Engineer · Representative profile",quote:"Model choice, grounded knowledge, and task-specific agents belong together. ZetaZAI presents that workflow clearly for technical and business teams."}
];

export default function Home(){
  const[loading,setLoading]=useState(true),[slide,setSlide]=useState(0),[rating,setRating]=useState(0);
  const[expanded,setExpanded]=useState<number|null>(null),[failedPortrait,setFailedPortrait]=useState<string|null>(null);
  const detailRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{const t=setTimeout(()=>setLoading(false),1500);return()=>clearTimeout(t)},[]);
  useEffect(()=>{const t=setInterval(()=>setSlide(x=>(x+1)%voices.length),6500);return()=>clearInterval(t)},[]);
  useEffect(()=>{
    if(loading)return;
    const items=[...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    if(!("IntersectionObserver" in window)){items.forEach(x=>x.classList.add("is-visible"));return}
    items.forEach(x=>x.classList.add("reveal-ready"));
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:"0px 0px -5%"});
    items.forEach(x=>observer.observe(x));return()=>observer.disconnect();
  },[loading]);
  const openFeature=(index:number)=>{setExpanded(index);requestAnimationFrame(()=>detailRef.current?.scrollIntoView({behavior:"smooth",block:"nearest"}))};
  if(loading)return <main className="zai-loader"><Brand/><div className="loader-orbit"><i/><i/><b>AI</b></div><p>Preparing your intelligent workspace</p><span><i/></span></main>;
  const voice=voices[slide],selected=expanded===null?null:features[expanded];
  return <main className="saas-home">
    <header><Brand/><nav><a href="#features">Features</a><a href="#trial">Try AI</a><a href="#reviews">Reviews</a><a href="/pricing">Pricing</a><a href="/login">Sign in</a><a className="home-cta" href="/login">Start building →</a></nav></header>
    <section className="home-hero" id="about"><div><small className="hero-eyebrow">ZETAZAI · BUILT BY ZETAZEON</small><h1>Your projects.<br/>Your agents.<br/><b>Every leading AI.</b></h1><p>Create intelligent workspaces, connect documents, build specialized agents, and turn ideas into finished work—from one secure SaaS platform.</p><div><a href="/login">Start from ৳300/month <span>→</span></a><a href="/login?returnTo=/dashboard">Explore workspace</a></div><footer><span>24+ models</span><span>Multimodal tools</span><span>Local payments</span></footer></div><aside><div className="home-workspace-card"><header><i/> LIVE PROJECT</header><h3>Bangladesh SaaS launch</h3><p>12 documents · 3 agents · 8 AI tools</p><div className="home-agent-row"><b>R</b><b>C</b><b>D</b><span>Research · Content · Data</span></div><div className="home-progress"><i/></div><small>AI project health · 84%</small></div><div className="home-float one">✦ Agent completed research</div><div className="home-float two">▧ 4 documents analyzed</div></aside></section>
    <TrialStudio/>
    <section className="home-features" id="features"><header data-reveal><small>ONE OPERATING SYSTEM</small><h2>Everything required to move<br/>from prompt to project.</h2></header><div>{features.map((x,index)=><article data-reveal style={{"--reveal-delay":`${(index%3)*90}ms`} as CSSProperties} className={expanded===index?"active":""} key={x.title}><b>{x.icon}</b><h3>{x.title}</h3><p>{x.text}</p><button type="button" onClick={()=>openFeature(index)} aria-expanded={expanded===index}>Explore <span>→</span></button></article>)}</div>{selected&&<div className="feature-detail" ref={detailRef} role="region" aria-live="polite"><button className="feature-close" onClick={()=>setExpanded(null)} aria-label="Close feature details">×</button><small>EXPLORE ZETAZAI</small><div><b>{selected.icon}</b><section><h3>{selected.title}</h3><p>{selected.text}</p><ul>{selected.details.map(item=><li key={item}>{item}</li>)}</ul><a href="/login?returnTo=/dashboard">Open your workspace <span>→</span></a></section></div></div>}</section>
    <section className="rating-showcase" id="reviews"><header data-reveal><div><small>HUMAN PERSPECTIVE</small><h2>Built for people doing<br/>serious work with AI.</h2></div><div className="rating-summary"><b>4.9</b><span>★★★★★<small>Interface concept rating</small></span></div></header><div className="voice-carousel" data-reveal><div className={`voice-photo ${failedPortrait===voice.image?"portrait-fallback":""}`}>{failedPortrait!==voice.image&&<img src={voice.image} alt={`${voice.name}, representative profile`} onError={()=>setFailedPortrait(voice.image)}/>}<b aria-hidden="true">{voice.name.split(" ").map(x=>x[0]).join("")}</b><span>AI-GENERATED REPRESENTATIVE PORTRAIT</span></div><article key={voice.name}><div className="voice-stars">★★★★★</div><blockquote>“{voice.quote}”</blockquote><h3>{voice.name}</h3><p>{voice.role}</p><footer><button onClick={()=>setSlide((slide+voices.length-1)%voices.length)} aria-label="Previous profile">←</button><div>{voices.map((_,i)=><button aria-label={`Show profile ${i+1}`} className={i===slide?"active":""} onClick={()=>setSlide(i)} key={i}/>)}</div><button onClick={()=>setSlide((slide+1)%voices.length)} aria-label="Next profile">→</button></footer></article></div><div className="rate-us" data-reveal><div><b>Rate your ZetaZAI experience</b><span>Your feedback helps improve the workspace.</span></div><div>{[1,2,3,4,5].map(x=><button className={x<=rating?"selected":""} onClick={()=>setRating(x)} aria-label={`Rate ${x} stars`} key={x}>★</button>)}</div><strong>{rating?`Thank you — ${rating}/5`:"Select a rating"}</strong></div></section>
    <footer className="site-footer"><div className="footer-main"><Brand/><p>Build intelligent projects with leading AI models, trusted knowledge, documents, and specialized agents.</p><a className="email-contact" href="mailto:info@zetazai.com?subject=ZetaZAI%20Enquiry&body=Hello%20ZetaZAI%20team%2C%0A%0AI%20would%20like%20to%20discuss%3A%20">✉ Email info@zetazai.com <span>→</span></a></div><div className="footer-links"><section><b>Product</b><a href="#features">Features</a><a href="/pricing">Pricing</a><a href="/login">Sign in</a></section><section><b>Workspace</b><a href="/login?returnTo=/dashboard">Projects</a><a href="/login?returnTo=/dashboard">Agents</a><a href="/login?returnTo=/dashboard">Knowledge</a></section><section><b>Company</b><a href="mailto:info@zetazai.com">Contact</a><a href="#about">About ZetaZAI</a><a href="#about">Built by ZetaZeon</a></section></div><div className="footer-bottom"><span>© 2026 ZetaZAI by ZetaZeon. All rights reserved.</span><span>Bangladesh · Global</span></div></footer>
    <ChatAssistant/>
  </main>
}
