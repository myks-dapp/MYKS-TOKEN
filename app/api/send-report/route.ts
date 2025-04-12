import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
  const { emails, amount, ipfsUrl } = await req.json()

  if (!emails || !amount || !ipfsUrl) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 })
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "belvana20.pma@gmail.com",
      pass: "hbvm srwy pavq fata", // app password
    },
  })

  const mailOptions = {
    from: "MYKS Global <belvana20.pma@gmail.com>",
    to: emails.join(","),
    subject: "MYKS Profit Distribution Report",
    html: `
      <h3>MYKS Monthly Profit Distribution</h3>
      <p>Dear Investor,</p>
      <p>The profit distribution for this month has been completed.</p>
      <p><strong>Amount:</strong> ${amount} USDC</p>
      <p><strong>Report:</strong> <a href="${ipfsUrl}" target="_blank">${ipfsUrl}</a></p>
      <br/>
      <p>Best regards,<br/>MYKS Team</p>
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    return NextResponse.json({ success: true, info })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Email failed", details: error }, { status: 500 })
  }
}