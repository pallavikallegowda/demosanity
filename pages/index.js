import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Toolbar } from './Toolbar'
import imageUrlBuilder from '@sanity/image-url'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home({ posts }) {
  const router = useRouter()
  const [mappedPosts, setMappedPosts] = useState([])

  useEffect(() => {
    if (posts.length) {
      const imgBuilder = imageUrlBuilder({
        projectId: 'k96qxbmc',
        dataset: 'production'
      })
      setMappedPosts(
        posts.map((p) => {
          return {
            ...p,
            mainImage: imgBuilder.image(p.mainImage).width(500).height(250)
          }
        })
      )
    } else {
      setMappedPosts([posts])
    }
  })
  return (
    <div>
      <Head>
        <title>Next js Assignment</title>
        <link
          href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css'
          rel='stylesheet'
          integrity='sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3'
        ></link>
      </Head>
      <Toolbar />
      <div className={styles.main}>
        <h1 className='my-5'>Recent Blogs</h1>
        <div className='container'>
          <div className='row'>
            {mappedPosts.length ? (
              mappedPosts.map((p, index) => (
                <div
                  onClick={() => router.push(`/post/${p.slug.current}`)}
                  key={index}
                  className='col-sm-4 mb-5'
                >
                  <img className={styles.mainImage} src={p.mainImage} />
                  <h3 className={styles.heading}>{p.title}</h3>
                </div>
              ))
            ) : (
              <>No Posts Yet</>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async (pageContext) => {
  const query = encodeURIComponent('*[_type=="post"]')
  const url = `https://k96qxbmc.api.sanity.io/v1/data/query/production?query=${query}`
  const result = await fetch(url).then((res) => res.json())
  if (!result.result || !result.result.length) {
    return {
      props: {
        posts: []
      }
    }
  } else {
    return {
      props: {
        posts: result.result
      }
    }
  }
}
