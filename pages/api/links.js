import dbConnect from './utils/dbConnect';
import Link from './utils/Link';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const links = await Link.find({});
        res.status(200).json({ success: true, data: links });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const link = await Link.create(req.body);
        res.status(201).json({ success: true, data: link });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const { id } = req.query;
        await Link.findByIdAndDelete(id);
        res.status(204).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const { id } = req.query;
        const updatedLink = await Link.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        res.status(200).json({ success: true, data: updatedLink });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
