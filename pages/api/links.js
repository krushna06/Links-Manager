import dbConnect from './utils/dbConnect';
import Link from './utils/Link';
import { useAuth } from '../../hooks/useAuth';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  const authHeader = req.headers.authorization;
  const uid = authHeader && authHeader.split(' ')[1];

  if (!uid) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  switch (method) {
    case 'GET':
      try {
        const links = await Link.find({ user: uid });
        res.status(200).json({ success: true, data: links });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case 'POST':
      try {
        const link = await Link.create({ ...req.body, user: uid });
        res.status(201).json({ success: true, data: link });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case 'PUT':
      try {
        const { id } = req.query;
        const updatedLink = await Link.findOneAndUpdate(
          { _id: id, user: uid },
          req.body,
          { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, data: updatedLink });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        await Link.findOneAndDelete({ _id: id, user: uid });
        res.status(204).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
