export function verifyMakeWebhook(req: any): boolean {
  const secret = process.env.MAKE_WEBHOOK_SECRET
  const receivedSecret = req.headers['x-make-secret']

  return receivedSecret === secret
}
