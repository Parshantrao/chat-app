import { httpRouter } from "convex/server";
import { createUser, getUser } from "./user";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";

const validatePayload = async (req) => {
    const payload = await req.text()

    const svixHeaders = {
        'svix-id': req.headers.get('svix-id') ?? "",
        'svix-timestamp': req.headers.get('svix-timestamp') ?? "",
        'svix-signature': req.headers.get('svix-signature') ?? "",
    }

    const sivxWebhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

    try {
        const event = sivxWebhook.verify(payload, svixHeaders);
        return event
    }
    catch (err) {
        console.error("Clerk webhook request could not be verified")
        return
    }
}
const handleClerkWebhook = httpAction(async (ctx, request) => {
    const event = await validatePayload(request)

    if (!event) {
        return new Response("Could not validate Clerk payload", { status: 400 })
    }
    const user = await ctx.runQuery(internal.user.getUser, {
        user_clerkId: event.data.id
    });

    switch (event.type) {
        case "user.created": {

            console.log('user', user,user.data)

            if (user?.data) {
                console.log(`Updating user ${event.data.id} with: ${event.data}`)
            }
            else {
                console.log('creating user')
                await ctx.runMutation(internal.user.createUser, {
                    user_name: `${event.data.first_name} ${event.data.last_name ? event.data.last_name : ""}`,
                    image_url: event.data.image_url,
                    email: event.data.email_addresses[0].email_address,
                    user_clerkId: event.data.id
                })
            }
            break
        }
        case "user.updated": {
            console.log("Creating/Updating User:", event.data.id)

            await ctx.runMutation(internal.user.updateUser, {
                id:user.data._id,
                user_name: `${event.data.first_name} ${event.data.last_name ? event.data.last_name : ""}`,
                image_url: event.data.image_url,
                email: event.data.email_addresses[0].email_address,
                user_clerkId: event.data.id
            })
            break;
        }
        default:
            console.log("Clerk webhook event not supported", event.type)
    }
    return new Response(null, {
        status: 200
    })
})

const http = httpRouter()
http.route({
    path: "/clerk-users-webhook",
    method: "POST",
    handler: handleClerkWebhook
})

export default http
