import { Hono } from "hono";
import { verifyDiscord } from "../lib/helpers";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { Verification } from "../db/schema";

export const discordRouter = new Hono();

discordRouter.get("/discord-interactions", async (c) => {
  return c.json({ type: 1 });
});

// discordRouter.post("/discord-interactions", async (c) => {
//   const signature = c.req.header("X-Signature-Ed25519");
//   const timestamp = c.req.header("X-Signature-Timestamp");

//   if (!signature || !timestamp) {
//     return c.json({ error: "Missing signature headers" }, 401);
//   }

//   // Get the raw body for signature verification
//   const rawBody = await c.req.text();

//   // Verify the request is coming from Discord
//   // const isValid = await verifyDiscord(
//   //   rawBody,
//   //   signature,
//   //   timestamp,
//   //   process.env.DISCORD_PUBLIC_KEY!
//   // );

//   const isValid = true;

//   if (!isValid) {
//     return c.json({ error: "Invalid signature" }, 401);
//   }

//   // Parse the request body
//   const interaction = JSON.parse(rawBody);

//   // Handle different interaction types
//   if (interaction.type === 1) {
//     // This is a PING from Discord
//     return c.json({ type: 1 }); // Return a PONG
//   }

//   if (interaction.type === 2) {
//     // APPLICATION_COMMAND
//     // Handle slash commands here if needed
//     return c.json({
//       type: 4,
//       data: { content: "Command processed!" },
//     });
//   }

//   if (interaction.type === 3) {
//     // COMPONENT_INTERACTION (button clicks)
//     const customId = interaction.data.custom_id;

//     // Extract the action and verification ID
//     const [action, verificationId] = customId.split(":");

//     if (!verificationId) {
//       return c.json({
//         type: 4,
//         data: { content: "Invalid verification ID" },
//       });
//     }

//     try {
//       if (action === "approve_verification") {
//         // Update verification status in the database
//         await db
//           .update(Verification)
//           .set({
//             status: "approved",
//             updatedAt: new Date(),
//           })
//           .where(eq(Verification.id, verificationId));

//         // Update the message to show it's been approved
//         return c.json({
//           type: 7, // UPDATE_MESSAGE
//           data: {
//             embeds: [
//               {
//                 ...interaction.message.embeds[0],
//                 color: 0x00ff00, // Green
//                 fields: interaction.message.embeds[0].fields.map(
//                   (field: any) => {
//                     if (field.name === "Status") {
//                       return {
//                         ...field,
//                         value: "✅ Approved",
//                       };
//                     }
//                     return field;
//                   }
//                 ),
//               },
//             ],
//             components: [], // Remove the buttons
//           },
//         });
//       } else if (action === "reject_verification") {
//         // Update verification status in the database
//         await db
//           .update(Verification)
//           .set({
//             status: "rejected",
//             updatedAt: new Date(),
//           })
//           .where(eq(Verification.id, verificationId));

//         // Update the message to show it's been rejected
//         return c.json({
//           type: 7, // UPDATE_MESSAGE
//           data: {
//             embeds: [
//               {
//                 ...interaction.message.embeds[0],
//                 color: 0xff0000, // Red
//                 fields: interaction.message.embeds[0].fields.map(
//                   (field: any) => {
//                     if (field.name === "Status") {
//                       return {
//                         ...field,
//                         value: "❌ Rejected",
//                       };
//                     }
//                     return field;
//                   }
//                 ),
//               },
//             ],
//             components: [], // Remove the buttons
//           },
//         });
//       } else if (action === "view_verification") {
//         // Respond with a link to view the verification in your admin panel
//         const adminUrl = `${process.env.APP_URL}/admin/verifications/${verificationId}`;

//         return c.json({
//           type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
//           data: {
//             content: `View this verification in the admin panel: ${adminUrl}`,
//             flags: 64, // EPHEMERAL - only visible to the user who clicked
//           },
//         });
//       }
//     } catch (error) {
//       console.error("Error handling Discord interaction:", error);

//       return c.json({
//         type: 4,
//         data: {
//           content: "Error processing your request. Please check the logs.",
//           flags: 64, // EPHEMERAL - only visible to the user who clicked
//         },
//       });
//     }
//   }

//   // Default response for unhandled interaction types
//   return c.json({
//     type: 4,
//     data: { content: "Interaction not supported" },
//   });
// });
