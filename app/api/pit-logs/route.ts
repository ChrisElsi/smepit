import { NextRequest, NextResponse } from 'next/server';
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

// GET /api/pit-logs?team_slug=slowmo
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teamSlug = searchParams.get('team_slug') || 'slowmo';
    const limit = parseInt(searchParams.get('limit') || '25');
    
    console.log(`Pit-logs GET request for team: ${teamSlug}`);
    
    const supabase = adminSupabase();
    
    const { data, error } = await supabase
      .from("pit_logs")
      .select(`
        id,
        team_slug,
        driver_name,
        car_name,
        session_type,
        track,
        fuel_before_l,
        fuel_added_l,
        fuel_after_l,
        pit_box_time_s,
        tire_change,
        compound_after,
        created_at,
        ts
      `)
      .eq('team_slug', teamSlug)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Supabase pit_logs error:", error);
      return NextResponse.json(
        { error: "Pit-Logs konnten nicht geladen werden", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      team_slug: teamSlug,
      count: data?.length || 0,
      data: data || []
    });

  } catch (error) {
    console.error("GET pit-logs error:", error);
    return NextResponse.json(
      { error: "Interner Server-Fehler", details: error instanceof Error ? error.message : "Unbekannter Fehler" },
      { status: 500 }
    );
  }
}

// POST /api/pit-logs
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("POST request data:", body);
    
    // Validierung der erforderlichen Felder
    const { team_slug, driver_name, session_type } = body;
    
    if (!team_slug || !driver_name || !session_type) {
      return NextResponse.json(
        { error: "team_slug, driver_name und session_type sind erforderlich" },
        { status: 400 }
      );
    }

    const supabase = adminSupabase();
    
    // Pit-Log in Database speichern
    const pitLogData = {
      team_slug: team_slug,
      driver_name: driver_name || "Unbekannter Fahrer",
      car_name: body.car_name || "Unbekanntes Auto",
      session_type: session_type,
      track: body.track || "Unbekannte Strecke",
      fuel_before_l: parseFloat(body.fuel_before_l) || 0,
      fuel_added_l: parseFloat(body.fuel_added_l) || 0,
      fuel_after_l: parseFloat(body.fuel_after_l) || 0,
      pit_box_time_s: parseFloat(body.pit_box_time_s) || 0,
      tire_change: Boolean(body.tire_change),
      compound_after: body.compound_after || "",
      ts: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("pit_logs")
      .insert([pitLogData])
      .select()
      .single();

    if (error) {
      console.error("Insert pit_log error:", error);
      return NextResponse.json(
        { error: "Pit-Log konnte nicht gespeichert werden", details: error.message },
        { status: 500 }
      );
    }

    console.log("Pit-Log erfolgreich gespeichert:", data);
    
    return NextResponse.json({
      success: true,
      message: "Pit-Log erfolgreich erstellt",
      data: data
    });

  } catch (error) {
    console.error("POST pit-logs error:", error);
    return NextResponse.json(
      { error: "Interner Server-Fehler", details: error instanceof Error ? error.message : "Unbekannter Fehler" },
      { status: 500 }
    );
  }
}