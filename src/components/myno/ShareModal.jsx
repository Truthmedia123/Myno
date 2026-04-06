import React, { useState, useEffect } from "react";
import { getShareLinks } from "@/lib/utils";

export default function ShareModal() {
    const [show, setShow] = useState(false);
    const [shareText, setShareText] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            setShareText(e.detail.text);
            setShow(true);
        };
        window.addEventListener("myno_share", handler);
        return () => window.removeEventListener("myno_share", handler);
    }, []);

    if (!show) return null;

    const links = getShareLinks(shareText);

    const handleShare = (link) => {
        if (link.action === "copy" || !link.url) {
            navigator.clipboard.writeText(shareText).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        } else {
            window.open(link.url, "_blank");
        }
        setShow(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end" onClick={() => setShow(false)}>
            <div className="bg-card w-full rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
                <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
                <h3 className="text-base font-bold text-foreground mb-1">Share Your Progress</h3>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{shareText.substring(0, 80)}...</p>

                {/* Platform grid */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                    {links.map(link => (
                        <button
                            key={link.name}
                            onClick={() => handleShare(link)}
                            className="flex flex-col items-center gap-1.5"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${link.color} flex items-center justify-center text-xl shadow-sm`}>
                                {link.icon}
                            </div>
                            <span className="text-xs text-muted-foreground">{link.name}</span>
                        </button>
                    ))}
                </div>

                {copied && (
                    <p className="text-xs text-center text-green-500 font-medium mb-2">✓ Copied to clipboard!</p>
                )}

                <button
                    onClick={() => setShow(false)}
                    className="w-full py-3 rounded-2xl border border-border text-sm font-medium text-muted-foreground"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}