interface ShareButtonsProps {
  toolName: string;
  url?: string;
}

export default function ShareButtons({ toolName, url }: ShareButtonsProps) {
  const shareText = `I just found the perfect tool for me — ${toolName}! Try it out:`;
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-text-muted">Share:</span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-2 text-sm bg-surface border border-border-custom rounded-lg hover:border-green-500/50 hover:text-green-400 transition-all duration-200"
      >
        WhatsApp
      </a>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-2 text-sm bg-surface border border-border-custom rounded-lg hover:border-blue-400/50 hover:text-blue-400 transition-all duration-200"
      >
        Twitter
      </a>
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-2 text-sm bg-surface border border-border-custom rounded-lg hover:border-blue-600/50 hover:text-blue-500 transition-all duration-200"
      >
        LinkedIn
      </a>
    </div>
  );
}
