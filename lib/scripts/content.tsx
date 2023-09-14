import * as dotenv from 'dotenv';
dotenv.config();

import { buildClient } from '@datocms/cma-client';
import marked from 'marked';
import { parse5ToStructuredText } from 'datocms-html-to-structured-text';
import * as parse5 from 'parse5';

const client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN });

(async () => {

  for await (const record of client.items.listPagedIterator({ filter: { type: 'anniversary_page' } })) {
    record.intro_temp = {
      sv: await parse5ToStructuredText(parse5.parse(marked.parse(record.intro.sv), { sourceCodeLocationInfo: true })),
      en: await parse5ToStructuredText(parse5.parse(marked.parse(record.intro.en), { sourceCodeLocationInfo: true })),
    }

    await client.items.update(record.id, record);
    process.stdout.write('.')
  }

})();

