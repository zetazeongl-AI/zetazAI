"use client";
import {ChangeEvent,useEffect,useRef,useState} from "react";

type OutputType="video"|"presentation"|"social";
type TrialFile={id:string;name:string;size:string};
type VoiceState="idle"|"listening"|"unsupported"|"denied";
type VoiceResult={0:{transcript:string};isFinal:boolean};
type VoiceRecognition={
  continuous:boolean;interimResults:boolean;lang:string;
  start:()=>void;stop:()=>void;
  onstart:(()=>void)|null;onend:(()=>void)|null;
  onresult:((event:{results:ArrayLike<VoiceResult>})=>void)|null;
  onerror:((event:{error:string})=>void)|null;
};
type VoiceConstructor=new()=>VoiceRecognition;

const outputs:{id:OutputType;icon:string;title:string;detail:string}[]=[
  {id:"video",icon:"▶",title:"Make video",detail:"Script, scenes and production plan"},
  {id:"presentation",icon:"▤",title:"Presentation",detail:"Structured slides and speaker notes"},
  {id:"social",icon:"✦",title:"Social media post",detail:"Platform-ready copy and creative brief"}
];

export function TrialStudio(){
  const[prompt,setPrompt]=useState("");
  const[type,setType]=useState<OutputType>("video");
  const[files,setFiles]=useState<TrialFile[]>([]);
  const[status,setStatus]=useState<"idle"|"working"|"ready"|"error">("idle");
  const[voiceState,setVoiceState]=useState<VoiceState>("idle");
  const input=useRef<HTMLInputElement>(null);
  const recognition=useRef<VoiceRecognition|null>(null);

  useEffect(()=>()=>recognition.current?.stop(),[]);
  function attach(event:ChangeEvent<HTMLInputElement>){
    const selected=Array.from(event.target.files||[]).slice(0,5-files.length).map(file=>({id:crypto.randomUUID(),name:file.name,size:file.size<1048576?`${Math.max(1,Math.round(file.size/1024))} KB`:`${(file.size/1048576).toFixed(1)} MB`}));
    setFiles(current=>[...current,...selected].slice(0,5));event.target.value="";setStatus("idle");
  }
  function toggleVoice(){
    if(voiceState==="listening"){recognition.current?.stop();return}
    const browser=window as typeof window&{SpeechRecognition?:VoiceConstructor;webkitSpeechRecognition?:VoiceConstructor};
    const Recognition=browser.SpeechRecognition||browser.webkitSpeechRecognition;
    if(!Recognition){setVoiceState("unsupported");return}
    const agent=new Recognition();
    agent.continuous=false;agent.interimResults=false;agent.lang=navigator.language||"en-US";
    agent.onstart=()=>setVoiceState("listening");
    agent.onresult=event=>{
      let spoken="";
      for(let i=0;i<event.results.length;i++)if(event.results[i].isFinal)spoken+=event.results[i][0].transcript;
      if(spoken.trim())setPrompt(current=>`${current}${current.trim()?" ":""}${spoken.trim()}`);
      setStatus("idle");
    };
    agent.onerror=event=>setVoiceState(event.error==="not-allowed"||event.error==="service-not-allowed"?"denied":"idle");
    agent.onend=()=>setVoiceState(current=>current==="denied"||current==="unsupported"?current:"idle");
    recognition.current=agent;
    try{agent.start()}catch{setVoiceState("idle")}
  }
  function generate(){
    if(!prompt.trim()&&!files.length){setStatus("error");return}
    setStatus("working");window.setTimeout(()=>setStatus("ready"),1400);
  }
  const active=outputs.find(item=>item.id===type)!;
  const voiceMessage=voiceState==="listening"?"Listening — speak now":voiceState==="unsupported"?"Voice input is not supported in this browser":voiceState==="denied"?"Microphone permission is required":"Speak your prompt";

  return <section className="trial-studio" id="trial">
    <header><small>TRY ZETAZAI FREE</small><h2>Describe it. Attach it.<br/><b>Create with AI.</b></h2><p>Test the multimodal workspace before signing in. Add a prompt, upload reference files, use the voice agent, and choose what you want to create.</p></header>
    <div className="trial-shell">
      <div className="trial-types">{outputs.map(item=><button className={type===item.id?"active":""} onClick={()=>{setType(item.id);setStatus("idle")}} key={item.id}><b>{item.icon}</b><span><strong>{item.title}</strong><small>{item.detail}</small></span></button>)}</div>
      <div className={`trial-composer ${voiceState==="listening"?"voice-listening":""}`}>
        {files.length>0&&<div className="trial-files">{files.map(file=><span key={file.id}><b>▱</b><i>{file.name}<small>{file.size}</small></i><button onClick={()=>setFiles(items=>items.filter(x=>x.id!==file.id))} aria-label={`Remove ${file.name}`}>×</button></span>)}</div>}
        <textarea value={prompt} onChange={e=>{setPrompt(e.target.value);setStatus("idle")}} placeholder={`Describe the ${active.title.toLowerCase()} you want ZetaZAI to create…`} aria-label="Trial prompt"/>
        <input ref={input} hidden multiple type="file" accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.txt,.csv" onChange={attach}/>
        <footer>
          <div className="trial-input-tools">
            <button onClick={()=>input.current?.click()}>↥ <span>Upload files</span></button>
            <button className={`voice-agent ${voiceState==="listening"?"active":""}`} onClick={toggleVoice} aria-pressed={voiceState==="listening"} title={voiceMessage}><b>◉</b> <span>{voiceState==="listening"?"Stop voice":"Voice agent"}</span></button>
            <small>{voiceState==="idle"?`${files.length}/5 attached · 25 MB each`:voiceMessage}</small>
          </div>
          <button className="trial-generate" disabled={status==="working"} onClick={generate}>{status==="working"?"Creating…":`Create ${active.title} →`}</button>
        </footer>
        {(voiceState==="unsupported"||voiceState==="denied")&&<p className="trial-voice-note" role="status">{voiceMessage}. You can continue by typing your prompt.</p>}
        {status==="error"&&<p className="trial-error" role="alert">Add a message or attach at least one file to begin.</p>}
        {status==="ready"&&<div className="trial-result" role="status"><b>✓ Trial concept ready</b><span>Your {active.title.toLowerCase()} plan has been prepared. Sign in to generate, edit, save, and export the complete result.</span><a href="/login?returnTo=/dashboard">Continue in workspace →</a></div>}
      </div>
    </div>
    <footer><span>✓ Voice-assisted prompts</span><span>✓ Files stay in this browser trial</span><span>✓ Sign in to save results</span></footer>
  </section>
}
