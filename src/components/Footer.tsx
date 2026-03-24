import Link from "next/link";
import { site } from "@/lib/content";
import { FloatingCornerWidget } from "@/components/FloatingCornerWidget";
import {
  getContactInfosFromCMS,
  getFriendLinksFromCMS,
  getSiteFromCMSByCode,
  getStrapiMediaUrl,
  getThirdPartyContactsFromCMS,
} from "@/lib/cmsClient";

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

export async function Footer() {
  const [remoteSite, remoteContactInfos, remoteFriendLinks, remoteThirdPartyContacts] =
    await Promise.all([
      getSiteFromCMSByCode(),
      getContactInfosFromCMS(),
      getFriendLinksFromCMS(),
      getThirdPartyContactsFromCMS(),
    ]);

  const siteAttrs = remoteSite?.attributes ?? remoteSite;
  const hasRemoteData =
    Boolean(siteAttrs?.copyright || siteAttrs?.icp) ||
    remoteContactInfos.length > 0 ||
    remoteFriendLinks.length > 0 ||
    remoteThirdPartyContacts.length > 0;

  const contacts =
    remoteContactInfos.length > 0
      ? remoteContactInfos
          .map((item) => item.attributes ?? item)
          .filter((item) => item.label && item.value)
          .map((item) => ({
            label: item.label as string,
            value: item.value as string,
            href: item.href ?? "",
          }))
      : [
          { label: "电话", value: site.contact.phone, href: `tel:${site.contact.phone}` },
          { label: "地址", value: site.contact.address, href: "" },
        ];

  const friendLinks =
    remoteFriendLinks.length > 0
      ? remoteFriendLinks
          .map((item) => item.attributes ?? item)
          .filter((item) => item.name && item.url)
          .map((item) => ({
            label: item.name as string,
            href: item.url as string,
          }))
      : site.footer.links;

  const socialLinks = remoteThirdPartyContacts
    .map((item) => item.attributes ?? item)
    .filter((item) => item.name)
    .map((item) => ({
      name: item.name as string,
      href: item.url ?? "",
      qrcode: getStrapiMediaUrl(item.qrcode),
    }));
  const mergedSocialLinks =
    socialLinks.length > 0
      ? socialLinks
      : [
          ...(site.contact.wechat ? [{ name: "微信小程序", href: "", qrcode: "" }] : []),
          ...(site.contact.douyin ? [{ name: "抖音", href: "", qrcode: "" }] : []),
        ];

  const copyright = hasRemoteData
    ? siteAttrs?.copyright || site.footer.copyright
    : site.footer.copyright;
  const icp = hasRemoteData ? siteAttrs?.icp || site.footer.icp : site.footer.icp;
  const siteName = siteAttrs?.title || site.name;
  const siteDesc = siteAttrs?.description || site.description;

  return (
    <>
      <footer className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 pt-14 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/45">
              {siteName}
            </h3>
            <p className="mt-4 max-w-[360px] text-[14px] leading-7 text-black/68">
              {siteDesc}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/45">
                联系方式
              </h3>
              <ul className="mt-4 space-y-2.5">
                {contacts.map((item) => (
                  <li key={`${item.label}-${item.value}`} className="text-[13px] text-black/72">
                    <span className="mr-2 text-black/45">{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className="transition-colors hover:text-black">
                        {item.value}
                      </a>
                    ) : (
                      <span>{item.value}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/45">
                友情链接
              </h3>
              <ul className="mt-4 space-y-2.5">
                {friendLinks.map((link, idx) => {
                  const external = isExternalUrl(link.href);
                  return (
                    <li key={`${link.href}-${idx}`}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center text-[13px] text-black/72 transition-colors hover:text-black"
                        target={external ? "_blank" : undefined}
                        rel={external ? "noreferrer noopener" : undefined}
                      >
                        <span className="border-b border-transparent group-hover:border-black/25">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/45">
                其他渠道
              </h3>
              {mergedSocialLinks.length > 0 ? (
                <div className="mt-4">
                  <div className="flex flex-wrap items-center gap-3">
                    {mergedSocialLinks.map((item, idx) => {
                    const external = isExternalUrl(item.href);
                    return (
                      <div key={`${item.name}-${item.href || "empty"}-${idx}`} className="group relative">
                        {item.href ? (
                          <Link
                            href={item.href}
                            className="flex h-10 min-w-10 items-center justify-center rounded-full border border-black/15 bg-white px-3 text-[12px] text-black/70 transition hover:border-black/25 hover:text-black"
                            target={external ? "_blank" : undefined}
                            rel={external ? "noreferrer noopener" : undefined}
                            aria-label={item.name}
                          >
                            {item.qrcode ? (
                              <img src={item.qrcode} alt={item.name} className="h-5 w-5 rounded object-cover" />
                            ) : (
                              <span>{item.name.slice(0, 2)}</span>
                            )}
                          </Link>
                        ) : (
                          <span
                            className="flex h-10 min-w-10 items-center justify-center rounded-full border border-black/15 bg-white px-3 text-[12px] text-black/70"
                            aria-label={item.name}
                          >
                            {item.qrcode ? (
                              <img src={item.qrcode} alt={item.name} className="h-5 w-5 rounded object-cover" />
                            ) : (
                              <span>{item.name.slice(0, 2)}</span>
                            )}
                          </span>
                        )}

                        {item.qrcode && (
                          <div className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-20 hidden -translate-x-1/2 rounded-xl border border-black/10 bg-white p-2 shadow-[0_12px_30px_rgba(0,0,0,0.14)] group-hover:block">
                            <img src={item.qrcode} alt={`${item.name}二维码`} className="h-28 w-28 rounded object-cover" />
                            <p className="mt-1 text-center text-[11px] text-black/65">{item.name}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-[13px] text-black/52">更多渠道正在接入中</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-black/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] tracking-wide text-black/56">
            {copyright}
          </p>
          {icp && (
            <p className="text-[11px] tracking-wide text-black/44">
              {icp}
            </p>
          )}
        </div>
        </div>
      </footer>
      <FloatingCornerWidget channels={mergedSocialLinks.slice(0, 3)} />
    </>
  );
}
