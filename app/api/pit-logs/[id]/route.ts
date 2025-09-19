import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE!;

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15 Requirement)
    const params = await context.params;
    
    // Supabase Client mit Service Role Key
    const supabase = createClient(url, serviceKey);
    
    // Token aus Header prüfen (optional für Sicherheit)
    const authHeader = request.headers.get('authorization');
    const deleteToken = process.env.DASH_DELETE_TOKEN;
    
    if (deleteToken && authHeader !== `Bearer ${deleteToken}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Eintrag aus Datenbank löschen
    const { error } = await supabase
      .from('pit_logs')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Supabase Delete Error:', error);
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Pit-Log ${params.id} gelöscht`,
      deleted_id: params.id
    });

  } catch (error: any) {
    console.error('Delete API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Unbekannter Fehler beim Löschen'
    }, { status: 500 });
  }
}