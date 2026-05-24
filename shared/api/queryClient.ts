import { QueryClient } from '@tanstack/react-query';

// ONE global cache manager
/**
 * 1. One global cache manager for all.
 * 2. When anywhere i use useQuery hook, it asks this queryClient for data. 
        QueryClient:1. "Hey, give me weather resource",
                    checks :    1. Is cached?
                                2. Is stale?
                                3. Already fetching?
                                4. Has subscribers?
                                5. Retry needed?
                    2. "Do you have it in cache? If yes, give it to me. 
                        If not, fetch it from network, store in cache and then give it to me"
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Retry failed requests once
      refetchOnWindowFocus: false, // Disable refetching on window focus
      refetchOnReconnect: true, // Disable refetching on reconnect
      staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
      gcTime: 30 * 60 * 1000, // Unused data will be garbage collected after 10 minutes
    },
  },
});

export default queryClient; // inject it to react tree using provider.