import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "@prisma/client";
import { normalizePostgresConnectionString } from "../lib/postgres.mjs";

const connectionString = normalizePostgresConnectionString(
  process.env.DATABASE_URL ?? "",
);
const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const decimal = (value) => new Prisma.Decimal(value);

const manager = {
  id: "user-manager-elena-hart",
  name: "Elena Hart",
  email: "elena.hart@n5deal.demo",
  role: "MANAGER",
  status: "ACTIVE",
  company: "N5Deal",
  country: "United Kingdom",
  avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=320&h=320&fit=crop&crop=faces",
};

const sellers = [
  {
    id: "user-seller-victoria-bennett",
    name: "Victoria Bennett",
    email: "victoria.bennett@cleargate.demo",
    role: "SELLER",
    status: "ACTIVE",
    company: "ClearGate Payments Ltd",
    country: "United Kingdom",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=320&h=320&fit=crop&crop=faces",
    profile: {
      bio: "Operator of regulated UK payment infrastructure with a focus on cross-border collections.",
      companyDescription:
        "ClearGate runs a profitable payments group with a strong compliance stack, repeat merchant relationships, and room for strategic expansion.",
    },
    assets: [
      {
        id: "asset-cleargate-emi-authorization",
        title: "ClearGate EMI Authorization",
        description:
          "UK EMI shell with an established compliance pack, live banking relationships, and an experienced operations team supporting merchant onboarding.",
        country: "United Kingdom",
        category: "EMI",
        assetType: "Licensed entity",
        businessStatus: "Regulated and active",
        askingPrice: "2400000.00",
        currency: "GBP",
        employees: 18,
        foundedYear: 2018,
        licenseType: "EMI",
        status: "PUBLISHED",
      },
      {
        id: "asset-northbridge-merchant-acquiring",
        title: "Northbridge Merchant Acquiring",
        description:
          "Established merchant acquiring business with recurring processing volume, integrated reporting, and a diversified SME client book.",
        country: "United Kingdom",
        category: "Payments",
        assetType: "Payment processor",
        businessStatus: "Revenue-generating",
        askingPrice: "1700000.00",
        currency: "GBP",
        employees: 12,
        foundedYear: 2020,
        licenseType: "Payment Institution",
        status: "PUBLISHED",
      },
      {
        id: "asset-cleargate-treasury-saas",
        title: "ClearGate Treasury SaaS",
        description:
          "B2B treasury workflow software used by mid-market merchants to reconcile balances, payment flows, and approvals across banking partners.",
        country: "United Kingdom",
        category: "Fintech",
        assetType: "Fintech platform",
        businessStatus: "Scaling",
        askingPrice: "650000.00",
        currency: "GBP",
        employees: 8,
        foundedYear: 2022,
        status: "DRAFT",
      },
    ],
  },
  {
    id: "user-seller-tomas-petraitis",
    name: "Tomas Petraitis",
    email: "tomas.petraitis@balticlicencing.demo",
    role: "SELLER",
    status: "ACTIVE",
    company: "Baltic Licencing UAB",
    country: "Lithuania",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&h=320&fit=crop&crop=faces",
    profile: {
      bio: "Lithuanian regulated finance operator with a strong track record in EMI and cross-border payments.",
      companyDescription:
        "Baltic Licencing has built a small but resilient platform around regulated payment activity, compliance tooling, and white-label integrations.",
    },
    assets: [
      {
        id: "asset-vilnius-emi-platform",
        title: "Vilnius EMI Platform",
        description:
          "Live Lithuanian EMI with active onboarding workflows, local banking connections, and a clean regulatory file ready for buyer diligence.",
        country: "Lithuania",
        category: "EMI",
        assetType: "Licensed entity",
        businessStatus: "Regulated and active",
        askingPrice: "1350000.00",
        currency: "EUR",
        employees: 14,
        foundedYear: 2019,
        licenseType: "EMI",
        status: "PUBLISHED",
      },
      {
        id: "asset-baltic-cross-border-payments",
        title: "Baltic Cross-Border Payments",
        description:
          "Payment processor serving EU merchants with corridor coverage into the Nordics and the UK, supported by a lean operations team.",
        country: "Lithuania",
        category: "Payments",
        assetType: "Payment processor",
        businessStatus: "Revenue-generating",
        askingPrice: "1900000.00",
        currency: "EUR",
        employees: 22,
        foundedYear: 2017,
        licenseType: "Payment Institution",
        status: "PUBLISHED",
      },
      {
        id: "asset-kaunas-compliance-engine",
        title: "Kaunas Compliance Engine",
        description:
          "Regulatory tooling and monitoring stack bundled with a small licensed entity, suitable for acquirers seeking an operating base in the Baltics.",
        country: "Lithuania",
        category: "Banking",
        assetType: "Fintech platform",
        businessStatus: "Under review",
        askingPrice: "780000.00",
        currency: "EUR",
        employees: 6,
        foundedYear: 2021,
        status: "SUSPENDED",
      },
    ],
  },
  {
    id: "user-seller-markus-weber",
    name: "Markus Weber",
    email: "markus.weber@rheindigital.demo",
    role: "SELLER",
    status: "ACTIVE",
    company: "Rhein Digital Finance GmbH",
    country: "Germany",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=320&h=320&fit=crop&crop=faces",
    profile: {
      bio: "German founder with operating experience in banking software and credit origination platforms.",
      companyDescription:
        "Rhein Digital Finance combines regulated finance capabilities with software distribution into European financial institutions.",
    },
    assets: [
      {
        id: "asset-frankfurt-regtech-bank-stack",
        title: "Frankfurt RegTech Bank Stack",
        description:
          "Regulated fintech stack with bank-grade workflow tooling, active enterprise contracts, and a product roadmap aligned to compliance buyers.",
        country: "Germany",
        category: "Banking",
        assetType: "Fintech platform",
        businessStatus: "Scaling",
        askingPrice: "3800000.00",
        currency: "EUR",
        employees: 27,
        foundedYear: 2016,
        status: "PUBLISHED",
      },
      {
        id: "asset-berlin-consumer-lending-platform",
        title: "Berlin Consumer Lending Platform",
        description:
          "Consumer lending business with a focused credit book, automated underwriting flows, and a strong brand presence in Germany.",
        country: "Germany",
        category: "Lending",
        assetType: "Lending platform",
        businessStatus: "Revenue-generating",
        askingPrice: "1100000.00",
        currency: "EUR",
        employees: 10,
        foundedYear: 2018,
        status: "DRAFT",
      },
    ],
  },
  {
    id: "user-seller-elena-costa",
    name: "Elena Costa",
    email: "elena.costa@iberacapital.demo",
    role: "SELLER",
    status: "ACTIVE",
    company: "Ibera Capital Partners SL",
    country: "Spain",
    avatarUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=320&h=320&fit=crop&crop=faces",
    profile: {
      bio: "Spanish seller with exposure to crypto compliance, SME finance, and consumer lending assets.",
      companyDescription:
        "Ibera Capital Partners packages operating businesses for strategic or sponsor-led acquisition with clear data rooms and visible customer economics.",
    },
    assets: [
      {
        id: "asset-madrid-crypto-custody-vasp",
        title: "Madrid Crypto Custody VASP",
        description:
          "Crypto custody and VASP business with compliance controls, active customers, and a clean operating history suitable for regulated buyers.",
        country: "Spain",
        category: "Crypto",
        assetType: "Crypto business",
        businessStatus: "Regulated and active",
        askingPrice: "2900000.00",
        currency: "EUR",
        employees: 15,
        foundedYear: 2020,
        licenseType: "VASP",
        status: "PUBLISHED",
      },
      {
        id: "asset-barcelona-sme-lending-marketplace",
        title: "Barcelona SME Lending Marketplace",
        description:
          "SME lending marketplace with recurring originations, a small underwriting team, and a portfolio that has already weathered a full credit cycle.",
        country: "Spain",
        category: "Lending",
        assetType: "Lending platform",
        businessStatus: "Revenue-generating",
        askingPrice: "2200000.00",
        currency: "EUR",
        employees: 20,
        foundedYear: 2019,
        status: "PUBLISHED",
      },
    ],
  },
  {
    id: "user-seller-faris-almansoori",
    name: "Faris Al-Mansoori",
    email: "faris.almansoori@gulfledger.demo",
    role: "SELLER",
    status: "ACTIVE",
    company: "Gulf Ledger FZ-LLC",
    country: "UAE",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=320&h=320&fit=crop&crop=faces",
    profile: {
      bio: "GCC operator focused on wealth management, payment rails, and fintech infrastructure.",
      companyDescription:
        "Gulf Ledger offers assets with strong regional positioning across the UAE and Singapore, with documentation prepared for buyer review.",
    },
    assets: [
      {
        id: "asset-dubai-wealth-management-boutique",
        title: "Dubai Wealth Management Boutique",
        description:
          "Private wealth management boutique with a loyal client base, advisory revenue, and a strong foothold in the UAE market.",
        country: "UAE",
        category: "Wealth Management",
        assetType: "Wealth business",
        businessStatus: "Revenue-generating",
        askingPrice: "4400000.00",
        currency: "USD",
        employees: 9,
        foundedYear: 2015,
        status: "PUBLISHED",
      },
      {
        id: "asset-singapore-payment-switch",
        title: "Singapore Payment Switch",
        description:
          "Singapore payment switch with regional corridor coverage, integrations for merchants, and scope for additional licensed products.",
        country: "Singapore",
        category: "Payments",
        assetType: "Payment processor",
        businessStatus: "Scaling",
        askingPrice: "2700000.00",
        currency: "SGD",
        employees: 19,
        foundedYear: 2015,
        licenseType: "Major Payment Institution",
        status: "SUSPENDED",
      },
      {
        id: "asset-abu-dhabi-open-finance-stack",
        title: "Abu Dhabi Open Finance Stack",
        description:
          "Open finance software platform with bank integration capabilities, currently in market for a buyer that wants a GCC launchpad.",
        country: "UAE",
        category: "Fintech",
        assetType: "Fintech platform",
        businessStatus: "Pre-profit",
        askingPrice: "1600000.00",
        currency: "AED",
        employees: 11,
        foundedYear: 2021,
        status: "DRAFT",
      },
    ],
  },
];

