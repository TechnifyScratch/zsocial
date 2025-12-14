
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET || "devsecret";

function auth(req,res,next){
  const token = req.headers.authorization?.split(" ")[1];
  if(!token) return res.sendStatus(401);
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
}

app.post("/auth/register", async (req,res)=>{
  const hash = await bcrypt.hash(req.body.password,10);
  const user = await prisma.user.create({
    data:{ email:req.body.email, username:req.body.username, password:hash }
  });
  res.json(user);
});

app.post("/auth/login", async (req,res)=>{
  const user = await prisma.user.findUnique({ where:{ email:req.body.email }});
  if(!user) return res.sendStatus(401);
  const ok = await bcrypt.compare(req.body.password,user.password);
  if(!ok) return res.sendStatus(401);
  const token = jwt.sign({ id:user.id }, SECRET);
  res.json({ token });
});

app.post("/post", auth, async (req,res)=>{
  const post = await prisma.post.create({
    data:{ content:req.body.content, authorId:req.user.id }
  });
  res.json(post);
});

app.get("/feed", async (req,res)=>{
  const posts = await prisma.post.findMany({
    include:{ author:true },
    orderBy:{ createdAt:"desc" }
  });
  res.json(posts);
});

app.listen(3001,()=>console.log("API on 3001"));
