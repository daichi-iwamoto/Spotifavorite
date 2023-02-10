"use client";
import { useEffect, useContext } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { SpotifyAccessTokenContext } from '@/pages/_app';

const Callback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    accessToken,
    setAccessToken,
    setRefreshToken,
  } = useContext(SpotifyAccessTokenContext);

  useEffect(() => {
    const getAccessToken = async () => {
      const clientId = process.env.NEXT_PUBLIC_CLIENT_ID
      const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET
      const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI
      const code = searchParams.get("code")

      if (!code) return;

      const response = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
        }
      })

      setAccessToken(response.data.access_token)
      setRefreshToken(response.data.refresh_token)
      router.push("/select")
    }
    getAccessToken()
  }, [router, searchParams, setAccessToken, setRefreshToken])

  return (
    <div>
      {accessToken ? (
        <p>Access Token: {accessToken}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default Callback
