export default function handler(req, res) {
  // stub for Make.com webhook
  const event = req.body
  console.log("Webhook event:", event)
  res.status(200).send({ ok: true })
}
