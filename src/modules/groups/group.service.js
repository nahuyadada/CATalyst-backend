import crypto from "crypto";
import { createGroupRepo, getGroupById } from "./group.repository.js";

export async function createGroup({name, description, ownerId}) {
  const joinCode = await generateGroupCode(name);
  // console.log("Generated Join Code:", joinCode);
  return createGroupRepo({ name, description, ownerId, joinCode });
}

export async function getGroupDetailsService(groupId) {
  return getGroupById(groupId);
}

export async function getAllDataByService(dataNeed, data, tableName) {
  return getAllDataBy(dataNeed, data, tableName);
}
async function checkIfJoinCodeExists(joinCode) {
  const { data, error } = await supabase
    .from("Group")
    .select("join_code")
    .eq("join_code", joinCode)
    .single();



}


async function generateGroupCode(groupName) {
    console.log("Generating join code for group name:", groupName);
  if (!groupName || typeof groupName !== "string") {
    throw new Error("Invalid group name");
  }

  const words = groupName.trim().split(/\s+/);

  const firstLetter = words[0][0].toUpperCase();
  const lastLetter =
    words.length > 1
      ? words[words.length - 1][0].toUpperCase()
      : words[0][words[0].length - 1].toUpperCase();


  const randomPart = crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase()
    .slice(0, 6);

  // Final code: letters + numbers only, no symbols, no spaces
  return `${firstLetter}${lastLetter}-${randomPart}`;
}
