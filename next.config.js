/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',   // ❌ entfernen
  // optional:
  // output: 'standalone' // ✅ für Vercel ok
};
export default nextConfig; // bei .mjs
// module.exports = nextConfig; // bei .js
