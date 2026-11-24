import { Schema, model } from 'mongoose'
import { bi } from '../../shared/bilingual'
import { POST_TYPES } from './post.constant'
import { TPost } from './post.interface'

const postSchema = new Schema<TPost>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]{2,80}$/,
    },
    type: { type: String, enum: POST_TYPES, required: true, index: true },
    icon: { type: String, default: '' },
    coverImage: { type: String, required: true, trim: true },
    category: bi(),
    title: bi(),
    excerpt: bi(),
    body: bi(),
    author: bi(),
    published: { type: Boolean, default: true, index: true },
    featured: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, default: Date.now, index: true },
    viewCount: { type: Number, default: 0, min: 0, index: true },
  },
  { timestamps: true },
)

export const Post = model<TPost>('Post', postSchema)
