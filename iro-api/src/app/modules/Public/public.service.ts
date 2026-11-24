/* eslint-disable @typescript-eslint/no-explicit-any */
import { pickLang, TLang } from '../../shared/bilingual'
import { DonationMethod } from '../Donation/donation.model'
import { ListItem } from '../ListItem/listItem.model'
import { Post } from '../Post/post.model'
import { Program } from '../Program/program.model'
import { Setting } from '../Setting/setting.model'

/** Builds the whole public website content in the chosen language (same shape as the frontend's default dictionary). */
const getPublicContentFromDB = async (lang: TLang) => {
  const [programs, items, settings, posts, donationMethods] = await Promise.all(
    [
      Program.find({ published: true }).sort({ order: 1 }).lean<any[]>(),
      ListItem.find({ published: true }).sort({ order: 1 }).lean<any[]>(),
      Setting.find().lean<any[]>(),
      Post.find({ published: true })
        .sort({ featured: -1, publishedAt: -1 })
        .lean<any[]>(),
      DonationMethod.find({ enabled: true }).sort({ order: 1 }).lean<any[]>(),
    ],
  )
  const group = (g: string) => items.filter(i => i.group === g)
  const card = (i: any) => ({
    icon: i.icon,
    title: pickLang(i.title, lang),
    text: pickLang(i.text, lang),
  })

  const out: Record<string, unknown> = {
    stats: group('stat').map(i => ({
      value: pickLang(i.value, lang),
      label: pickLang(i.title, lang),
      note: pickLang(i.text, lang),
    })),
    programs: programs.map(p => ({
      id: p.slug,
      icon: p.icon,
      title: pickLang(p.title, lang),
      short: pickLang(p.short, lang),
      body: pickLang(p.body, lang),
    })),
    programExtras: Object.fromEntries(
      programs.map(p => [
        p.slug,
        {
          status: p.status,
          tagline: pickLang(p.tagline, lang),
          points: (p.points ?? []).map((x: any) => pickLang(x, lang)),
          figures: (p.figures ?? []).map((f: any) => ({
            value: pickLang(f.value, lang),
            label: pickLang(f.label, lang),
          })),
          ayah: {
            arabic: p.ayah?.arabic ?? '',
            text: pickLang(p.ayah?.text, lang),
            src: pickLang(p.ayah?.source, lang),
          },
        },
      ]),
    ),
    principles: group('principle').map(card),
    goals: group('goal').map(i => pickLang(i.title, lang)),
    departments: group('department').map(i => pickLang(i.title, lang)),
    roadmap: group('roadmap').map(i => ({
      title: pickLang(i.title, lang),
      text: pickLang(i.text, lang),
    })),
    joinWays: group('joinWay').map(card),
    posts: posts.map(p => ({
      id: p.slug,
      slug: p.slug,
      type: p.type,
      icon: p.icon,
      coverImage: p.coverImage,
      category: pickLang(p.category, lang),
      title: pickLang(p.title, lang),
      excerpt: pickLang(p.excerpt, lang),
      body: pickLang(p.body, lang),
      author: pickLang(p.author, lang),
      featured: p.featured,
      publishedAt: p.publishedAt,
      viewCount: p.viewCount ?? 0,
    })),
    donationMethods: donationMethods.map(method => ({
      id: String(method._id),
      slug: method.slug,
      region: method.region,
      type: method.type,
      name: pickLang(method.name, lang),
      provider: method.provider,
      accountName: pickLang(method.accountName, lang),
      accountNumber: method.accountNumber,
      instructions: pickLang(method.instructions, lang),
      checkoutUrl: method.checkoutUrl,
      currency: method.currency,
    })),
  }
  for (const s of settings) {
    if (s.key === 'theme') {
      out.theme = s.value
      continue
    }
    const v = s.value?.[lang] ?? s.value?.bn
    if (v !== undefined) out[s.key] = v
  }
  return out
}

export const PublicServices = { getPublicContentFromDB }
