"use client";
import { useEffect, useRef } from "react";
declare global { interface Window { turnstile?: any } }
export default function TurnstileWidget({ siteKey, action, onToken }:{ siteKey:string; action:string; onToken:(t:string)=>void}){
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function render() {
      if (!window.turnstile || !ref.current) return;
      window.turnstile.render(ref.current, { sitekey: siteKey, action, callback: (token:string) => onToken(token), "error-callback": () => onToken(""), "timeout-callback": () => onToken("") });
    }
    const i = setInterval(() => { if (window.turnstile) { clearInterval(i); render(); } }, 200);
    return () => clearInterval(i);
  }, [siteKey, action]);
  return <div ref={ref} className="cf-turnstile" />;
}
