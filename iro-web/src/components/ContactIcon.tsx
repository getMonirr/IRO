export function ContactIcon({ icon, value }: { icon: string; value: string }) {
  if (value.includes("facebook.com")) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-[#1877f2]"
        aria-label="Facebook"
        role="img"
      >
        <path
          fill="currentColor"
          d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.006 10.125 11.927v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.973h-1.515c-1.492 0-1.956.93-1.956 1.887v2.261h3.328l-.532 3.49h-2.796V24C19.612 23.079 24 18.092 24 12.073z"
        />
      </svg>
    );
  }

  return <span aria-hidden>{icon}</span>;
}
