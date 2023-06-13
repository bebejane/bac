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
  uploadMedia
} from './'

import { project_map, event_map, anniversary_map } from './maps'

export const migrateProjects = async () => {

  console.time(`import-projects`)
  console.log('Importing posts...')
  const errors = []

  try {

    const wpapi = buildWpApi()
    const lang = 'en'
    const anniversaryPageTypeId = (await itemTypeToId('anniversary_page'))?.id
    const imageBlockTypeId = (await itemTypeToId('image'))?.id
    const metaInfoBlockId = (await itemTypeToId('meta_info'))?.id
    const cvBlockId = (await itemTypeToId('cv'))?.id
    const categories = await allCategories(wpapi, lang)


    const allPosts = (await allPages(wpapi, 'anniversary', { perPage: 100, lang }))
      .filter(p => p.status === 'publish')
      .filter(p => p.categories.length === 1 && (p.categories[0] === 1 || p.categories[0] === 37))

    fs.writeFileSync(`./lib/scripts/migration/data/anniversary.json`, JSON.stringify(allPosts, null, 2))

    const all = allPosts

    console.log(`Parsing ${all.length} posts...`)

    for (let i = 0; i < all.length; i++) {
      const post = all[i];

      if (!post) continue

      const lang = anniversary_map.find(m => m[0] === post.id) ? 'en' : 'sv'

      const altLang = lang === 'en' ? 'sv' : 'en'
      const altPostIndex = all.findIndex(p => p?.id === mapWpId(post?.id, 'anniversary', lang))
      const altPost = altPostIndex > -1 ? all[altPostIndex] : null

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
          [lang]: post.slug,
          [altLang]: altPost ? altPost.slug : null
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
              [lang]: image.title.rendered,
              [altLang]: altImage?.title.rendered || image.title.rendered,
            }
          }))?.id ?? null
        } : null,
        gallery: gallery ? (await Promise.all(gallery.map((image, idx) => uploadMedia({
          url: image.source_url,
          title: {
            [lang]: image.title.rendered,
            [altLang]: altGallery?.[idx]?.title.rendered || null,
          }
        })))).map(({ id }) => ({ upload_id: id })) : null,
        video: post.acf.movie && !isNaN(post.acf.movie) ? {
          url: `https://vimeo.com/${post.acf.movie}`,
          provider_uid: post.acf.movie,
          provider: 'vimeo',
          width: 640,
          height: 480,
          thumbnail_url: post.acf.movie_image ? (await wpapi.media().id(post.acf.movie_image)).source_url : null,
          title: post.acf.movie_caption || null,
        } : null,
        video_caption: {
          [lang]: post.acf.movie_caption || null,
          [altLang]: altPost ? post.acf.movie_caption || null : null
        },
        video_poster: post.acf.movie_image ? {
          upload_id: (await uploadMedia({
            url: (await wpapi.media().id(post.acf.movie_image)).source_url
          }))?.id ?? null
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
          id: anniversaryPageTypeId
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

  const m = type === 'project' ? project_map : type === 'anniversary' ? anniversary_map : event_map
  const mId = m.find(ids => ids[lang === 'en' ? 0 : 1] === wpid && ids[lang === 'en' ? 1 : 0])?.[lang === 'en' ? 1 : 0]
  return mId

}

migrateProjects()