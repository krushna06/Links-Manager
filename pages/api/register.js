import { dbConnect } from './utils/dbConnect';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const user = new User({ username, password });
    await user.save();

    return res.status(201).json({ success: true });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
