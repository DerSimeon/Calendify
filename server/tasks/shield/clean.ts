import type { RateLimit } from "#imports";

export default defineTask({
    meta: {
        description: "Clean expired bans",
    },
    async run() {
        const shieldStorage = useStorage("shield");

        const keys = await shieldStorage.getKeys();
        for (const key of keys) {
            const rateLimit = (await shieldStorage.getItem(key)) as RateLimit;
            if (isBanExpired(rateLimit)) {
                await shieldStorage.removeItem(key);
            }
        }
        return { result: keys };
    },
});