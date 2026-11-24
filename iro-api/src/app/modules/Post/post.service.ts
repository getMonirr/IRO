import httpStatus from 'http-status'
import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../errors/AppError'
import { notifyFrontend } from '../../helpers/revalidate'
import { PostFilterableFields, PostSearchableFields } from './post.constant'
import { TPost } from './post.interface'
import { Post } from './post.model'

const createPostIntoDB = async (payload: TPost) => {
  const result = await Post.create(payload)
  notifyFrontend()
  return result
}

const getAllPostsFromDB = async (query: Record<string, unknown>) => {
  const qb = new QueryBuilder(Post.find(), query)
    .search(PostSearchableFields)
    .filter(PostFilterableFields)
    .sort()
    .paginate()
  const data = await qb.modelQuery.lean()
  const meta = await qb.countTotal()
  return { data, meta }
}

const getPostOptionsFromDB = async () => {
  const posts = await Post.find({}, { category: 1, author: 1 }).lean<any[]>()
  const unique = (field: 'category' | 'author') => ({
    bn: Array.from(
      new Set(posts.map(post => post[field]?.bn).filter(Boolean)),
    ).sort(),
    en: Array.from(
      new Set(posts.map(post => post[field]?.en).filter(Boolean)),
    ).sort(),
  })
  return { categories: unique('category'), authors: unique('author') }
}

const getSinglePostFromDB = async (id: string) => {
  const result = await Post.findById(id).lean()
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Post not found')
  return result
}

const updatePostIntoDB = async (id: string, payload: Partial<TPost>) => {
  const result = await Post.findByIdAndUpdate(
    id,
    { $set: payload },
    {
      new: true,
      runValidators: true,
    },
  )
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Post not found')
  notifyFrontend()
  return result
}

const incrementPostViewBySlug = async (slug: string) => {
  const result = await Post.findOneAndUpdate(
    { slug, published: true },
    { $inc: { viewCount: 1 } },
    { new: true },
  ).lean()
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Post not found')
  return result
}

const deletePostFromDB = async (id: string) => {
  const result = await Post.findByIdAndDelete(id)
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Post not found')
  notifyFrontend()
  return result
}

export const PostServices = {
  createPostIntoDB,
  getAllPostsFromDB,
  getSinglePostFromDB,
  updatePostIntoDB,
  deletePostFromDB,
  getPostOptionsFromDB,
  incrementPostViewBySlug,
}
