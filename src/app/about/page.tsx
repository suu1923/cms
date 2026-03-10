import { about, site } from "@/lib/content";
import { getAboutFromCMS, getSiteFromCMS } from "@/lib/cmsClient";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "关于我们 | 山东航宇游艇",
  description: about.summary,
};

export default async function AboutPage() {
  // 优先从 Strapi 读取，没有则用本地 JSON
  const [remoteAbout, remoteSite] = await Promise.all([getAboutFromCMS(), getSiteFromCMS()]);
  const aboutData = remoteAbout ?? about;
  const siteData = remoteSite ?? site;

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />

      {/* 顶部标题区 */}
      <section className="border-b border-black/6 bg-black/[0.02] pt-28 pb-16 sm:pt-36 sm:pb-20">
        <div className="mx-auto max-w-[800px] px-6 text-center sm:px-8">
          <p className="text-[11px] font-medium uppercase tracking-widest text-black/50">
            {aboutData.subtitle}
          </p>
          <h1 className="mt-4 text-4xl font-extralight tracking-tight sm:text-5xl">
            {aboutData.title}
          </h1>
        </div>
      </section>

      {/* 摘要 + 正文 */}
      <section className="mx-auto max-w-[720px] px-6 py-16 sm:px-8 sm:py-24">
        <p className="text-[17px] leading-relaxed text-black/85 sm:text-[18px]">
          {aboutData.summary}
        </p>
        <div className="mt-12 space-y-8">
          {aboutData.body?.map((para, i) => (
            <p
              key={i}
              className="text-[15px] leading-[1.85] text-black/75"
            >
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* 数据条 */}
      {aboutData.stats && aboutData.stats.length > 0 && (
        <section className="border-y border-black/6 bg-black/[0.02] py-14 sm:py-16">
          <div className="mx-auto max-w-[1000px] px-6 sm:px-8">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
              {aboutData.stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="block text-4xl font-extralight tracking-tight text-black sm:text-5xl">
                    {stat.value}
                  </span>
                  <span className="mt-2 block text-[13px] uppercase tracking-wider text-black/55">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 联系我们 */}
      <section className="mx-auto max-w-[720px] px-6 py-20 sm:px-8 sm:py-28">
        <p className="text-[11px] font-medium uppercase tracking-widest text-black/50">
          联系我们
        </p>
        <h2 className="mt-4 text-2xl font-extralight tracking-tight sm:text-3xl">
          欢迎洽谈合作
        </h2>
        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:gap-12">
          <div>
            <p className="text-[12px] uppercase tracking-wider text-black/50">
              电话
            </p>
            <a
              href={`tel:${siteData.contact.phone}`}
              className="mt-1 block text-[18px] font-medium text-black hover:underline"
            >
              {siteData.contact.phone}
            </a>
          </div>
          <div>
            <p className="text-[12px] uppercase tracking-wider text-black/50">
              地址
            </p>
            <p className="mt-1 text-[16px] leading-relaxed text-black/85">
              {siteData.contact.address}
            </p>
          </div>
          {siteData.contact.wechat && (
            <div>
              <p className="text-[12px] uppercase tracking-wider text-black/50">
                微信
              </p>
              <p className="mt-1 text-[16px] text-black/85">
                {siteData.contact.wechat}
              </p>
            </div>
          )}
          {siteData.contact.douyin && (
            <div>
              <p className="text-[12px] uppercase tracking-wider text-black/50">
                抖音
              </p>
              <p className="mt-1 text-[16px] text-black/85">
                {siteData.contact.douyin}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
