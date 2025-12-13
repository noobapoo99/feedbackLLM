import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export async function startAssistantStream(io, socket, chatId) {
  console.log("🤖 AI streaming started…");

  const assistantMsg = await prisma.chatMessage.create({
    data: {
      chatId,
      sender: "assistant",
      message: "",
    },
  });

  const msgId = assistantMsg.id;
  let full = "";

  socket.emit("assistant:start", { id: msgId });

  const fakeTokens = ["Hello", " ", "I", " ", "am", " ", "AI!"];

  for (const t of fakeTokens) {
    full += t;

    socket.emit("assistant:token", {
      id: msgId,
      chunk: t,
    });

    await new Promise((r) => setTimeout(r, 60));
  }

  await prisma.chatMessage.update({
    where: { id: msgId },
    data: { message: full },
  });

  socket.emit("assistant:done", { id: msgId, full });
}
