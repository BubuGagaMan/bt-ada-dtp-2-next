import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import path from "path";
import fs from "fs";
import formatDate from "@/app/utils/formatDate";

// Load service account credentials
const CREDENTIALS_PATH = path.join(process.cwd(), "service-account.json");
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));

// Replace with your actual sheet ID
const SHEET_ID = process.env.SHEET_ID

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;
    const timeOfResponse = formatDate()

    if (!name || !message) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:D", // adjust columns to match sheet
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[name, email || "", message, timeOfResponse]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
