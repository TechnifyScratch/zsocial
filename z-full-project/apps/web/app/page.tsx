
'use client'
import { useEffect, useState } from "react";

export default function Home() {
  const [posts,setPosts] = useState<any[]>([]);

  useEffect(()=>{
    fetch("http://localhost:3001/feed")
      .then(r=>r.json())
      .then(setPosts);
  },[]);

  return (
    <main style={{maxWidth:600,margin:"auto"}}>
      <h1>Z</h1>
      {posts.map(p=>(
        <div key={p.id} style={{borderBottom:"1px solid #333",padding:12}}>
          <b>@{p.author.username}</b>
          <p>{p.content}</p>
        </div>
      ))}
    </main>
  )
}
