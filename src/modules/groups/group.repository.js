import supabase from "../../common/config/supabaseClient.js";

// Creates a group to be added in the database
export async function createGroupRepo({ name, description, ownerId, joinCode }) {

  const { data, error } = await supabase.from("Group").insert([{
    name,
    description,
    owner_id: ownerId,
    join_code: joinCode,
  }]).select().single();
  console.log("Supabase Insert Response:", { data, error });
  if (error) {
    throw new Error("Error creating group: " + error.message);
  }
  return data;
  
}
export async function joinGroupRepo(userId,joinCode,groupId) {
  console.log("Joining group with:", { userId, joinCode, groupId });
  const { data, error } = await supabase.from("group_join_request").insert([{
    user_id: userId,
    // join_code: joinCode,
    group_id: groupId
  }]).select().single();
  console.log("Supabase Insert Response:", { data, error });
  if (error) {
    throw new Error("Error joining group: " + error.message);
  }
  return data;
}

// Gets the data you want using an existing field in the table
export async function getDataByField(dataNeeded, field,value, tableName) {
  console.log(`Fetching ${dataNeeded} from ${tableName} where ${field} = ${value}`);
  const { data, error } = await supabase
    .from(tableName)
    .select(dataNeeded)
    .eq(field, value)
    .single();
  console.log("Supabase Select Response:", { data, error });
  if (error) {
      throw new Error("Group not found");
  }
  return data;
}

export async function getGroupById(groupId) {
  const { data, error } = await supabase
    .from("Group")
    .select("*")
    .eq("id", groupId)
    .single();
    if (error) {
        throw new Error("Group not found");
    }
    return data;
}


export async function getPendingReq(groupId, userId) {
  console.log(`Checking pending request for user ${userId} in group ${groupId}`);

  const { data: pendingRequest, error } = await supabase
    .from('group_join_request')
    .select('id')
    .eq('group_id', groupId)
    .eq('user_id', userId)
    .eq('status', 'pending')
    .maybeSingle();

  if (error) {
    console.error("Error fetching pending request:", error);
    throw error;
  }


  return pendingRequest; 
}







// select dataNeeded = joinCode where joinColumn = id from tableName
export async function getAllDataBy(dataNeed, value,tableName) {
  //   const { data, error } = await supabase
  //     .from(tableName)
  //     .select(dataNeed)
  //     .eq(dataNeed, value);
  // console.log("Supabase Select Response2:", { data, error });
  // if (error) {
  //     throw new Error("Group not found");
  // }
  // return data;
}