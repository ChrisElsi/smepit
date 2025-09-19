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

export const runtime   = 'nodejs';
export const dynamic   = 'force-dynamic';
export const revalidate = 0;
// POST /api/iracing/webhook - Empfängt Daten von der iRacing Bridge
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("iRacing Webhook received data:", body);
    
    // Validierung der erforderlichen Felder
    const { team_slug, driver_name, session_type } = body;
    
    if (!team_slug) {
      return NextResponse.json(
        { error: "team_slug ist erforderlich" },
        { status: 400 }
      );
    }

    const supabase = adminSupabase();
    
    // Pit-Stop-Daten für Database vorbereiten
    const pitStopData = {
      team_slug: team_slug,
      driver_name: driver_name || "Bridge Driver",
      car_name: body.car_name || "iRacing Vehicle",
      session_type: session_type || "Unknown",
      track: body.track || "Unknown Track",
      fuel_before_l: parseFloat(body.fuel_before_l) || 0,
      fuel_added_l: parseFloat(body.fuel_added_l) || 0,
      fuel_after_l: parseFloat(body.fuel_after_l) || 0,
      pit_box_time_s: parseFloat(body.pit_box_time_s) || 0,
      tire_change: Boolean(body.tire_change),
      compound_after: body.compound_after || "",
      // Erweiterte iRacing Daten
      car_id: body.car_id || null,
      driver_id: body.driver_id || null,
      fuel_before_pct: parseFloat(body.fuel_before_pct) || null,
      fuel_after_pct: parseFloat(body.fuel_after_pct) || null,
      ts: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    // In Supabase speichern
    const { data, error } = await supabase
      .from("pit_logs")
      .insert([pitStopData])
      .select()
      .single();

    if (error) {
      console.error("Webhook insert error:", error);
      return NextResponse.json(
        { error: "Pit-Stop konnte nicht gespeichert werden", details: error.message },
        { status: 500 }
      );
    }

    console.log("iRacing Webhook: Pit-Stop erfolgreich gespeichert", data);
    
    return NextResponse.json({
      success: true,
      id: data.id,
      team_slug: data.team_slug,
      message: "Pit-Stop erfolgreich empfangen und gespeichert"
    });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook-Fehler", details: error instanceof Error ? error.message : "Unbekannter Fehler" },
      { status: 500 }
    );
  }
}

// GET /api/iracing/webhook - Webhook-Status prüfen
export async function GET() {
  return NextResponse.json({
    status: "active",
    webhook: "iRacing Bridge Webhook",
    endpoints: {
      post: "Empfängt Pit-Stop Daten von iRacing Bridge",
      get: "Status-Check"
    },
    timestamp: new Date().toISOString()
  });
}