const buyers = [
  {
    id: "user-buyer-adrian-cole",
    name: "Adrian Cole",
    email: "adrian.cole@stonebridge.demo",
    role: "BUYER",
    status: "ACTIVE",
    company: "Stonebridge Holdings",
    country: "United Kingdom",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=320&h=320&fit=crop&crop=faces",
    profile: {
      bio: "Investment principal focused on acquiring regulated payments and EMI platforms in Europe.",
      investmentThesis:
        "I like regulated payment institutions with clean compliance files, recurring merchant revenue, and operating leverage from cross-border expansion.",
      minInvestment: "1000000.00",
      maxInvestment: "5000000.00",
      preferredCountries: ["United Kingdom", "Lithuania", "Poland"],
      preferredCategories: ["Payments", "EMI"],
    },
  },
  {
    id: "user-buyer-marta-nowak",
    name: "Marta Nowak",
    email: "marta.nowak@northline.demo",
    role: "BUYER",
    status: "ACTIVE",
    company: "Northline Capital",
    country: "Poland",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=320&h=320&fit=crop&crop=faces",
    profile: {
      bio: "Buy-side operator seeking fintech software and lending platforms with clear product-market fit.",
      investmentThesis:
        "I look for profitable or near-profitable businesses with identifiable unit economics and a route to scale across the EU.",
      minInvestment: "500000.00",
      maxInvestment: "3000000.00",
      preferredCountries: ["Poland", "Estonia", "Germany"],
      preferredCategories: ["Fintech", "Lending"],
    },
  },
  {
    id: "user-buyer-daniel-kwan",
    name: "Daniel Kwan",
    email: "daniel.kwan@harborpeak.demo",
    role: "BUYER",
    status: "ACTIVE",
    company: "Harbor Peak Ventures",
    country: "Singapore",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&h=320&fit=crop&crop=faces",
    profile: {
      bio: "Cross-border investor looking for payments, wealth, and infrastructure assets in Asia and the GCC.",
      investmentThesis:
        "I prefer assets with strategic corridor coverage, compliance-heavy moats, and enough scale to support bolt-on expansion.",
      minInvestment: "2000000.00",
      maxInvestment: "8000000.00",
      preferredCountries: ["Singapore", "UAE", "United Kingdom"],
      preferredCategories: ["Payments", "Wealth Management"],
    },
  },
  {
    id: "user-buyer-sofia-reyes",
    name: "Sofia Reyes",
    email: "sofia.reyes@iberisgrowth.demo",
    role: "BUYER",
    status: "ACTIVE",
    company: "Iberis Growth Partners",
    country: "Spain",
    avatarUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=320&h=320&fit=crop&crop=faces",
    profile: {
      bio: "Growth investor with a focus on compliant crypto and fintech platforms in Europe.",
      investmentThesis:
        "I target assets that combine regulation, product depth, and a business model that can be expanded into adjacent financial services.",
      minInvestment: "750000.00",
      maxInvestment: "4000000.00",
      preferredCountries: ["Spain", "Estonia", "Lithuania"],
      preferredCategories: ["Crypto", "Fintech"],
    },
  },
  {
    id: "user-buyer-lukas-meyer",
    name: "Lukas Meyer",
    email: "lukas.meyer@rhinemerchant.demo",
    role: "BUYER",
    status: "ACTIVE",
    company: "Rhine Merchant Capital",
    country: "Germany",
    avatarUrl: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=320&h=320&fit=crop&crop=faces",
    profile: {
      bio: "Control investor focused on banking infrastructure, EMI businesses, and regulated fintech with enterprise distribution.",
      investmentThesis:
        "I prefer businesses that can sell into financial institutions or merchants with a product that is already integrated into customer workflows.",
      minInvestment: "1500000.00",
      maxInvestment: "6000000.00",
      preferredCountries: ["Germany", "United Kingdom", "Poland"],
      preferredCategories: ["Banking", "EMI", "Payments"],
    },
  },
  {
    id: "user-buyer-emma-clarke",
    name: "Emma Clarke",
    email: "emma.clarke@bluecove.demo",
    role: "BUYER",
    status: "ACTIVE",
    company: "BlueCove Investments",
    country: "United Kingdom",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=320&h=320&fit=crop&crop=faces",
    profile: {
      bio: "Buyer for sub-5m platforms in lending and wealth with clear cash generation.",
      investmentThesis:
        "I like straightforward businesses that are easy to diligence, generate recurring revenue, and do not require heavy restructuring.",
      minInvestment: "300000.00",
      maxInvestment: "2000000.00",
      preferredCountries: ["United Kingdom", "Spain"],
      preferredCategories: ["Lending", "Wealth Management"],
    },
  },
  {
    id: "user-buyer-asta-jankauskiene",
    name: "Asta Jankauskiene",
    email: "asta.jankauskiene@baltichorizon.demo",
    role: "BUYER",
    status: "ACTIVE",
    company: "Baltic Horizon",
    country: "Lithuania",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=320&h=320&fit=crop&crop=faces",
    profile: {
      bio: "Regional buyer focused on EMI and payment assets with Baltic or UK exposure.",
      investmentThesis:
        "I target licensed businesses that already have bank relationships, local market traction, and obvious adjacent expansion opportunities.",
      minInvestment: "1000000.00",
      maxInvestment: "5000000.00",
      preferredCountries: ["Lithuania", "Estonia", "United Kingdom"],
      preferredCategories: ["Payments", "EMI", "Fintech"],
    },
  },
  {
    id: "user-buyer-omar-farouk",
    name: "Omar Farouk",
    email: "omar.farouk@gulfmeridian.demo",
    role: "BUYER",
    status: "ACTIVE",
    company: "Gulf Meridian Capital",
    country: "UAE",
    avatarUrl: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=320&h=320&fit=crop&crop=faces",
    profile: {
      bio: "GCC sponsor targeting regulated fintech, crypto, and payment businesses with regional expansion potential.",
      investmentThesis:
        "I focus on assets that can be scaled across the GCC and Southeast Asia once the compliance and banking stack is proven.",
      minInvestment: "1000000.00",
      maxInvestment: "7000000.00",
      preferredCountries: ["UAE", "Singapore"],
      preferredCategories: ["Crypto", "Fintech", "Payments"],
    },
  },
];

