import { Globe } from "lucide-react";

export function ContactIcon({ icon, value }: { icon: string; value: string }) {
  if (value.includes("facebook.com")) {
    return (
      <Globe
        className="size-5 text-muted-foreground"
        aria-label="Social media"
        role="img"
      />
    );
  }

  return <span aria-hidden>{icon}</span>;
}
