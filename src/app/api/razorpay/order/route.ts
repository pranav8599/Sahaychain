import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "rzp_secret_placeholder",
});

export async function POST(request: Request) {
  try {
    const { amount, caseId, userId } = await request.json();

    if (!amount || !caseId) {
      return NextResponse.json({ error: "Amount and caseId are required" }, { status: 400 });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise for INR)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder";

    let order;
    if (keyId === "rzp_test_placeholder") {
      // Mock order for hackathon demo without real API keys
      order = {
        id: `order_mock_${Date.now()}`,
        entity: "order",
        amount: options.amount,
        amount_paid: 0,
        amount_due: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        status: "created",
        attempts: 0,
        created_at: Math.floor(Date.now() / 1000),
      };
    } else {
      order = await razorpay.orders.create(options);
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error: any) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
