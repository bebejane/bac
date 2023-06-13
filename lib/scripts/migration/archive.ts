import fs from 'fs'
import WPAPI from 'wpapi';
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
  console.log('Importing posts...')
  const errors = []

  try {

    const wpapi = new WPAPI({
      endpoint: `http://archive.balticartcenter.com/wp-json`,
      username: process.env.WP_USERNAME2,
      password: process.env.WP_PASSWORD2,
      //@ts-ignore
      auth: false
    });

    const lang = 'en'
    const archiveTypeId = (await itemTypeToId('archive'))?.id
    const imageBlockTypeId = (await itemTypeToId('image'))?.id
    const archiveCategoryTypeId = (await itemTypeToId('archive_category'))?.id
    const categories = await allCategories(wpapi, lang)

    const datoCategories = await Promise.all(categories.map(({ id, slug, name }) => client.items.create({
      item_type: {
        type: 'item_type',
        id: archiveCategoryTypeId
      },
      name: decodeHTMLEntities(name),
      slug,
      wpid: parseInt(id)
    })))

    const allPosts = (await allPages(wpapi, 'project', { perPage: 100, lang })).filter(p => p.status === 'publish')

    fs.writeFileSync(`./lib/scripts/migration/data/archive.json`, JSON.stringify(allPosts, null, 2))
    fs.writeFileSync(`./lib/scripts/migration/data/archive-cat.json`, JSON.stringify(categories, null, 2))


    for (let i = 0; i < allPosts.length; i++) {
      const p = allPosts[i]
      const created_at = p.date
      const data = cleanObject({
        wpid: p.id,
        title: {
          en: decodeHTMLEntities(p.title.rendered)
        },
        content: {
          en: (await htmlToStructuredContent(p.content.rendered, { image: imageBlockTypeId })) || null,
        },
        category: datoCategories.filter(c => p.categories.includes(c.wpid)).map(c => c.id),
        slug: {
          en: p.slug
        }
      })

      await client.items.create({
        item_type: {
          type: 'item_type',
          id: archiveTypeId
        },
        ...data,
        meta: {
          created_at,
          first_published_at: created_at,
        }
      })

      process.stdout.cursorTo(0)
      process.stdout.write(`${i + 1}/${allPosts.length}`)
    }
    return

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