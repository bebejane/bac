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

import { project_map, event_map } from './maps'

export const migrateProjects = async () => {

  console.time(`import-projects`)

  const errors = []

  try {

    const wpapi = buildWpApi()
    const lang = 'en'
    const itemTypeId = (await itemTypeToId('project'))?.id
    const metaInfoBlockId = (await itemTypeToId('meta_info'))?.id
    const cvBlockId = (await itemTypeToId('cv'))?.id
    const categories = await allCategories(wpapi, lang)
    const allPosts = (await allPages(wpapi, 'project', { perPage: 100, lang }))
      .filter(p => p.status === 'publish')
      .filter(p => p.categories.find(id => categories.find(c => ['projects', 'event', 'projekt', 'evenemang'].includes(c.slug) && c.id === id)))

    fs.writeFileSync(`./lib/scripts/migration/data/posts.json`, JSON.stringify(allPosts, null, 2))

    const posts = []
    const projects = allPosts
      .filter(p => p.categories.find(id => categories.find(c => ['projects', 'projekt'].includes(c.slug) && c.id === id)))


    console.log(`Inserting ${projects.length} projects...`)

    for (let i = 0; i < projects.length; i++) {

      const post = projects[i];

      const lang = post.categories.find(id => categories.find(c => (c.slug === 'projects' || c.slug === 'event') && c.id === id)) ? 'en' : 'sv'
      const gallery = post.acf.image_gallery ? await Promise.all(post.acf.image_gallery.map(id => wpapi.media().id(id))) : null;
      const image = post.acf.image ? await wpapi.media().id(post.acf.image) : gallery ? gallery[0] : null;

      const cv = post.acf.cv && post.acf.cv.length ? post.acf.cv.map(({ headline, text }) => buildBlockRecord({
        item_type: { id: cvBlockId, type: 'item_type' },
        headline,
        text
      })) : null

      const meta_info = post.acf.meta && post.acf.meta.length ? post.acf.meta.map(({ headline, text }) => buildBlockRecord({
        item_type: { id: metaInfoBlockId, type: 'item_type' },
        headline,
        text
      })) : null

      const data = cleanObject({
        _categories: post.categories,
        _createdAt: post.date,
        wpid: post.id,
        title: {
          [lang]: decodeHTMLEntities(post.title.rendered || post.acf.artistname),
        },
        subtitle: {
          [lang]: decodeHTMLEntities(!post.title.rendered && post.acf.artistname ? undefined : post.acf.artistname),
        },
        slug: {
          [lang]: post.slug
        },
        intro_headline: {
          [lang]: post.acf.sub_title
        },
        intro: {
          [lang]: htmlToMarkdown(post.acf.intro_text)
        },
        content: {
          [lang]: (await htmlToStructuredContent(post.content.rendered)) || null
        },
        image: image ? await uploadMedia({
          url: image.source_url,
          title: { [lang]: image.title.rendered }
        }) : null,
        gallery: gallery ? await Promise.all(gallery.map(image => uploadMedia({
          url: image.source_url,
          title: { [lang]: image.title.rendered }
        }))) : null,
        video: post.acf.movie && !isNaN(post.acf.movie) ? {
          url: `https://vimeo.com/${post.acf.movie}`,
          provider_uid: post.acf.movie,
          provider: 'vimeo',
          width: 640,
          height: 480,
          thumbnail_url: post.acf.movie_image ? (await wpapi.media().id(post.acf.movie_image)).source_url : null,
          title: post.acf.movie_caption || null,
        } : null,
        cv: cv ? { [lang]: cv } : null,
        meta_info: meta_info ? { [lang]: meta_info } : null
      })

      posts.push(data)
      process.stdout.write(`.`)
    }


    const projects_en = posts.filter(p => p._categories.find(id => categories.find(c => c.slug === 'projects' && c.id === id)))
    const projects_sv = posts.filter(p => p._categories.find(id => categories.find(c => c.slug === 'projekt' && c.id === id)))

    /*
    
    const projects = projects_en.concat(projects_sv);

    const events_en = posts.filter(p => p._categories.find(id => categories.find(c => c.slug === 'events' && c.id === id)))
    const events_sv = posts.filter(p => p._categories.find(id => categories.find(c => c.slug === 'evenemang' && c.id === id)))
    const events = events_en.concat(events_sv);

    const projects_csv = projects_en.concat(projects_sv).map(p => `${p.title}\t${p.subtitle ?? ''}\t${p.id}`).join('\n')
    const events_csv = events.map(p => `${p.title}\t${p.subtitle ?? ''}\t${p.id}`).join('\n')

    fs.writeFileSync(`./lib/scripts/migration/data/projects.csv`, projects_csv)
    fs.writeFileSync(`./lib/scripts/migration/data/events.csv`, events_csv)
    fs.writeFileSync(`./lib/scripts/migration/data/projects-parsed.json`, JSON.stringify(projects, null, 2))
    fs.writeFileSync(`./lib/scripts/migration/data/events-parsed.json`, JSON.stringify(events, null, 2))
    */



    console.log('creating projects...')

    for (let i = 0; i < projects_en.length; i++) {
      const project = projects_en[i];
      const created_at = project._createdAt

      delete project._categories
      delete project._createdAt

      const projectSv = projects_sv.find(p => p.wpid === mapWpId(project.wpid, 'project'))

      if (projectSv) {
        Object.keys(project).forEach(key => {
          if (project[key]?.en)
            project[key].sv = projectSv[key]?.sv
        })
      }

      let item = await client.items.create({
        item_type: {
          type: 'item_type',
          id: itemTypeId
        },
        ...project,
        meta: {
          created_at,
          first_published_at: created_at,
        }
      })
      process.stdout.write(`#`)
    }

  } catch (err) {
    console.log(err)
    console.log(parseDatoError(err))
  }
  console.timeEnd(`import-projects`)
}

const mapWpId = (wpid: number, type = 'project') => {

  const m = type === 'project' ? project_map : event_map
  const mId = m.find(ids => ids[0] === wpid && ids[1])?.[1]
  return mId

}

migrateProjects()