import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // -------------------------------------------------------------------------
  // 1. Create Sources
  // -------------------------------------------------------------------------
  const sources = await Promise.all([
    prisma.source.upsert({
      where: { slug: "techcrunch-ai" },
      update: {},
      create: {
        name: "TechCrunch AI",
        slug: "techcrunch-ai",
        websiteUrl: "https://techcrunch.com",
        feedUrl: "https://techcrunch.com/category/artificial-intelligence/feed/",
        feedType: "rss",
        category: "Industry",
        description: "Technology news covering AI startups, products, and funding rounds.",
      },
    }),
    prisma.source.upsert({
      where: { slug: "mit-tech-review" },
      update: {},
      create: {
        name: "MIT Technology Review",
        slug: "mit-tech-review",
        websiteUrl: "https://www.technologyreview.com",
        feedUrl: "https://www.technologyreview.com/feed/",
        feedType: "rss",
        category: "Research",
        description: "Deep-dive coverage of AI research and its societal impact.",
      },
    }),
    prisma.source.upsert({
      where: { slug: "the-verge-ai" },
      update: {},
      create: {
        name: "The Verge AI",
        slug: "the-verge-ai",
        websiteUrl: "https://www.theverge.com",
        feedUrl: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
        feedType: "rss",
        category: "Industry",
        description: "Consumer-facing AI news, product launches, and industry analysis.",
      },
    }),
    prisma.source.upsert({
      where: { slug: "arxiv-ai" },
      update: {},
      create: {
        name: "arXiv AI",
        slug: "arxiv-ai",
        websiteUrl: "https://arxiv.org",
        feedUrl: "https://rss.arxiv.org/rss/cs.AI",
        feedType: "rss",
        category: "Research",
        description: "Latest AI research papers from arXiv preprint server.",
      },
    }),
  ])

  const sourceMap = Object.fromEntries(sources.map((s) => [s.slug, s.id]))

  console.log(`  ✅ ${sources.length} sources created/updated`)

  // -------------------------------------------------------------------------
  // 2. Create Tags
  // -------------------------------------------------------------------------
  const tagNames = [
    "OpenAI", "GPT-5", "LLM", "DeepMind", "Protein Folding", "Biotech",
    "Regulation", "EU AI Act", "Policy", "Tesla", "Robotics", "Automation",
    "Anthropic", "AI Safety", "Constitutional AI", "NVIDIA", "Hardware", "Chips",
    "Healthcare", "Drug Discovery", "Research", "Microsoft", "Copilot",
    "Productivity", "China", "Autonomous Vehicles", "Industry",
    "Quantum Computing", "IBM", "Google", "Art", "Generative AI", "Ethics",
    "Climate", "Startup", "Funding",
  ]

  const tags = await Promise.all(
    tagNames.map((name) => {
      const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      return prisma.tag.upsert({
        where: { slug },
        update: {},
        create: { name, slug },
      })
    })
  )

  const tagMap = Object.fromEntries(tags.map((t) => [t.name, t.id]))

  console.log(`  ✅ ${tags.length} tags created/updated`)

  // -------------------------------------------------------------------------
  // 3. Create Seed Articles (mirrors frontend mock-data.ts)
  // -------------------------------------------------------------------------
  const seedArticles = [
    {
      title: "OpenAI Announces GPT-5 with Revolutionary Reasoning Capabilities",
      slug: "openai-gpt5-announcement",
      url: "https://techcrunch.com/example/openai-gpt5",
      sourceSlug: "techcrunch-ai",
      summary:
        "OpenAI has unveiled GPT-5, featuring significant improvements in multi-step reasoning, code generation, and factual accuracy. The model demonstrates near-human performance on complex scientific benchmarks.",
      imageUrl: "https://picsum.photos/seed/openai-gpt5/1200/630",
      category: "Research",
      readingTime: 6,
      publishedAt: new Date("2026-07-22T10:00:00Z"),
      tagNames: ["OpenAI", "GPT-5", "LLM"],
    },
    {
      title: "Google DeepMind Solves New Protein Folding Challenge",
      slug: "deepmind-protein-folding",
      url: "https://nature.com/example/deepmind-protein",
      sourceSlug: "arxiv-ai",
      summary:
        "DeepMind's latest AlphaFold iteration can now predict protein interactions with membrane-bound complexes, opening new avenues for drug discovery and personalized medicine.",
      imageUrl: "https://picsum.photos/seed/deepmind-protein/1200/630",
      category: "Research",
      readingTime: 8,
      publishedAt: new Date("2026-07-21T14:30:00Z"),
      tagNames: ["DeepMind", "Protein Folding", "Biotech"],
    },
    {
      title: "EU AI Act Enforcement Begins: What Companies Need to Know",
      slug: "eu-ai-act-enforcement",
      url: "https://reuters.com/example/eu-ai-act",
      sourceSlug: "mit-tech-review",
      summary:
        "The European Union's comprehensive AI regulation officially takes effect, requiring companies to meet transparency and safety requirements for high-risk AI systems.",
      imageUrl: "https://picsum.photos/seed/eu-ai-act/1200/630",
      category: "Policy",
      readingTime: 5,
      publishedAt: new Date("2026-07-20T09:15:00Z"),
      tagNames: ["Regulation", "EU AI Act", "Policy"],
    },
    {
      title: "Tesla Optimus Robot Achieves Warehouse Autonomy",
      slug: "tesla-optimus-warehouse",
      url: "https://bloomberg.com/example/tesla-optimus",
      sourceSlug: "the-verge-ai",
      summary:
        "Tesla's humanoid robot Optimus has successfully completed a 30-day trial in Amazon warehouses, performing complex pick-and-place tasks with 99.2% accuracy.",
      imageUrl: "https://picsum.photos/seed/tesla-optimus/1200/630",
      category: "Hardware",
      readingTime: 4,
      publishedAt: new Date("2026-07-19T16:45:00Z"),
      tagNames: ["Tesla", "Robotics", "Automation"],
    },
    {
      title: "Anthropic Introduces Constitutional AI 2.0",
      slug: "anthropic-constitutional-ai-2",
      url: "https://technologyreview.com/example/anthropic-cai2",
      sourceSlug: "mit-tech-review",
      summary:
        "Anthropic's new framework enables AI systems to self-correct harmful outputs in real-time while maintaining helpfulness, marking a significant advance in AI safety.",
      imageUrl: "https://picsum.photos/seed/anthropic-cai2/1200/630",
      category: "Research",
      readingTime: 7,
      publishedAt: new Date("2026-07-18T11:20:00Z"),
      tagNames: ["Anthropic", "AI Safety", "Constitutional AI"],
    },
    {
      title: "NVIDIA Announces Next-Gen AI Chips with 10x Performance",
      slug: "nvidia-blackwell-ultra",
      url: "https://theverge.com/example/nvidia-blackwell",
      sourceSlug: "the-verge-ai",
      summary:
        "NVIDIA's Blackwell Ultra architecture delivers unprecedented performance for large language model training, reducing costs by 80% compared to previous generations.",
      imageUrl: "https://picsum.photos/seed/nvidia-blackwell/1200/630",
      category: "Hardware",
      readingTime: 5,
      publishedAt: new Date("2026-07-17T08:00:00Z"),
      tagNames: ["NVIDIA", "Hardware", "Chips"],
    },
  ]

  for (const article of seedArticles) {
    const existing = await prisma.article.findUnique({
      where: { slug: article.slug },
    })

    if (!existing) {
      const created = await prisma.article.create({
        data: {
          title: article.title,
          slug: article.slug,
          url: article.url,
          sourceId: sourceMap[article.sourceSlug],
          summary: article.summary,
          imageUrl: article.imageUrl,
          category: article.category,
          readingTime: article.readingTime,
          publishedAt: article.publishedAt,
          tags: {
            create: article.tagNames
              .filter((name) => tagMap[name])
              .map((name) => ({
                tagId: tagMap[name],
              })),
          },
        },
      })
      console.log(`  📝 Created article: ${created.title.slice(0, 50)}...`)
    } else {
      console.log(`  ⏭️  Skipped (exists): ${article.title.slice(0, 50)}...`)
    }
  }

  console.log(`\n✨ Seed complete!`)
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
