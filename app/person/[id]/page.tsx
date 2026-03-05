import PersonClient from "@/components/PersonClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/person/${id}`,
    { cache: "no-store" }
  );

  const person = await res.json();

  return <PersonClient person={person} />;
}