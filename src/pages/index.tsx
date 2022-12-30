import Head from 'next/head'
import styles from '../styles/Home.module.css'


export default function Home() {
  return (
    <>
      <Head>
        <title>Reddit_Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <h1 className='text-3xl font-bold underline'>HELLO WORLD!!</h1>

      </div>
    </>
  )
}
