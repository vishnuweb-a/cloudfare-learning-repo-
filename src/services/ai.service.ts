export async function generateResponse(
    ai: Ai,
    prompt: string
) {
    const result = await ai.run(
        "@cf/google/gemma-4-26b-a4b-it",
        {
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 256,
            chat_template_kwargs: {
                enable_thinking: false
            }
        }
    );

    return result;
}