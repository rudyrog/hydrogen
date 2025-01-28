import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupQuery = searchParams.get("group");

  if (!groupQuery) {
    return NextResponse.json(
      { error: "Group query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const filePath = path.resolve(process.cwd(), "src/data/elements.json");
    const data = fs.readFileSync(filePath, "utf8");
    const elements = JSON.parse(data);

    const normalizedQuery = groupQuery.toLowerCase().replace(/\s+/g, "");
    console.log(normalizedQuery , elements[10].GroupBlock.toLowerCase().replace(/\s+/g, "") )
    const filteredElements = Array.isArray(elements)
      ? elements.filter((el: any) => {
          if (!el.GroupBlock) return false; 
          const normalizedGroup = el.GroupBlock.toLowerCase().replace(/\s+/g, "");
          return normalizedGroup === normalizedQuery;
        })
      : [];
    if (filteredElements.length > 0) {
      return NextResponse.json(filteredElements);
    } else {
      return NextResponse.json(
        { error: `No elements found for group: ${groupQuery}` },
        { status: 404 }
      );
    }
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch elements" },
      { status: 500 }
    );
  }
}
