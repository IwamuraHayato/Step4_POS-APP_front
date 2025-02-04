require('dotenv').config()
/** @type {import('next').NextConfig} */
console.log("NEXT_PUBLIC_API_ENDPOINT:", process.env.NEXT_PUBLIC_API_ENDPOINT); 
const nextConfig = {
    output: 'standalone',
    env: {
        // Reference a variable that was defined in the .env file and make it available at Build Time
        API_ENDPOINT: process.env.API_ENDPOINT,
      },
}

module.exports = nextConfig
