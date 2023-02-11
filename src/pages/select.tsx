"use client";
import Head from 'next/head'
import globalStyle from '@/styles/global.module.scss'
import selectPageStyle from '@/styles/selectPage.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useContext, useState, TouchEvent } from 'react';
import { SpotifyAccessTokenContext, RecommendTracksContext } from '@/pages/_app';
import axios from 'axios';

export default function Home() {
  const { accessToken, setAccessToken, refreshToken } = useContext(SpotifyAccessTokenContext);
  const { recommendTracks, setRecommendTracks } = useContext(RecommendTracksContext);

  const [userData, setUserData] = useState({
    id: "",
    name: "",
    image: "",
  });

  const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState([{
    id: "",
    name: "",
    image: "",
    artist: "",
    preview_url: "",
  }]);

  const [touchStartPosition, setTouchStartPosition] = useState(0);
  const [touchPosition, setTouchPosition] = useState(0);

  const [activeIndex, setActiveIndex] = useState(0);

  const [seedTrackIds, setSeedTrackIds] = useState<string[]>([])

  const cardMotion = {
    left: `calc(5% + ${touchPosition}px)`,
  }

  useEffect(() => {
    // access_tokenが切れており、refresh_tokenを保持している場合
    if (!accessToken && refreshToken) {
      const getAccessTokenWithRefreshToken = async () => {
        try {
          const response = await axios({
            method: "post",
            url: "https://accounts.spotify.com/api/token",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            data: `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_CLIENT_SECRET}`,
          });

          setAccessToken(response.data.access_token)
        }
        catch (err) {
          throw err;
        }
      }
      getAccessTokenWithRefreshToken();
    }

    // access_tokenを持っている場合
    if (accessToken) {
      const getUserData = async () => {
        try {
          const response = await axios({
            method: 'get',
            url: 'https://api.spotify.com/v1/me',
            headers: {
              'Content-Type': 'application/json',
              "Accept": 'application/json',
              "Authorization": `Bearer ${accessToken}`,
            }
          })

          setUserData({
            id: response.data.id,
            name: response.data.display_name,
            image: response.data.images[0].url,
          })
        }
        catch (err) {
          throw err;
        }
      }
      getUserData();

      const getRecentlyPlayedTracks = async () => {
        try {
          const response = await axios({
            method: "get",
            url: `https://api.spotify.com/v1/me/player/recently-played?limit=50`,
            headers: {
              "Authorization": `Bearer ${accessToken}`,
            },
          });

          setRecentlyPlayedTracks(
            response.data.items.map((item: any) => ({
              id: item.track.id,
              name: item.track.name,
              image: item.track.album.images[0].url,
              artist: item.track.artists[0].name,
              preview_url: item.track.preview_url,
            })
            )
          );
        } catch (err) {
          throw (err);
        }
      }
      getRecentlyPlayedTracks();
    }
  }, [accessToken, setRecentlyPlayedTracks, refreshToken, setAccessToken]);

  const CardTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStartPosition(e.touches[0].clientX);
  }
  const CardMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchPosition(e.touches[0].clientX - touchStartPosition);
    // Math.abs(touchPosition)
  }
  const CardTouchEnd = (trackId: string) => {
    if (seedTrackIds.length >= 4) getRecommendations()
    if (touchPosition > 150) {
      setActiveIndex(activeIndex + 1)
      setTouchPosition(0)
      setSeedTrackIds([...seedTrackIds, trackId])

      if (activeIndex > recentlyPlayedTracks.length) {
        alert("end!")
      }
      return
    }
    if (touchPosition < -150) {
      setActiveIndex(activeIndex + 1)
      setTouchPosition(0)


      if (activeIndex > recentlyPlayedTracks.length) {
        alert("end!")
      }
      return
    }
    setTouchPosition(0)
  }

  const getRecommendations = async () => {
    const seedTracks: any = seedTrackIds.reduce((prevValue: any, _value, index) => index % 5 ? prevValue : [...prevValue, seedTrackIds.slice(index, index + 5)], [])

    const recommendData = await Promise.all(
      seedTracks.map(
        async (tracks: any) => {
          const seedTracksString = tracks.reduce((prevValue: any, value: any, index: number) => index == 0 ? value : `${prevValue},${value}`, "")
          try {
            const response = await axios({
              method: 'get',
              url: 'https://api.spotify.com/v1/recommendations',
              headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${accessToken}`,
              },
              params: {
                limit: 5,
                seed_tracks: seedTracksString,
              }
            })
            return response.data.tracks.map((track: any) => ({
              id: track.id,
              name: track.name,
              image: track.album.images[0].url,
              artist: track.artists[0].name,
              preview_url: track.preview_url,
            }))
          }
          catch (err) {
            throw err
          }
        }
      )
    )
    setRecommendTracks(recommendData.flat())
  }

  return (
    <>
      <Head>
        <title>Selection Page</title>
        <meta name="description" content="select your favorite track" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={selectPageStyle.select}>
        <header className={globalStyle.header}>
          <p className={globalStyle.userName}>{userData.name}</p>
          <div className={globalStyle.imageBlock}>
            <Image src={userData.image} alt="" layout="fill" className={globalStyle.image} />
          </div>
        </header>
        <section className={selectPageStyle.cardBlock}>
          {recentlyPlayedTracks.map((track, index) => (
            <div
              key={index}
              className={`${selectPageStyle.trackCard} ${index === activeIndex && selectPageStyle.active} ${index === activeIndex + 1 && selectPageStyle.nextCard}`}
              onTouchStart={CardTouchStart}
              onTouchMove={CardMove}
              onTouchEnd={() => CardTouchEnd(track.id)}
              style={cardMotion}
            >
              <div className={selectPageStyle.trackImageBlock}>
                <Image src={track.image} alt="" layout="fill" className={selectPageStyle.trackImage} />
              </div>
              <div className={selectPageStyle.trackdescriptionBlock}>
                <p>{track.name} / {track.artist}</p>
              </div>
              <div className={selectPageStyle.audioBlock}>
                <audio controls>
                  <source src={track.preview_url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          ))}
        </section>
        <section className={selectPageStyle.submitBlock}>
          {recommendTracks && (
            <Link href="/recommendations" className={selectPageStyle.submit}>
              Get Recommendations
            </Link>
          )
          }
        </section>
      </main>
    </>
  )
}
