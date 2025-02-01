import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export function GET(req: NextRequest) {
  const API_KEY = process.env.API_SECRET_KEY;
  const requestKey = req.headers.get("x-api-key");
  if (!requestKey || requestKey !== API_KEY) {
    return NextResponse.json(
      { error: "Cant access this without an API key!" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(req.url);
  const min = parseInt(searchParams.get("min") || "1", 10);
  const max = parseInt(searchParams.get("max") || "118", 10);

  try {
    const filePath = path.resolve(process.cwd(), "src/data/elements.json");
    const data = fs.readFileSync(filePath, "utf8");
    const elements = JSON.parse(data);

    const minAtomicNumber = Math.max(1, min);
    const maxAtomicNumber = Math.min(elements.length, max);

    const filteredElements = Array.isArray(elements)
      ? elements.filter(
          (el: any) =>
            el.AtomicNumber >= minAtomicNumber &&
            el.AtomicNumber <= maxAtomicNumber,
        )
      : [];

    if (filteredElements.length > 0) {
      return NextResponse.json(filteredElements);
    } else {
      return NextResponse.json(
        { error: "No elements found in the specified range" },
        { status: 404 },
      );
    }
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch elements" },
      { status: 500 },
    );
  }
}
