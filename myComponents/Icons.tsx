import Image from "next/image";

export function ArrowDiagonal({ className }: { className: string }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className={className}
      >
        <path d="M7 7h10v10" />
        <path d="M7 17 17 7" />
      </svg>
    );
}