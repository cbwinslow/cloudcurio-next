"use client";
import { useState } from "react";
import TurnstileWidget from "@/src/components/TurnstileWidget";
export default function UploadsPage(){
  const [file, setFile] = useState<File|null>(null);
  const [tk, setTk] = useState("");
  const [status, setStatus] = useState<string>("");
  const [signedUrl, setSignedUrl] = useState<string>("");
  const [key, setKey] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  async function signAndUpload(){
    if (!file) { alert("Pick a file first"); return; }
    const desiredKey = `uploads/${Date.now()}-${file.name}`;
    setStatus("Requesting signature...");
    const r = await fetch("/api/uploads/sign", { method:"POST", headers: { "x-turnstile-token": tk }, body: JSON.stringify({ key: desiredKey, method: "PUT" }) });
    const j = await r.json(); if (!j.ok) { alert("Sign error"); return; } setSignedUrl(j.url); setKey(desiredKey);
    setStatus("Uploading..."); await uploadWithProgress(j.url, file, (p)=>setProgress(p)); setStatus("Done!");
  }
  async function uploadWithProgress(url: string, file: File, onP: (n:number)=>void){
    await new Promise<void>((resolve, reject)=>{ const xhr = new XMLHttpRequest(); xhr.open("PUT", url); xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream"); xhr.upload.onprogress = (e)=>{ if (e.lengthComputable) onP(Math.round(e.loaded / e.total * 100)); }; xhr.onload = ()=>{ if (xhr.status >= 200 && xhr.status < 300) resolve(); else reject(new Error("upload failed")); }; xhr.onerror = ()=> reject(new Error("xhr error")); xhr.send(file); });
  }
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Direct R2 Uploads (Presigned)</h2>
      <TurnstileWidget siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string} action="upload_sign" onToken={setTk} />
      <input type="file" onChange={e=>setFile(e.target.files?.[0] || null)} />
      <button onClick={signAndUpload} className="px-3 py-2 bg-sky-600 rounded">Sign & Upload</button>
      {status && <div>Status: {status} {progress?`(${progress}%)`:""}</div>}
      {signedUrl && <div className="text-sm break-all">Signed URL: {signedUrl}</div>}
      {key && <div className="text-sm break-all">R2 Key: {key}</div>}
    </div>
  );
}
