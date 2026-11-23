"use client";
import { useParams } from "next/navigation";
import { Loading, Notice, PageTitle } from "@/components/admin/ui";
import { ProgramForm } from "@/components/admin/ProgramForm";
import { useFetch } from "@/lib/admin/hooks";
import type { ProgramRec } from "@/lib/admin/types";

export default function EditProgram() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useFetch<ProgramRec>(`/programs/${id}`);
  if (loading) return <Loading />;
  if (error || !data) return <Notice>{error ?? "Not found"}</Notice>;
  return (<><PageTitle title={`Edit: ${data.title.bn || data.slug}`} /><ProgramForm initial={data} /></>);
}
