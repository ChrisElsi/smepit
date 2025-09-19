import { NextResponse } from 'next/server';

export async function GET() {
  const envCheck = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
    SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE ? 'SET' : 'MISSING', 
    NEXT_PUBLIC_TEAMS: process.env.NEXT_PUBLIC_TEAMS ? 'SET' : 'MISSING',
    
    SUPABASE_URL_START: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 40),
    TEAMS_VALUE: process.env.NEXT_PUBLIC_TEAMS,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL ? 'true' : 'false'
  };

  return NextResponse.json(envCheck);
}
