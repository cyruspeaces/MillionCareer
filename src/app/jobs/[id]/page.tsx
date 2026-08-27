import { redirect } from "next/navigation";

export default async function JobDetailRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/jobs?job=${encodeURIComponent(id)}`);
}
