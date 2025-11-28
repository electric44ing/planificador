import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { google } from "googleapis";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "No autenticado con Google." },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");

    if (!year) {
      return NextResponse.json(
        { error: "El año es un parámetro requerido." },
        { status: 400 },
      );
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });
    const drive = google.drive({ version: "v3", auth });

    // 1. Check for the year folder
    const yearFolderQuery = `mimeType='application/vnd.google-apps.folder' and name='${year}' and 'root' in parents and trashed=false`;
    const yearFolderRes = await drive.files.list({
      q: yearFolderQuery,
      fields: "files(id, name)",
      spaces: "drive",
    });

    const yearFolder = yearFolderRes.data.files?.[0];

    if (!yearFolder) {
      return NextResponse.json({
        yearFolderExists: false,
        studyFolderExists: false,
        yearFolder: null,
        studyFolder: null,
      });
    }

    // 2. Check for the "OBRAS EN ESTUDIO" subfolder
    const studyFolderName = "OBRAS EN ESTUDIO";
    const studyFolderQuery = `mimeType='application/vnd.google-apps.folder' and name='${studyFolderName}' and '${yearFolder.id}' in parents and trashed=false`;
    const studyFolderRes = await drive.files.list({
      q: studyFolderQuery,
      fields: "files(id, name)",
      spaces: "drive",
    });

    const studyFolder = studyFolderRes.data.files?.[0];

    return NextResponse.json({
      yearFolderExists: true,
      studyFolderExists: !!studyFolder,
      yearFolder: yearFolder,
      studyFolder: studyFolder || null,
    });
  } catch (error) {
    console.error("Error checking folder structure in Google Drive:", error);
    // Check for auth errors (e.g., expired token)
    if ((error as any).code === 401) {
      return NextResponse.json(
        {
          error:
            "Token de Google inválido o expirado. Por favor, inicia sesión de nuevo.",
        },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { error: "Error al contactar la API de Google Drive." },
      { status: 500 },
    );
  }
}
