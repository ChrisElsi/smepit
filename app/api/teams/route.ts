import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE!;

function adminSupabase() {
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// GET /api/teams - Alle Teams laden (hybrid: Supabase + Env fallback)
export async function GET() {
  try {
    const supabase = adminSupabase();
    
    const { data: teams, error } = await supabase
      .from("teams")
      .select("*")
      .order("slug", { ascending: true });

    if (error) {
      console.error("Supabase teams error:", error);
      // Fallback zu Environment Variables
      const envTeams = process.env.NEXT_PUBLIC_TEAMS?.split(',') || ['slowmo'];
      return NextResponse.json(
        envTeams.map((slug, index) => ({
          id: (index + 1).toString(),
          slug: slug.trim(),
          name: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Team`,
          description: `Team ${slug} für iRacing`,
          source: "env",
          created_at: new Date().toISOString()
        }))
      );
    }

    return NextResponse.json(teams || []);
  } catch (error) {
    console.error("Teams API error:", error);
    // Emergency fallback
    return NextResponse.json([
      {
        id: "1",
        slug: "slowmo",
        name: "Slow Mo eSport",
        description: "Das Hauptteam für iRacing",
        source: "fallback"
      },
      {
        id: "2", 
        slug: "slowmo2",
        name: "Slow Mo eSport 2",
        description: "Zweites Team für iRacing",
        source: "fallback"
      },
      {
        id: "3",
        slug: "slowmo3",
        name: "Slow Mo eSport 3", 
        description: "Drittes Team für iRacing",
        source: "fallback"
      }
    ]);
  }
}

// POST /api/teams - Neues Team erstellen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, name, description } = body;

    if (!slug || !name) {
      return NextResponse.json(
        { error: "Slug und Name sind erforderlich" },
        { status: 400 }
      );
    }

    const supabase = adminSupabase();
    
    const { data, error } = await supabase
      .from("teams")
      .insert([{ slug, name, description }])
      .select()
      .single();

    if (error) {
      console.error("Insert team error:", error);
      return NextResponse.json(
        { error: "Team konnte nicht erstellt werden" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("POST teams error:", error);
    return NextResponse.json(
      { error: "Interner Server-Fehler" },
      { status: 500 }
    );
  }
}