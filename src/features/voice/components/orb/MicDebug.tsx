import { useLocalParticipant } from "@livekit/react-native";

export default function MicDebug() {
    const { localParticipant } = useLocalParticipant();

    // useEffect(() => {
    //     const interval = setInterval(async () => {
    //         const pub = Array.from(localParticipant.trackPublications.values()).find(
    //             (p) => p.source === "microphone"
    //         );

    //         const sender = pub?.track;

    //         const stats = await sender?.getRTCStatsReport();

    //         console.log(stats);

    //     }, 1000);

    //     return () => clearInterval(interval);
    // }, [localParticipant]);

    return null;
}