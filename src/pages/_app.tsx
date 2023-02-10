import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { createContext, useState, useReducer, Dispatch, SetStateAction } from 'react'

type ContextProps = {
  accessToken: string;
  setAccessToken: Dispatch<SetStateAction<string>>;
  refreshToken: string;
  setRefreshToken: Dispatch<SetStateAction<string>>;
}

export const SpotifyAccessTokenContext = createContext<ContextProps>({
  accessToken: "",
  setAccessToken: () => { },
  refreshToken: "",
  setRefreshToken: () => { },
});

export default function App({ Component, pageProps }: AppProps) {
  const [accessToken, setAccessToken] = useState("")
  const [refreshToken, setRefreshToken] = useState("")

  return (
    <SpotifyAccessTokenContext.Provider
      value={{
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
      }}
    >
      <Component {...pageProps} />
    </SpotifyAccessTokenContext.Provider>
  )
}
