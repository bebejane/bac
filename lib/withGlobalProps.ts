import { apiQuery, SEOQuery } from "dato-nextjs-utils/api";
import { GetStaticProps, GetServerSideProps, GetStaticPropsContext } from 'next'
import { GlobalDocument } from "/graphql";
import type { TypedDocumentNode } from "@apollo/client/core/types.js";
import { buildMenu } from "/lib/menu";

export default function withGlobalProps(opt: any, callback: Function): GetStaticProps | GetServerSideProps {

  const revalidate: number = parseInt(process.env.REVALIDATE_TIME)
  const queries: TypedDocumentNode[] = [GlobalDocument]

  if (opt.query)
    queries.push(opt.query)
  if (opt.queries)
    queries.push.apply(queries, opt.queries)
  if (opt.seo)
    queries.push(SEOQuery(opt.seo))

  return async (context: GetStaticPropsContext) => {

    const variables = queries.map(el => ({ locale: context.locale }))
    const props = await apiQuery(queries, { preview: context.preview, variables });

    let messages = (await import(`./i18n/${context.locale}.json`)).default
    props.messages = messages;
    props.locale = context.locale
    props.menu = await buildMenu(context.locale)

    if (callback)
      return await callback({ context, props: { ...props }, revalidate });
    else
      return { props: { ...props }, context, revalidate };
  }
}