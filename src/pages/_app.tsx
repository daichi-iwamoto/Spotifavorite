import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { createContext, useState, useReducer, Dispatch, SetStateAction } from 'react'

type SpotifyAccessTokenContextType = {
  accessToken: string;
  setAccessToken: Dispatch<SetStateAction<string>>;
  refreshToken: string;
  setRefreshToken: Dispatch<SetStateAction<string>>;
}

export const SpotifyAccessTokenContext = createContext<SpotifyAccessTokenContextType>({
  accessToken: "",
  setAccessToken: () => { },
  refreshToken: "",
  setRefreshToken: () => { },
});

type recommendTrack = {
  id: string;
  name: string;
  image: string;
  artist: string;
  preview_url: string;
}

type RecommendTracksContextType = {
  recommendTracks: recommendTrack[] | undefined;
  setRecommendTracks: Dispatch<SetStateAction<recommendTrack[] | undefined>>;
}

export const RecommendTracksContext = createContext<RecommendTracksContextType>({
  recommendTracks: undefined,
  setRecommendTracks: () => { },
});

export default function App({ Component, pageProps }: AppProps) {
  const [accessToken, setAccessToken] = useState("")
  const [refreshToken, setRefreshToken] = useState("")

  const [recommendTracks, setRecommendTracks] = useState<recommendTrack[] | undefined>(undefined)

  return (
    <SpotifyAccessTokenContext.Provider
      value={{
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
      }}
    >
      <RecommendTracksContext.Provider value={{ recommendTracks, setRecommendTracks }}>
        <Component {...pageProps} />
      </RecommendTracksContext.Provider>
    </SpotifyAccessTokenContext.Provider>
  )
}
