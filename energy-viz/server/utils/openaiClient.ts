import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function chatWithOpenAI(
  userMessage: string,
  systemPrompt: string
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const reply = completion.choices[0]?.message?.content;
    
    if (!reply) {
      throw new Error('No reply from OpenAI');
    }

    return reply;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

