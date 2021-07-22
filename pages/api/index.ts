import { NextApiRequest, NextApiResponse } from 'next'

import { match } from 'ts-pattern'
import { bot } from '../../src/index'

type HTTP_METHOD = 'GET' | 'POST' | 'PUT' | 'DELETE'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method as HTTP_METHOD

  await match(method)
    .with('POST', async () => {
      await bot.handleUpdate(req.body)
      res.status(200).json({ name: 'OK' })
    })
    .otherwise(() => res.status(403).json({ name: 'Method not allowed' }))
}
