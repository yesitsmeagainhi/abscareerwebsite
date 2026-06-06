import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getSiteSettings } from "@/lib/content";

// Marketing chrome (header / footer / WhatsApp) wraps every public page but NOT
// the /studio CMS, which lives outside this route group.
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <>
      <Header phone={settings.phone} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton number={settings.whatsappNumber} />
    </>
  );
}