const contactRequests = [
  {
    id: "contact-adrian-to-cleargate-emi",
    senderEmail: "adrian.cole@stonebridge.demo",
    recipientEmail: "victoria.bennett@cleargate.demo",
    assetTitle: "ClearGate EMI Authorization",
    message:
      "We are interested in the EMI authorization and want to understand the compliance pack, banking partners, and transition support.",
    status: "PENDING",
  },
  {
    id: "contact-marta-to-rheindigital-lending",
    senderEmail: "marta.nowak@northline.demo",
    recipientEmail: "markus.weber@rheindigital.demo",
    assetTitle: "Berlin Consumer Lending Platform",
    message:
      "We are reviewing the lending platform and would like to discuss portfolio quality, underwriting performance, and post-close operating leverage.",
    status: "ACCEPTED",
  },
  {
    id: "contact-sofia-to-iberacapital-crypto",
    senderEmail: "sofia.reyes@iberisgrowth.demo",
    recipientEmail: "elena.costa@iberacapital.demo",
    assetTitle: "Madrid Crypto Custody VASP",
    message:
      "The custody business looks aligned with our strategy. Please share the latest compliance summary and client concentration data.",
    status: "PENDING",
  },
  {
    id: "contact-daniel-to-gulfledger-wealth",
    senderEmail: "daniel.kwan@harborpeak.demo",
    recipientEmail: "faris.almansoori@gulfledger.demo",
    assetTitle: "Dubai Wealth Management Boutique",
    message:
      "We would like to understand recurring revenue, advisor retention, and whether the client base can support a regional platform roll-up.",
    status: "PENDING",
  },
  {
    id: "contact-lukas-to-balticlicencing-payments",
    senderEmail: "lukas.meyer@rhinemerchant.demo",
    recipientEmail: "tomas.petraitis@balticlicencing.demo",
    assetTitle: "Baltic Cross-Border Payments",
    message:
      "We are interested in the payment processor and would like to review scheme connectivity, settlement flows, and outstanding compliance items.",
    status: "DECLINED",
  },
  {
    id: "contact-emma-to-iberacapital-lending",
    senderEmail: "emma.clarke@bluecove.demo",
    recipientEmail: "elena.costa@iberacapital.demo",
    assetTitle: "Barcelona SME Lending Marketplace",
    message:
      "The SME lending marketplace fits our size range. Please share the current delinquency trend and concentration by origination channel.",
    status: "PENDING",
  },
];

