export async function generateResponse(
    ai: Ai,
    prompt: string
) {
    const result = await ai.run(
        "@cf/google/gemma-4-26b-a4b-it",
        {
            prompt: prompt,
            max_tokens: 256
        }
    );

    return result;
}
