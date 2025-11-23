import express from 'express';
import { chatWithOpenAI } from '../utils/openaiClient.js';

const router = express.Router();

const SYSTEM_PROMPT = `You are an assistant embedded in a web app that turns CSV files into interactive dashboards and charts.

You help users understand how to use the app, interpret typical time-series and categorical charts, and think about trends, comparisons, and anomalies in data.

You do not have direct access to the user's actual data; answer in general terms based on common patterns in dashboards for analytics and energy/CSV datasets.

Be concise, clear, and non-technical unless the user asks for more detail.`;

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Message is required and must be a string',
        reply: 'Please provide a valid message.'
      });
    }

    const reply = await chatWithOpenAI(message, SYSTEM_PROMPT);
    
    res.json({ reply });
  } catch (error) {
    console.error('Error in chat route:', error);
    res.status(500).json({ 
      error: 'Failed to process chat message',
      reply: 'I apologize, but I encountered an error. Please try again later.'
    });
  }
});

export default router;

