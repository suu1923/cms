import Link from "next/link";
import { site } from "@/lib/content";

export function Footer() {
  const { contact, footer } = site;

  return (
    <footer className="border-t border-black/8 bg-white">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-widest text-black/60">
              联系方式
            </h3>
            <p className="mt-4 text-[13px] text-black/80">
              <a href={`tel:${contact.phone}`} className="hover:text-black">
                {contact.phone}
              </a>
            </p>
            <p className="mt-1 text-[13px] text-black/70">{contact.address}</p>
            {contact.wechat && (
              <p className="mt-1 text-[13px] text-black/70">{contact.wechat}</p>
            )}
            {contact.douyin && (
              <p className="mt-1 text-[13px] text-black/70">{contact.douyin}</p>
            )}
          </div>
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-widest text-black/60">
              友情链接
            </h3>
            <ul className="mt-4 space-y-2">
              {footer.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-black/70 hover:text-black"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-black/8 pt-8">
          <p className="text-center text-[12px] text-black/60">
            {footer.copyright}
          </p>
          {footer.icp && (
            <p className="mt-1 text-center text-[11px] text-black/50">
              {footer.icp}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
