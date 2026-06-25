const { GoogleGenerativeAI } = require('@google/generative-ai');
exports.chatWithMentor = async (req, res) => {
    try {
        const { prompt } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'your_key_here') {
            return res.status(500).json({ error: "Oops! Gemini API Key is missing. Please add it to your .env file." });
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        const formattedInstruction = `You are a helpful study buddy and mentor. Please give short and easy to understand advice. Be friendly. User says: ${prompt}`;
        const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro"];
        let finalResponse = null;
        for (let m of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent(formattedInstruction);
                finalResponse = result.response.text();
                console.log(`🟢 AI replied successfully using ${m}`);
                break; 
            } catch (e) {
                console.log(`🔴 Could not use ${m}, trying another one...`);
            }
        }
        if (!finalResponse) {
             return res.status(500).json({ error: "Google is blocking the AI in your area right now. Try a VPN or a new API key." });
        }
        res.status(200).json({ reply: finalResponse });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not connect to the AI. " + err.message });
    }
}
