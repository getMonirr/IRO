import sanitizeHtml from 'sanitize-html'
import { z } from 'zod'
import { biReqZod, biZod } from '../../shared/bilingual'
import { POST_TYPES } from './post.constant'

const postBody = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]{2,80}$/, 'lowercase letters, digits and hyphens only'),
  type: z.enum(POST_TYPES),
  icon: z.string().max(20).default(''),
  coverImage: z
    .string()
    .url('coverImage must be a valid URL')
    .min(1, 'coverImage is required'),
  category: biZod(100),
  title: biReqZod(200),
  excerpt: biZod(500),
  body: biReqZod(50000).transform(value => ({
    bn: sanitizeHtml(value.bn, {
      allowedTags: [
        'p',
        'br',
        'strong',
        'b',
        'em',
        'i',
        'u',
        's',
        'h2',
        'h3',
        'h4',
        'ul',
        'ol',
        'li',
        'blockquote',
        'a',
        'span',
        'img',
      ],
      allowedAttributes: {
        a: ['href', 'target', 'rel'],
        span: ['style'],
        img: ['src', 'alt', 'width', 'height', 'style'],
      },
      allowedStyles: {
        span: { 'text-align': [/^left|center|right|justify$/] },
      },
    }),
    en: sanitizeHtml(value.en, {
      allowedTags: [
        'p',
        'br',
        'strong',
        'b',
        'em',
        'i',
        'u',
        's',
        'h2',
        'h3',
        'h4',
        'ul',
        'ol',
        'li',
        'blockquote',
        'a',
        'span',
        'img',
      ],
      allowedAttributes: {
        a: ['href', 'target', 'rel'],
        span: ['style'],
        img: ['src', 'alt', 'width', 'height', 'style'],
      },
      allowedStyles: {
        span: { 'text-align': [/^left|center|right|justify$/] },
      },
    }),
  })),
  author: biZod(100),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
  publishedAt: z.coerce.date().default(() => new Date()),
})

export const PostValidation = {
  createPostValidationSchema: z.object({ body: postBody }),
  updatePostValidationSchema: z.object({ body: postBody.partial() }),
}
