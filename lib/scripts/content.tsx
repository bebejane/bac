import * as dotenv from 'dotenv';
dotenv.config();

import { buildClient, buildBlockRecord } from '@datocms/cma-client';
import marked from 'marked';
import { parse5ToStructuredText } from 'datocms-html-to-structured-text';
import * as parse5 from 'parse5';

const client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN });

(async () => {
  const type = 'anniversary_page'
  //const type = 'event'
  //const type = 'project'

  const langs = ['en', 'sv']

  for await (const record of client.items.listPagedIterator({ filter: { type }, nested: true })) {

    for (let i = 0; i < langs.length; i++) {
      const lang = langs[i];
      for (let x = 0; x < record.cv[lang].length; x++) {
        const cv = record.cv[lang][x]
        record.cv[lang][x] = ({
          ...cv,
          attributes: cv.attributes ? {
            ...cv.attributes,
            text_temp: await parse5ToStructuredText(parse5.parse(marked.parse(cv.attributes.text.replaceAll('\n', '\n\n'), { gfm: true, breaks: true }), { sourceCodeLocationInfo: true })),
          } : null

        })
      }
      for (let x = 0; x < record.meta_info[lang].length; x++) {
        const meta_info = record.meta_info[lang][x]
        record.meta_info[lang][x] = ({

          ...meta_info,
          attributes: meta_info.attributes ? {
            ...meta_info.attributes,
            text_temp: await parse5ToStructuredText(parse5.parse(marked.parse(meta_info.attributes.text.replaceAll('\n', '\n\n')), { sourceCodeLocationInfo: true })),
          } : null

        })
        //console.log(record.meta_info[lang][x])
      }

    }
    await client.items.update(record.id, record);
    //console.log(record.cv.sv)
    process.stdout.write('.')
  }
  console.log('done')

})();

