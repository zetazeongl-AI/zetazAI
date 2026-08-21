export function Brand({compact=false}:{compact?:boolean}){
  return <span className={`zai-brand ${compact?"compact":""}`} aria-label="ZetaZAI by ZetaZeon">
    <span className="zai-mark" aria-hidden="true"><i/><i/><b>Z</b><em/></span>
    {!compact&&<span className="zai-word">ZetaZ<span>AI</span><small>BY ZETAZEON</small></span>}
  </span>
}
