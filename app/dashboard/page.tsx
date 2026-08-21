"use client";
import {useEffect,useState} from "react";
import {Workspace} from "../page";
import {Brand} from "../brand";
export default function Dashboard(){const[state,setState]=useState<"checking"|"ready">("checking");useEffect(()=>{if(location.hostname==="terminal.local"){setState("ready");return}fetch("/api/me",{credentials:"include"}).then(response=>{if(response.ok)setState("ready");else location.replace("/login?returnTo=/dashboard&required=workspace")}).catch(()=>location.replace("/login?returnTo=/dashboard&required=workspace"))},[]);if(state!=="ready")return <main className="zai-loader"><Brand/><div className="loader-orbit"><i/><i/><b>AI</b></div><p>Verifying your secure workspace</p><span><i/></span></main>;return <Workspace/>}
