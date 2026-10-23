import { Poppins, Noto_Sans_Devanagari, Noto_Sans_Telugu } from "next/font/google";
import AppProviders from "@/components/AppProviders";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const notoDeva = Noto_Sans_Devanagari({
  variable: "--font-noto-deva",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
});

const notoTelugu = Noto_Sans_Telugu({
  variable: "--font-noto-telugu",
  subsets: ["telugu"],
  weight: ["400", "500", "600", "700"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f766e",
};

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://contact-desk.local"
  ),
  title: {
    default: "Constituency Contact Desk — MLA Office Management Platform",
    template: "%s | MLA Office Contact Desk",
  },
  description:
    "Centralized constituency management platform for MLA offices and citizens. Search contacts by geographical hierarchy, book appointments, track local development requests, and register volunteers.",
  applicationName: "Constituency Contact Desk",
  keywords: [
    "MLA office",
    "constituency contact desk",
    "MLA appointments",
    "volunteer registration",
    "citizen requests",
    "grievance redressal",
    "assembly constituency",
    "panchayat directory",
    "civic engagement",
    "local development requests",
    "constituent services",
  ],
  authors: [{ name: "Constituency Administration & IT Cell" }],
  creator: "Constituency Administration",
  publisher: "MLA Office",
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Constituency Contact Desk",
    title: "Constituency Contact Desk — MLA Office Platform",
    description:
      "Centralized civic contact management, appointments, volunteer coordination, and developmental requests across assembly constituencies.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Constituency Contact Desk — MLA Office Platform",
    description:
      "Centralized civic contact management, appointments, volunteer coordination, and developmental requests across assembly constituencies.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
      "hi-IN": "/?lang=hi",
      "te-IN": "/?lang=te",
    },
  },
  category: "Government & Public Services",
};

// Answer Engine Optimization (AEO) JSON-LD Knowledge Graph
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://contact-desk.local/#website",
      "url": "https://contact-desk.local",
      "name": "Constituency Contact Desk",
      "description":
        "Centralized MLA Office Platform for Constituency Contact Directory, Citizen Grievance Redressal, and Volunteer Management.",
      "inLanguage": ["en", "hi", "te"],
    },
    {
      "@type": "GovernmentOrganization",
      "@id": "https://contact-desk.local/#organization",
      "name": "MLA Constituency Office Desk",
      "url": "https://contact-desk.local",
      "description":
        "Public constituency administration desk coordinating developmental requests, public appointments, travel notifications, and volunteer networks.",
      "areaServed": {
        "@type": "AdministrativeArea",
        "name": "Assembly Constituency",
      },
      "knowsAbout": [
        "Constituency Grievance Redressal",
        "MLA Appointment Scheduling",
        "Community Volunteer Coordination",
        "Local Development Requests",
        "Geographical Contact Management",
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://contact-desk.local/#software",
      "name": "Constituency Contact Desk Application",
      "applicationCategory": "GovernmentApplication",
      "operatingSystem": "All modern web browsers",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR",
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://contact-desk.local/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the Constituency Contact Desk?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "The Constituency Contact Desk is a centralized civic portal connecting MLA office staff and citizens. It facilitates local development requests, appointment scheduling, volunteer registrations, and hierarchical contact directories across assembly constituencies.",
          },
        },
        {
          "@type": "Question",
          "name": "How can citizens submit local developmental requests to the MLA?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Citizens can submit requests by selecting their administrative area (Assembly, Block, Gram Panchayat, or Ward), specifying the category and urgency, describing the issue, and optionally attaching supporting documentation.",
          },
        },
        {
          "@type": "Question",
          "name": "How do volunteers register for constituency programs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Community members can register online by providing their name, mobile phone number, area of interest, and assembly location to join local social and civic outreach programs.",
          },
        },
        {
          "@type": "Question",
          "name": "How do MLA office staff members register and get verified?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Staff members register with their mobile number, assembly assignment, and official term dates, followed by taking a verification selfie and mobile confirmation. The account is subsequently reviewed and approved by the office administrator.",
          },
        },
        {
          "@type": "Question",
          "name": "What geographical administrative levels are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "The application organizes constituency data across Lok Sabha Constituency, Assembly Constituency, rural divisions (Block/Tehsil, Gram Panchayat, Village, Panchayat Ward), and urban divisions (Municipality, Municipal Ward, Locality).",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${notoDeva.variable} ${notoTelugu.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${poppins.className} min-h-full`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
