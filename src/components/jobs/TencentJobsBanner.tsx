import Link from "next/link";

/** 铺满统一主栏（1152），原图直出、不走压缩 */
export function TencentJobsBanner({ href }: { href?: string }) {
  const image = (
    <img
      src="/banners/tencent-jobs.jpg"
      alt="腾讯招聘专场 · 全是 AI 岗位"
      width={1024}
      height={245}
      className="block h-auto w-full"
    />
  );

  if (!href) return image;
  return <Link href={href}>{image}</Link>;
}
