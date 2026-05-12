import { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  const env = process.env;
  const def_pref = "MADECC";
  const def_year = "2026";
  const def = (role: string) => `${role}_${def_pref}_${def_year}`;

  // GET: Fetch keys
  if (event.httpMethod === "GET") {
    const keys = {
      'CEO': env.CEO_ACCESS_KEY || def('CEO'),
      'PROJECT_MANAGER': env.PM_ACCESS_KEY || def('PM'),
      'CONTENT_EDITOR': env.CE_ACCESS_KEY || def('CE'),
      'FINANCIAL_OFFICER': env.FO_ACCESS_KEY || def('FO'),
      'ACCOUNTANT': env.ACC_ACCESS_KEY || def('ACC'),
      'SECRETARY': env.SEC_ACCESS_KEY || def('SEC')
    };
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(keys),
    };
  }

  // NOTE: On Netlify (Serverless), updates to files don't persist.
  // For a real production app, you should connect this to a database like Firebase.
  if (event.httpMethod === "POST") {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        success: true, 
        message: "Note: Key updates in this demo enviroment are non-persistent without a database connection." 
      }),
    };
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};
