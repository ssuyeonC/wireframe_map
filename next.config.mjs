/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

const nextConfig = {
  // Export static HTML for GitHub Pages
  output: "export",
  // Set basePath/assetPrefix when deploying to project pages, e.g. /repo
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  // In case next/image is used anywhere
  images: { unoptimized: true },
}

export default nextConfig

