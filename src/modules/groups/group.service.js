import crypto from "crypto";
import { createGroupRepo, getAllDataBy, joinGroupRepo, getDataByField,getPendingReq,getAllDataByField} from "./group.repository.js";

export async function createGroupService({ name, description, ownerId, color }) {
  try {
    const joinCode = await generateGroupCode(name);
    const group = await createGroupRepo({ name, description, ownerId, joinCode, color });

    return {
      status: 201,
      message: "Group created successfully",
      data: group
    };
  } catch (err) {
    throw new Error("Failed to create group: " + err.message);
  }
}

export async function getGroupDetailsService(groupId) {
  return getGroupById(groupId);
}

// export async function getAllDataByService(dataNeed, data, tableName) {
//   return getAllDataBy(dataNeed, data, tableName);
// }

// PROPERLY FORMATTED
export async function joinGroupService(id,joinCode) {
  if (!checkIfJoinCodeExists(joinCode)) {
    return { status: 404, message: 'Invalid group code' };
  }
 
  const groupId = await getDataByField("id","join_code",joinCode,"Group");
  // TODO: CHECK MEMBERSHIP
  // ===============
  const pending = await getPendingReq(groupId.id,id);
  if (pending) {
    return { status: 409, message: 'Join request already pending' };
  }
  let join;
  try{
    join = await joinGroupRepo(id,joinCode,groupId.id);

  } catch (error) {
    throw error;
  }
  return { status: 201, message: 'Join request submitted', data: join };
  
}
// used
export async function getGroupsByIdService(id) {
  const groups =  await getAllDataByField("*","owner_id",id,"Group");
  return {status:201,message:"Join code fetched successfully",data:groups};
}

// TODO
export async function getInvitesByStatus(groupId, status) {
  return viewRequestsRepo(groupId, status);
}

// ========
async function checkIfJoinCodeExists(joinCode) {
  const group = await getAllDataBy("join_code", joinCode, "Group");
  return group && group.length > 0;
}



async function generateGroupCode(groupName) {
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
