import { NextApiHandler } from "next";

import initAuth from "../../firebase/auth/initAuth";

initAuth();

const handler: NextApiHandler = async (req, res) => {
  console.log("bbb", req, res);
  try {
    
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e });
  }
  return res.status(200).json({ status: true });
};

export default handler;
