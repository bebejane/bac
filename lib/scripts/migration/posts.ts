import fs from 'fs'
import { buildBlockRecord } from '@datocms/cma-client-node';

import {
  itemTypeToId,
  allPages,
  htmlToMarkdown,
  cleanObject,
  htmlToStructuredContent,
  buildWpApi,
  client,
  decodeHTMLEntities,
  parseDatoError,
  allCategories,
  uploadMedia,
  striptags
} from './'

import { project_map, event_map } from './maps'


export const migrateProjects = async () => {

  console.time(`import-projects`)
  console.log('Importing posts...')
  const errors = []

  try {

    const wpapi = buildWpApi()
    const lang = 'en'
    const projectTypeId = (await itemTypeToId('project'))?.id
    const eventTypeId = (await itemTypeToId('event'))?.id
    const imageBlockTypeId = (await itemTypeToId('image'))?.id
    const metaInfoBlockId = (await itemTypeToId('meta_info'))?.id
    const cvBlockId = (await itemTypeToId('cv'))?.id
    const categories = await allCategories(wpapi, lang)

    const allPosts = (await allPages(wpapi, 'project', { perPage: 100, lang }))
      .filter(p => p.status === 'publish')
      .filter(p => p.categories.find(id => categories.find(c => ['projects', 'projekt', 'events', 'evenemang'].includes(c.slug) && c.id === id)))

    fs.writeFileSync(`./lib/scripts/migration/data/posts.json`, JSON.stringify(allPosts, null, 2))

    const projects = allPosts.filter(p => p.categories.find(id => categories.find(c => ['projects', 'projekt'].includes(c.slug) && c.id === id)))
    const events = allPosts.filter(p => p.categories.find(id => categories.find(c => ['events', 'evenemang'].includes(c.slug) && c.id === id)))
    const all = projects.concat(events)

    console.log(`Parsing ${all.length} posts...`)

    for (let i = 0; i < all.length; i++) {
      const post = all[i];

      if (!post) continue

      const type = post.categories.find(id => categories.find(c => ['projects', 'projekt'].includes(c.slug) && c?.id === id)) ? 'project' : 'event'
      const lang = post.categories.find(id => categories.find(c => (c.slug === 'projects' || c.slug === 'events') && c?.id === id)) ? 'en' : 'sv'

      const altLang = lang === 'en' ? 'sv' : 'en'
      const altPostIndex = (type === 'project' ? projects : events).findIndex(p => p?.id === mapWpId(post?.id, type, lang))
      const altPost = altPostIndex > -1 ? (type === 'project' ? projects : events)[altPostIndex] : null

      const gallery = post.acf.image_gallery ? await Promise.all(post.acf.image_gallery.map(id => wpapi.media().id(id))) : null;
      const altGallery = altPost?.acf.image_gallery ? await Promise.all(altPost.acf.image_gallery.map(id => wpapi.media().id(id))) : null;
      const image = post.acf.image ? await wpapi.media().id(post.acf.image) : gallery ? gallery[0] : null;
      const altImage = altPost?.acf.image ? await wpapi.media().id(altPost.acf.image) : altGallery ? altGallery[0] : null;

      const cv = post.acf.cv && post.acf.cv.length ? post.acf.cv.map(({ headline, text }) => buildBlockRecord({
        item_type: { id: cvBlockId, type: 'item_type' },
        headline,
        text: htmlToMarkdown(text)
      })) : null

      const meta_info = post.acf.meta && post.acf.meta.length ? post.acf.meta.map(({ headline, text }) => buildBlockRecord({
        item_type: { id: metaInfoBlockId, type: 'item_type' },
        headline,
        text: htmlToMarkdown(text)
      })) : null

      const alt_cv = altPost?.acf.cv && altPost.acf.cv.length ? altPost.acf.cv.map(({ headline, text }) => buildBlockRecord({
        item_type: { id: cvBlockId, type: 'item_type' },
        headline,
        text: htmlToMarkdown(text)
      })) : null

      const alt_meta_info = altPost?.acf.meta && altPost.acf.meta.length ? altPost.acf.meta.map(({ headline, text }) => buildBlockRecord({
        item_type: { id: metaInfoBlockId, type: 'item_type' },
        headline,
        text: htmlToMarkdown(text)
      })) : null

      const data = cleanObject({
        _categories: post.categories,
        _createdAt: post.date,
        wpid: post.id,
        title: {
          [lang]: decodeHTMLEntities(post.title.rendered || post.acf.artistname),
          [altLang]: altPost ? decodeHTMLEntities(altPost.title.rendered || altPost.acf.artistname) : null,
        },
        subtitle: {
          [lang]: decodeHTMLEntities(!post.title.rendered && post.acf.artistname ? undefined : post.acf.artistname),
          [altLang]: altPost ? decodeHTMLEntities(!altPost.title.rendered && altPost.acf.artistname ? undefined : altPost.acf.artistname) : null,
        },
        slug: {
          [lang]: decodeURIComponent(post.slug),
          [altLang]: altPost ? decodeURIComponent(altPost.slug) : null
        },
        intro_headline: {
          [lang]: post.acf.sub_title,
          [altLang]: altPost ? post.acf.sub_title : null
        },
        intro: {
          [lang]: htmlToMarkdown(post.acf.intro_text),
          [altLang]: altPost ? htmlToMarkdown(altPost.acf.intro_text) : null
        },
        content: {
          [lang]: (await htmlToStructuredContent(post.content.rendered, { image: imageBlockTypeId })) || null,
          [altLang]: altPost ? (await htmlToStructuredContent(altPost.content.rendered, { image: imageBlockTypeId })) || null : null
        },
        image: image ? {
          upload_id: (await uploadMedia({
            url: image.source_url,
            title: {
              [lang]: post.acf.caption,
              [altLang]: altPost?.acf.caption ?? null,
            }
          }))?.id ?? null
        } : null,
        gallery: gallery && gallery.length ?
          (await Promise.all((await Promise.all(gallery.map((image, idx) => wpapi.media().id(image.id))))
            .map(async ({ source_url, caption }, idx) => uploadMedia({
              url: source_url,
              title: {
                [lang]: caption?.rendered ? striptags(caption?.rendered) : null,
                [altLang]: altGallery?.[idx] ? striptags((await wpapi.media().id(altGallery?.[idx]?.id))?.caption?.rendered ?? null) : null,
              }
            })
            ))).map(({ id }) => ({ upload_id: id })) : null,
        video: post.acf.movie && !isNaN(post.acf.movie) ? {
          url: `https://vimeo.com/${post.acf.movie}`,
          provider_uid: post.acf.movie,
          provider: 'vimeo',
          width: 640,
          height: 480,
          thumbnail_url: post.acf.movie_image ? (await wpapi.media().id(post.acf.movie_image)).source_url : null,
          title: post.acf.movie_caption || null,
        } : null,
        cv: cv ? {
          [lang]: cv,
          [altLang]: alt_cv
        } : null,
        meta_info: meta_info ? {
          [lang]: meta_info,
          [altLang]: alt_meta_info
        } : null
      })

      const created_at = data._createdAt

      delete data._categories
      delete data._createdAt

      await client.items.create({
        item_type: {
          type: 'item_type',
          id: type === 'project' ? projectTypeId : eventTypeId
        },
        ...data,
        meta: {
          created_at,
          first_published_at: created_at,
        }
      })

      if (altPost)
        all[altPostIndex] = null

      process.stdout.cursorTo(0)
      process.stdout.write(`${i + 1}/${all.length}`)

    }

  } catch (err) {
    console.log(err)
    console.log('----------------')
    console.log(parseDatoError(err))
  }
  console.timeEnd(`import-projects`)
}

const mapWpId = (wpid: number, type = 'project', lang = 'en') => {

  const m = type === 'project' ? project_map : event_map
  const mId = m.find(ids => ids[lang === 'en' ? 0 : 1] === wpid && ids[lang === 'en' ? 1 : 0])?.[lang === 'en' ? 1 : 0]
  return mId

}

migrateProjects()