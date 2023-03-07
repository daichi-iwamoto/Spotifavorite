"use client";
import Head from 'next/head'
import Image from 'next/image'
import globalStyle from '@/styles/global.module.scss'
import recommendationsStyle from '@/styles/recommendations.module.scss'
import { useContext, useEffect, useMemo } from 'react';
import { RecommendTracksContext } from '@/pages/_app';

export default function Home() {
  const { recommendTracks } = useContext(RecommendTracksContext);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <header className={globalStyle.header}>
          <p className={globalStyle.projectName}>Recommend for you</p>
        </header>
        <div className={recommendationsStyle.list}>
          {recommendTracks?.map((track, index) => (
            <div key={index} className={recommendationsStyle.recommend}>
              <div className={recommendationsStyle.trackImageBlock}>
                <Image src={track.image} alt="" layout="fill" className={recommendationsStyle.image} />
              </div>
              <p className={recommendationsStyle.trackData}>{track.name} / {track.artist}</p>
              <audio controls className={recommendationsStyle.audio}>
                <source src={track.preview_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