async function main() {
  await db.user.upsert({
    where: { email: manager.email },
    create: manager,
    update: {
      name: manager.name,
      role: manager.role,
      status: manager.status,
      company: manager.company,
      country: manager.country,
      avatarUrl: manager.avatarUrl,
    },
  });

  for (const seller of sellers) {
    await db.user.upsert({
      where: { email: seller.email },
      create: {
        id: seller.id,
        name: seller.name,
        email: seller.email,
        role: seller.role,
        status: seller.status,
        company: seller.company,
        country: seller.country,
        avatarUrl: seller.avatarUrl,
        sellerProfile: {
          create: {
            bio: seller.profile.bio,
            companyDescription: seller.profile.companyDescription,
          },
        },
      },
      update: {
        name: seller.name,
        role: seller.role,
        status: seller.status,
        company: seller.company,
        country: seller.country,
        avatarUrl: seller.avatarUrl,
        sellerProfile: {
          upsert: {
            create: {
              bio: seller.profile.bio,
              companyDescription: seller.profile.companyDescription,
            },
            update: {
              bio: seller.profile.bio,
              companyDescription: seller.profile.companyDescription,
            },
          },
        },
      },
    });

    for (const asset of seller.assets) {
      await db.asset.upsert({
        where: { id: asset.id },
        create: {
          id: asset.id,
          sellerId: seller.id,
          title: asset.title,
          description: asset.description,
          country: asset.country,
          category: asset.category,
          assetType: asset.assetType,
          businessStatus: asset.businessStatus,
          askingPrice: decimal(asset.askingPrice),
          currency: asset.currency,
          employees: asset.employees,
          foundedYear: asset.foundedYear,
          licenseType: asset.licenseType,
          status: asset.status,
        },
        update: {
          sellerId: seller.id,
          title: asset.title,
          description: asset.description,
          country: asset.country,
          category: asset.category,
          assetType: asset.assetType,
          businessStatus: asset.businessStatus,
          askingPrice: decimal(asset.askingPrice),
          currency: asset.currency,
          employees: asset.employees,
          foundedYear: asset.foundedYear,
          licenseType: asset.licenseType,
          status: asset.status,
        },
      });
    }
  }

  for (const buyer of buyers) {
    await db.user.upsert({
      where: { email: buyer.email },
      create: {
        id: buyer.id,
        name: buyer.name,
        email: buyer.email,
        role: buyer.role,
        status: buyer.status,
        company: buyer.company,
        country: buyer.country,
        avatarUrl: buyer.avatarUrl,
        buyerProfile: {
          create: {
            bio: buyer.profile.bio,
            investmentThesis: buyer.profile.investmentThesis,
            minInvestment: decimal(buyer.profile.minInvestment),
            maxInvestment: decimal(buyer.profile.maxInvestment),
            preferredCountries: buyer.profile.preferredCountries,
            preferredCategories: buyer.profile.preferredCategories,
          },
        },
      },
      update: {
        name: buyer.name,
        role: buyer.role,
        status: buyer.status,
        company: buyer.company,
        country: buyer.country,
        avatarUrl: buyer.avatarUrl,
        buyerProfile: {
          upsert: {
            create: {
              bio: buyer.profile.bio,
              investmentThesis: buyer.profile.investmentThesis,
              minInvestment: decimal(buyer.profile.minInvestment),
              maxInvestment: decimal(buyer.profile.maxInvestment),
              preferredCountries: buyer.profile.preferredCountries,
              preferredCategories: buyer.profile.preferredCategories,
            },
            update: {
              bio: buyer.profile.bio,
              investmentThesis: buyer.profile.investmentThesis,
              minInvestment: decimal(buyer.profile.minInvestment),
              maxInvestment: decimal(buyer.profile.maxInvestment),
              preferredCountries: buyer.profile.preferredCountries,
              preferredCategories: buyer.profile.preferredCategories,
            },
          },
        },
      },
    });
  }

  const usersByEmail = new Map(
    (
      await db.user.findMany({
        select: { id: true, email: true },
      })
    ).map((user) => [user.email, user]),
  );

  const assetsByTitle = new Map(
    (
      await db.asset.findMany({
        select: { id: true, title: true },
      })
    ).map((asset) => [asset.title, asset]),
  );

  for (const request of contactRequests) {
    await db.contactRequest.upsert({
      where: { id: request.id },
      create: {
        id: request.id,
        senderId: usersByEmail.get(request.senderEmail).id,
        recipientId: usersByEmail.get(request.recipientEmail).id,
        assetId: assetsByTitle.get(request.assetTitle)?.id,
        message: request.message,
        status: request.status,
      },
      update: {
        senderId: usersByEmail.get(request.senderEmail).id,
        recipientId: usersByEmail.get(request.recipientEmail).id,
        assetId: assetsByTitle.get(request.assetTitle)?.id,
        message: request.message,
        status: request.status,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
