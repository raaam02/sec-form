import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const API_TRPC_URL = process.env.API_URL || "http://localhost:4000/trpc";

async function handleProxy(req: NextRequest) {
  const session = await auth();
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\/trpc-proxy/, "");
  
  const targetUrl = `${API_TRPC_URL}${path}${url.search}`;
  
  const headers = new Headers();
  
  // Forward critical headers
  req.headers.forEach((val, key) => {
    if (key !== "host" && key !== "connection" && key !== "content-length") {
      headers.set(key, val);
    }
  });

  // Inject authenticated user ID if session exists
  if (session?.user?.id) {
    headers.set("x-user-id", session.user.id);
  }

  // Read request body
  let body: any = null;
  if (req.method === "POST" || req.method === "PUT") {
    try {
      body = await req.text();
    } catch (e) {
      // Ignore empty body
    }
  }

  try {
    const res = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: body || undefined,
      cache: "no-store",
    });

    const responseHeaders = new Headers();
    res.headers.forEach((val, key) => {
      if (key !== "content-encoding" && key !== "transfer-encoding") {
        responseHeaders.set(key, val);
      }
    });

    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    console.error("Proxy fetch error:", err);
    return NextResponse.json(
      { error: "Failed to connect to backend api server" },
      { status: 502 }
    );
  }
}

export { handleProxy as GET, handleProxy as POST, handleProxy as PUT, handleProxy as DELETE };
