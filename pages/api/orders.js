const { mongooseConnect } = require("@/lib/mongoose")
const { getServerSession } = require("next-auth")
const { authOptions } = require("./auth/[...nextauth]")
const { Order } = require("@/models/Order")

export default async function handle(req, res) {
    await mongooseConnect()
    const {user} = await getServerSession(req, res, authOptions)
    res.json(
       await Order.find({userEmail: user.email})
    )
}