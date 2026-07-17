import { useLocalParticipant } from "@livekit/react-native";
import { useEffect } from "react";

export default function MicDebug() {
    const { localParticipant } = useLocalParticipant();

    useEffect(() => {
        const interval = setInterval(async () => {
            const pub = Array.from(localParticipant.trackPublications.values()).find(
                (p) => p.source === "microphone"
            );

            const track = pub?.track;
            if (!track) return;

            try {
                const stats = await track.getRTCStatsReport();
                if (!stats) return;

                stats.forEach((report) => {
                    if (report.type === "outbound-rtp" && report.kind === "audio") {
                        console.log("[MicDebug] sampleRate:", report.sampleRate);
                    }
                });
            } catch (e) {
                console.log("[MicDebug] stats error:", e);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [localParticipant]);

    return null;
}
