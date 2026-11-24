"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiPost } from "@/lib/api";
import type { Dict } from "@/lib/content/bn";
import { useState } from "react";

const TYPE_KEYS = ["volunteer", "member", "donor", "partner"];

export function JoinForm({
  locale,
  f,
}: {
  locale: string;
  f: Dict["ui"]["form"];
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState("sending");
    try {
      await apiPost("/api/v1/join-requests", { ...data, lang: locale });
      setState("done");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : f.retry);
      setState("error");
    }
  }

  if (state === "done")
    return (
      <Card>
        <CardContent className="p-5">{f.done}</CardContent>
      </Card>
    );

  const field = "mt-1 w-full";
  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <Label className="block text-sm font-semibold">
            {f.name}
            <Input name="name" required className={field} />
          </Label>
          <Label className="block text-sm font-semibold">
            {f.contact}
            <Input name="contact" required className={field} />
          </Label>
          <Label className="block text-sm font-semibold">
            {f.type}
            <Select name="type" defaultValue={TYPE_KEYS[0]}>
              <SelectTrigger className={field}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {f.types.map((x, i) => (
                  <SelectItem key={x} value={TYPE_KEYS[i]}>
                    {x}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Label>
          <Label className="block text-sm font-semibold">
            {f.message}
            <Textarea name="message" rows={4} className={field} />
          </Label>
          {state === "error" && (
            <p role="alert" className="text-sm text-red-700">
              {msg}
            </p>
          )}
          <Button disabled={state === "sending"} className="mt-2">
            {state === "sending" ? f.sending : f.send}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
