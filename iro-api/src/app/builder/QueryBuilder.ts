/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery, Query } from 'mongoose'

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Chainable list helper: search, exact filters (whitelisted), sort and pagination.
 * Only plain string query values are accepted, so operators like ?role[$ne]=x are ignored.
 */
class QueryBuilder<T = any> {
  public modelQuery: Query<T[], T>
  public query: Record<string, unknown>
  private page = 1
  private limit = 20

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery
    this.query = query
  }

  search(searchableFields: string[]) {
    const term = this.query.searchTerm
    if (typeof term === 'string' && term.trim()) {
      const regex = { $regex: escapeRegex(term.trim()), $options: 'i' }
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(f => ({ [f]: regex })),
      } as FilterQuery<T>)
    }
    return this
  }

  filter(allowed: string[]) {
    const filter: Record<string, string> = {}
    for (const key of allowed) {
      const v = this.query[key]
      if (typeof v === 'string' && v !== '') filter[key] = v
    }
    this.modelQuery = this.modelQuery.find(filter as FilterQuery<T>)
    return this
  }

  sort(defaultSort = 'order createdAt') {
    const s = this.query.sort
    const sort =
      typeof s === 'string' && /^[-\w., ]+$/.test(s)
        ? s.split(/[, ]+/).join(' ')
        : defaultSort
    this.modelQuery = this.modelQuery.sort(sort)
    return this
  }

  paginate() {
    this.page = Math.max(1, parseInt(String(this.query.page)) || 1)
    this.limit = Math.min(
      100,
      Math.max(1, parseInt(String(this.query.limit)) || 20),
    )
    this.modelQuery = this.modelQuery
      .skip((this.page - 1) * this.limit)
      .limit(this.limit)
    return this
  }

  async countTotal() {
    const total = await this.modelQuery.model.countDocuments(
      this.modelQuery.getFilter(),
    )
    return {
      page: this.page,
      limit: this.limit,
      total,
      totalPage: Math.ceil(total / this.limit),
    }
  }
}

export default QueryBuilder
