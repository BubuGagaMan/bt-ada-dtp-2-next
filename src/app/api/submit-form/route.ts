import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import formatDate from "@/app/utils/formatDate";

const credentials = {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID!,
    private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"), // fix for newlines
    client_email: process.env.GOOGLE_CLIENT_EMAIL!,
    token_uri: "https://oauth2.googleapis.com/token",
};

const SHEET_ID = process.env.SHEET_ID;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, message } = body;
        const timeOfResponse = formatDate();

        if (!name || !message) {
            return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
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
    } catch (err: unknown) {
        let errorMessage = "An unexpected error occurred";

        if (err instanceof Error) {
            errorMessage = err.message;
        } else if (typeof err === "string") {
            errorMessage = err;
        }

        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
