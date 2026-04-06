import {GoogleGenAI} from "@google/genai"
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
/*
We want a section-wise feedback of resume not a generic response, it should include a score of quality and impact,
brief about its strengths and limitations, check whether the skills, education, experience, projects are in the
right order or not, along with it the model should give formatting suggestions and ats optimization advice like
keyword optimization.
That's why we are giving the prompt for a structured JSON ouptut having all these things mentioned in it and which
can be easily extractable and formattable on our front-end too.
*/
export async function analyzeResume(resumecontent,jobrole,exp,desc) {
    try{
        /*
        We speicfy that we want to use gemini-3-flash-preview model for our resume Analysis
        and In contents array, we create a json object which contains our prompt to analyze
        resume in the form of text and give us its strengths and limitations.
        */
        const response=await ai.models.generateContent({
            model:"gemini-3-flash-preview",
            contents:[
                {
                    text:`Analyze this resume by taking consideration that the candidate is applying for the role of a ${jobrole} and have an experience of ${exp} and the job description is ${desc}:

${resumecontent}

Return ONLY valid JSON in this format:
{
  "score": number (1-100),
  "ATSScore": number (1-100),
  "Projects": give a qualtiy estimate number (1-100) based on the projects mentioned in the resume,
  "Experience": give a qualti estimate number (1-100) based on the experience mentioned in the resume,
  "summary": "...",
  "strengths": "...",
  "limitations": "...",
  "flowOrder": "...",
  "suggestions": "...",
  "formattingSuggestion": "...",
  "keywordOptimization": "suggest actionable improvements and give a list of missing keywordsw which should be included in the resume",
  "topfixes":"Give a list of 3 major improvements the user can do right now"
}`
                }
            ],
        })
        const parsedOutput=JSON.parse(response.text)
        return parsedOutput;
    }
    catch(error){
        console.log("Error:"+error);
        throw error;
    }
}