import { NextRequest, NextResponse } from "next/server";
import { siteUrl } from "@/i18n/config";
import { isStagingHost, NOINDEX_VALUE } from "@/lib/noindex-headers";

const productionRobots = `
User-agent: *
Allow: /
Sitemap: ${siteUrl}/sitemap.xml
Sitemap: ${siteUrl}/sitemap-blog.xml
`;

const stagingRobots = `User-agent: *
Disallow: /
`;

export async function GET(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const isStaging = isStagingHost(host);
  const content = isStaging ? stagingRobots : productionRobots;

  const headers: Record<string, string> = { "Content-Type": "text/plain; charset=utf-8" };
  if (isStaging) {
    headers["X-Robots-Tag"] = NOINDEX_VALUE;
  }

  return new NextResponse(content, { headers });
}
